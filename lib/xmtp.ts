import { Client, Conversation } from '@xmtp/xmtp-js';
import { Message } from '@/types';

export class XMTPService {
  private client: Client | null = null;
  private conversations: Map<string, Conversation> = new Map();

  async initialize(walletClient: any): Promise<void> {
    try {
      this.client = await Client.create(walletClient, {
        env: 'production',
      });
      console.log('XMTP client initialized');
    } catch (error) {
      console.error('Error initializing XMTP client:', error);
      throw error;
    }
  }

  async getConversations(): Promise<Conversation[]> {
    if (!this.client) {
      throw new Error('XMTP client not initialized');
    }

    try {
      const conversations = await this.client.conversations.list();
      
      // Cache conversations
      conversations.forEach(conv => {
        this.conversations.set(conv.peerAddress, conv);
      });

      return conversations;
    } catch (error) {
      console.error('Error fetching conversations:', error);
      return [];
    }
  }

  async getOrCreateConversation(peerAddress: string): Promise<Conversation> {
    if (!this.client) {
      throw new Error('XMTP client not initialized');
    }

    // Check cache first
    if (this.conversations.has(peerAddress)) {
      return this.conversations.get(peerAddress)!;
    }

    try {
      const conversation = await this.client.conversations.newConversation(peerAddress);
      this.conversations.set(peerAddress, conversation);
      return conversation;
    } catch (error) {
      console.error('Error creating conversation:', error);
      throw error;
    }
  }

  async sendMessage(peerAddress: string, content: string): Promise<void> {
    try {
      const conversation = await this.getOrCreateConversation(peerAddress);
      await conversation.send(content);
    } catch (error) {
      console.error('Error sending message:', error);
      throw error;
    }
  }

  async getMessages(peerAddress: string): Promise<Message[]> {
    try {
      const conversation = await this.getOrCreateConversation(peerAddress);
      const xmtpMessages = await conversation.messages();

      return xmtpMessages.map(msg => ({
        id: msg.id,
        from: msg.senderAddress,
        to: peerAddress,
        content: msg.content,
        timestamp: msg.sent,
        encrypted: true,
        read: false, // You'd track this separately
      }));
    } catch (error) {
      console.error('Error fetching messages:', error);
      return [];
    }
  }

  async streamMessages(
    peerAddress: string,
    onMessage: (message: Message) => void
  ): Promise<() => void> {
    try {
      const conversation = await this.getOrCreateConversation(peerAddress);
      
      const stream = await conversation.streamMessages();
      
      const processMessages = async () => {
        for await (const msg of stream) {
          const message: Message = {
            id: msg.id,
            from: msg.senderAddress,
            to: peerAddress,
            content: msg.content,
            timestamp: msg.sent,
            encrypted: true,
            read: false,
          };
          onMessage(message);
        }
      };

      processMessages();

      // Return cleanup function
      return () => {
        stream.return?.();
      };
    } catch (error) {
      console.error('Error streaming messages:', error);
      return () => {};
    }
  }

  async canMessage(peerAddress: string): Promise<boolean> {
    if (!this.client) {
      return false;
    }

    try {
      return await this.client.canMessage(peerAddress);
    } catch (error) {
      console.error('Error checking if can message:', error);
      return false;
    }
  }

  isInitialized(): boolean {
    return this.client !== null;
  }

  getClientAddress(): string | null {
    return this.client?.address || null;
  }
}

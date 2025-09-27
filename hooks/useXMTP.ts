import { useState, useEffect, useCallback } from 'react';
import { useSigner } from 'wagmi';
import { XMTPService } from '@/lib/xmtp';
import { Message, Conversation } from '@/types';

export const useXMTP = () => {
  const { data: signer } = useSigner();
  const [xmtpService] = useState(() => new XMTPService());
  const [isInitialized, setIsInitialized] = useState(false);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Initialize XMTP
  useEffect(() => {
    const initialize = async () => {
      if (!signer) {
        setIsInitialized(false);
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        await xmtpService.initialize(signer);
        setIsInitialized(true);
      } catch (err) {
        console.error('Failed to initialize XMTP:', err);
        setError('Failed to connect to messaging network');
        setIsInitialized(false);
      } finally {
        setIsLoading(false);
      }
    };

    initialize();
  }, [signer, xmtpService]);

  // Load conversations
  const loadConversations = useCallback(async () => {
    if (!isInitialized) return;

    try {
      const xmtpConversations = await xmtpService.getConversations();
      
      const conversationsWithMessages = await Promise.all(
        xmtpConversations.map(async (conv) => {
          const messages = await xmtpService.getMessages(conv.peerAddress);
          const lastMessage = messages[messages.length - 1];
          
          return {
            peerAddress: conv.peerAddress,
            peerENS: undefined, // Would be resolved separately
            lastMessage,
            unreadCount: 0, // Would be tracked separately
            messages,
          };
        })
      );

      setConversations(conversationsWithMessages);
    } catch (err) {
      console.error('Error loading conversations:', err);
      setError('Failed to load conversations');
    }
  }, [isInitialized, xmtpService]);

  useEffect(() => {
    loadConversations();
  }, [loadConversations]);

  const sendMessage = useCallback(async (
    recipientAddress: string,
    content: string
  ): Promise<void> => {
    if (!isInitialized) {
      throw new Error('XMTP not initialized');
    }

    await xmtpService.sendMessage(recipientAddress, content);
    
    // Reload conversations to update UI
    await loadConversations();
  }, [isInitialized, xmtpService, loadConversations]);

  const getMessages = useCallback(async (
    peerAddress: string
  ): Promise<Message[]> => {
    if (!isInitialized) return [];
    
    return await xmtpService.getMessages(peerAddress);
  }, [isInitialized, xmtpService]);

  const streamMessages = useCallback((
    peerAddress: string,
    onMessage: (message: Message) => void
  ) => {
    if (!isInitialized) return () => {};
    
    return xmtpService.streamMessages(peerAddress, onMessage);
  }, [isInitialized, xmtpService]);

  const canMessage = useCallback(async (
    peerAddress: string
  ): Promise<boolean> => {
    if (!isInitialized) return false;
    
    return await xmtpService.canMessage(peerAddress);
  }, [isInitialized, xmtpService]);

  return {
    isInitialized,
    isLoading,
    error,
    conversations,
    sendMessage,
    getMessages,
    streamMessages,
    canMessage,
    loadConversations,
    xmtpService,
  };
};

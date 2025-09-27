import React, { useState, useEffect, useRef } from 'react';
import { useAccount, useSigner } from 'wagmi';
import { useRouter } from 'next/router';
import { toast } from 'react-hot-toast';
import { XMTPService } from '@/lib/xmtp';
import { ENSService } from '@/lib/ens';
import { Message, Conversation, ENSProfile } from '@/types';
import MessageBubble from '@/components/MessageBubble';
import ConversationList from '@/components/ConversationList';
import MessageComposer from '@/components/MessageComposer';
import ProfileCard from '@/components/ProfileCard';

const DashboardPage: React.FC = () => {
  const { address, isConnected } = useAccount();
  const { data: signer } = useSigner();
  const router = useRouter();
  
  const [xmtpService] = useState(() => new XMTPService());
  const [ensService] = useState(() => new ENSService());
  
  const [isXMTPInitialized, setIsXMTPInitialized] = useState(false);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConversation, setActiveConversation] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [profile, setProfile] = useState<ENSProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [newMessageAddress, setNewMessageAddress] = useState('');
  const [showNewMessage, setShowNewMessage] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Redirect if not connected
  useEffect(() => {
    if (!isConnected) {
      router.push('/');
    }
  }, [isConnected, router]);

  // Initialize XMTP
  useEffect(() => {
    const initializeXMTP = async () => {
      if (!signer || !address) return;

      try {
        setIsLoading(true);
        await xmtpService.initialize(signer);
        setIsXMTPInitialized(true);
        toast.success('Connected to XMTP network');
      } catch (error) {
        console.error('Failed to initialize XMTP:', error);
        toast.error('Failed to connect to messaging network');
      } finally {
        setIsLoading(false);
      }
    };

    initializeXMTP();
  }, [signer, address, xmtpService]);

  // Load profile and conversations
  useEffect(() => {
    const loadData = async () => {
      if (!address || !isXMTPInitialized) return;

      try {
        // Load ENS profile
        const ensProfile = await ensService.getENSProfile(address);
        const ensName = await ensService.resolveAddressToENS(address);
        
        setProfile({
          subname: ensName || '',
          displayName: ensProfile.displayName,
          avatar: ensProfile.avatar,
          inboxPointer: ensProfile.inboxPointer,
          address,
        });

        // Load conversations
        const xmtpConversations = await xmtpService.getConversations();
        const conversationsWithENS = await Promise.all(
          xmtpConversations.map(async (conv) => {
            const peerENS = await ensService.resolveAddressToENS(conv.peerAddress);
            const lastMessages = await xmtpService.getMessages(conv.peerAddress);
            const lastMessage = lastMessages[lastMessages.length - 1];
            
            return {
              peerAddress: conv.peerAddress,
              peerENS,
              lastMessage,
              unreadCount: 0, // You'd implement read tracking
              messages: lastMessages,
            };
          })
        );

        setConversations(conversationsWithENS);
      } catch (error) {
        console.error('Error loading data:', error);
        toast.error('Failed to load profile and conversations');
      }
    };

    loadData();
  }, [address, isXMTPInitialized, ensService, xmtpService]);

  // Load messages for active conversation
  useEffect(() => {
    const loadMessages = async () => {
      if (!activeConversation) {
        setMessages([]);
        return;
      }

      try {
        const conversationMessages = await xmtpService.getMessages(activeConversation);
        setMessages(conversationMessages);
      } catch (error) {
        console.error('Error loading messages:', error);
        toast.error('Failed to load messages');
      }
    };

    loadMessages();
  }, [activeConversation, xmtpService]);

  // Set up real-time message streaming
  useEffect(() => {
    if (!activeConversation || !isXMTPInitialized) return;

    const cleanup = xmtpService.streamMessages(activeConversation, (newMessage) => {
      setMessages(prev => [...prev, newMessage]);
      toast.success(`New message from ${newMessage.fromENS || newMessage.from.slice(0, 6)}...`);
    });

    return cleanup;
  }, [activeConversation, isXMTPInitialized, xmtpService]);

  // Auto-scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (content: string, recipientAddress?: string) => {
    const targetAddress = recipientAddress || activeConversation;
    if (!targetAddress || !content.trim()) return;

    try {
      await xmtpService.sendMessage(targetAddress, content);
      
      // Add message to local state immediately for better UX
      const newMessage: Message = {
        id: Date.now().toString(),
        from: address!,
        to: targetAddress,
        content,
        timestamp: new Date(),
        encrypted: true,
        read: true,
      };

      if (targetAddress === activeConversation) {
        setMessages(prev => [...prev, newMessage]);
      }

      // Update conversations list
      setConversations(prev => {
        const updated = [...prev];
        const convIndex = updated.findIndex(c => c.peerAddress === targetAddress);
        
        if (convIndex >= 0) {
          updated[convIndex].lastMessage = newMessage;
        } else {
          // New conversation
          updated.push({
            peerAddress: targetAddress,
            peerENS: undefined,
            lastMessage: newMessage,
            unreadCount: 0,
            messages: [newMessage],
          });
        }
        
        return updated;
      });

      if (recipientAddress) {
        setActiveConversation(recipientAddress);
        setShowNewMessage(false);
        setNewMessageAddress('');
      }

      toast.success('Message sent!');
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Failed to send message');
    }
  };

  const handleNewMessage = async () => {
    if (!newMessageAddress) {
      toast.error('Please enter a recipient address or ENS name');
      return;
    }

    let recipientAddress = newMessageAddress;
    
    // If it looks like an ENS name, resolve it
    if (newMessageAddress.includes('.eth')) {
      const resolved = await ensService.resolveENSToAddress(newMessageAddress);
      if (!resolved) {
        toast.error('Could not resolve ENS name');
        return;
      }
      recipientAddress = resolved;
    }

    // Check if we can message this address
    const canMessage = await xmtpService.canMessage(recipientAddress);
    if (!canMessage) {
      toast.error('This address is not available for messaging');
      return;
    }

    setActiveConversation(recipientAddress);
    setShowNewMessage(false);
    setNewMessageAddress('');
  };

  if (!isConnected) {
    return null; // Will redirect
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-400">Connecting to messaging network...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-[calc(100vh-8rem)]">
          {/* Profile & New Message */}
          <div className="lg:col-span-1 space-y-6">
            {profile && <ProfileCard profile={profile} />}
            
            <div className="card">
              <button
                onClick={() => setShowNewMessage(!showNewMessage)}
                className="btn-primary w-full"
              >
                New Message
              </button>
              
              {showNewMessage && (
                <div className="mt-4 space-y-3">
                  <input
                    type="text"
                    value={newMessageAddress}
                    onChange={(e) => setNewMessageAddress(e.target.value)}
                    placeholder="Enter address or ENS name"
                    className="input-field w-full"
                  />
                  <button
                    onClick={handleNewMessage}
                    className="btn-secondary w-full"
                  >
                    Start Conversation
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Conversations List */}
          <div className="lg:col-span-1">
            <ConversationList
              conversations={conversations}
              activeConversation={activeConversation}
              onSelectConversation={setActiveConversation}
            />
          </div>

          {/* Messages */}
          <div className="lg:col-span-2">
            {activeConversation ? (
              <div className="card h-full flex flex-col">
                {/* Chat Header */}
                <div className="border-b border-gray-700 pb-4 mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-blue-700 rounded-full flex items-center justify-center">
                      <span className="text-white font-semibold text-sm">
                        {conversations.find(c => c.peerAddress === activeConversation)?.peerENS?.[0]?.toUpperCase() || 
                         activeConversation.slice(2, 4).toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <h3 className="font-semibold">
                        {conversations.find(c => c.peerAddress === activeConversation)?.peerENS || 
                         `${activeConversation.slice(0, 6)}...${activeConversation.slice(-4)}`}
                      </h3>
                      <p className="text-sm text-gray-400">
                        {activeConversation.slice(0, 6)}...{activeConversation.slice(-4)}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto space-y-4 mb-4">
                  {messages.map((message) => (
                    <MessageBubble
                      key={message.id}
                      message={message}
                      isOwn={message.from === address}
                    />
                  ))}
                  <div ref={messagesEndRef} />
                </div>

                {/* Message Composer */}
                <MessageComposer
                  onSendMessage={(content) => handleSendMessage(content)}
                  disabled={!isXMTPInitialized}
                />
              </div>
            ) : (
              <div className="card h-full flex items-center justify-center">
                <div className="text-center">
                  <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-300 mb-2">
                    Select a conversation
                  </h3>
                  <p className="text-gray-400">
                    Choose a conversation from the list or start a new one
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;

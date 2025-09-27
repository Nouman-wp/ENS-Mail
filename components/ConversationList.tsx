import React from 'react';
import { Conversation } from '@/types';

interface ConversationListProps {
  conversations: Conversation[];
  activeConversation: string | null;
  onSelectConversation: (address: string) => void;
}

const ConversationList: React.FC<ConversationListProps> = ({
  conversations,
  activeConversation,
  onSelectConversation,
}) => {
  const formatTime = (timestamp: Date) => {
    const now = new Date();
    const diff = now.getTime() - new Date(timestamp).getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'now';
    if (minutes < 60) return `${minutes}m`;
    if (hours < 24) return `${hours}h`;
    if (days < 7) return `${days}d`;
    return new Date(timestamp).toLocaleDateString();
  };

  const truncateMessage = (content: string, maxLength: number = 50) => {
    if (content.length <= maxLength) return content;
    return content.substring(0, maxLength) + '...';
  };

  const getDisplayName = (conversation: Conversation) => {
    if (conversation.peerENS) {
      return conversation.peerENS;
    }
    return `${conversation.peerAddress.slice(0, 6)}...${conversation.peerAddress.slice(-4)}`;
  };

  const getAvatarInitial = (conversation: Conversation) => {
    if (conversation.peerENS) {
      return conversation.peerENS[0].toUpperCase();
    }
    return conversation.peerAddress.slice(2, 4).toUpperCase();
  };

  return (
    <div className="card h-full">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">Messages</h2>
        <div className="text-sm text-gray-400">
          {conversations.length} conversation{conversations.length !== 1 ? 's' : ''}
        </div>
      </div>

      {conversations.length === 0 ? (
        <div className="text-center py-8">
          <div className="w-12 h-12 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-3">
            <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
          </div>
          <p className="text-gray-400 text-sm">No conversations yet</p>
          <p className="text-gray-500 text-xs mt-1">Start a new message to begin</p>
        </div>
      ) : (
        <div className="space-y-2 overflow-y-auto max-h-[calc(100vh-16rem)]">
          {conversations.map((conversation) => (
            <div
              key={conversation.peerAddress}
              onClick={() => onSelectConversation(conversation.peerAddress)}
              className={`p-3 rounded-lg cursor-pointer transition-all duration-200 hover:bg-gray-800/50 ${
                activeConversation === conversation.peerAddress
                  ? 'bg-blue-900/30 border border-blue-700/50'
                  : 'bg-gray-800/20 hover:bg-gray-800/40'
              }`}
            >
              <div className="flex items-center space-x-3">
                {/* Avatar */}
                <div className="relative">
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-blue-700 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-white font-semibold text-sm">
                      {getAvatarInitial(conversation)}
                    </span>
                  </div>
                  {conversation.unreadCount > 0 && (
                    <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
                      <span className="text-xs text-white font-bold">
                        {conversation.unreadCount > 9 ? '9+' : conversation.unreadCount}
                      </span>
                    </div>
                  )}
                </div>

                {/* Conversation info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="font-medium text-white truncate">
                      {getDisplayName(conversation)}
                    </h3>
                    {conversation.lastMessage && (
                      <span className="text-xs text-gray-400 flex-shrink-0">
                        {formatTime(conversation.lastMessage.timestamp)}
                      </span>
                    )}
                  </div>
                  
                  {conversation.lastMessage ? (
                    <p className={`text-sm truncate ${
                      conversation.unreadCount > 0 ? 'text-white font-medium' : 'text-gray-400'
                    }`}>
                      {conversation.lastMessage.from === conversation.peerAddress ? '' : 'You: '}
                      {truncateMessage(conversation.lastMessage.content)}
                    </p>
                  ) : (
                    <p className="text-sm text-gray-500 italic">No messages yet</p>
                  )}
                </div>
              </div>

              {/* Online status indicator (placeholder) */}
              <div className="flex justify-end mt-2">
                <div className="flex items-center space-x-1">
                  {conversation.lastMessage?.encrypted && (
                    <svg className="w-3 h-3 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                    </svg>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ConversationList;

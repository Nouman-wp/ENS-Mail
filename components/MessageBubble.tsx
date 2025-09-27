import React from 'react';
import { Message } from '@/types';

interface MessageBubbleProps {
  message: Message;
  isOwn: boolean;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ message, isOwn }) => {
  const formatTime = (timestamp: Date) => {
    return new Date(timestamp).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const formatDate = (timestamp: Date) => {
    const date = new Date(timestamp);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString();
    }
  };

  return (
    <div className={`flex ${isOwn ? 'justify-end' : 'justify-start'} animate-slide-up`}>
      <div className={`message-bubble ${isOwn ? 'message-sent' : 'message-received'}`}>
        {/* Message content */}
        <div className="mb-2">
          <p className="text-sm leading-relaxed break-words">
            {message.content}
          </p>
        </div>

        {/* Message metadata */}
        <div className={`flex items-center justify-between text-xs ${
          isOwn ? 'text-blue-100' : 'text-gray-400'
        }`}>
          <span>{formatTime(message.timestamp)}</span>
          
          {/* Encryption indicator */}
          {message.encrypted && (
            <div className="flex items-center space-x-1">
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
              </svg>
              <span>E2E</span>
            </div>
          )}
        </div>

        {/* Read status for sent messages */}
        {isOwn && (
          <div className="flex justify-end mt-1">
            <div className={`text-xs ${message.read ? 'text-blue-300' : 'text-blue-100'}`}>
              {message.read ? '✓✓' : '✓'}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MessageBubble;

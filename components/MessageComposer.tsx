import React, { useState, useRef, useEffect } from 'react';

interface MessageComposerProps {
  onSendMessage: (content: string) => void;
  disabled?: boolean;
  placeholder?: string;
}

const MessageComposer: React.FC<MessageComposerProps> = ({
  onSendMessage,
  disabled = false,
  placeholder = "Type a message...",
}) => {
  const [message, setMessage] = useState('');
  const [isShiftPressed, setIsShiftPressed] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize textarea
  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = Math.min(textarea.scrollHeight, 120) + 'px';
    }
  }, [message]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || disabled) return;

    onSendMessage(message.trim());
    setMessage('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Shift') {
      setIsShiftPressed(true);
    }

    if (e.key === 'Enter' && !isShiftPressed && !disabled) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const handleKeyUp = (e: React.KeyboardEvent) => {
    if (e.key === 'Shift') {
      setIsShiftPressed(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="border-t border-gray-700 pt-4">
      <div className="flex items-end space-x-3">
        {/* Message input */}
        <div className="flex-1 relative">
          <textarea
            ref={textareaRef}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            onKeyUp={handleKeyUp}
            placeholder={placeholder}
            disabled={disabled}
            className="input-field w-full resize-none min-h-[44px] max-h-[120px] py-3 pr-12"
            rows={1}
          />
          
          {/* Character count */}
          {message.length > 0 && (
            <div className="absolute bottom-2 right-3 text-xs text-gray-400">
              {message.length}
            </div>
          )}
        </div>

        {/* Send button */}
        <button
          type="submit"
          disabled={!message.trim() || disabled}
          className="btn-primary px-4 py-3 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center min-w-[44px]"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
            />
          </svg>
        </button>
      </div>

      {/* Helper text */}
      <div className="flex items-center justify-between mt-2 text-xs text-gray-400">
        <div className="flex items-center space-x-4">
          <span>Press Enter to send, Shift+Enter for new line</span>
          {disabled && (
            <span className="text-yellow-400">Connecting to network...</span>
          )}
        </div>
        
        {/* Encryption indicator */}
        <div className="flex items-center space-x-1">
          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
          </svg>
          <span>End-to-end encrypted</span>
        </div>
      </div>
    </form>
  );
};

export default MessageComposer;

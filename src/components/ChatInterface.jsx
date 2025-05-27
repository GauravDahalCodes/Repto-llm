import React, { useState, useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown'; // Import ReactMarkdown

// New component for typing effect
function TypingMessage({ text, modelName, isPlaceholder }) {
  const [displayedText, setDisplayedText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const typingSpeed = 10; // Adjusted typing speed (milliseconds)

  useEffect(() => {
    if (isPlaceholder && !text) { // Show typing indicator immediately for placeholder
      setDisplayedText(''); // Will show cursor only
      return;
    }
    if (!text) return;
    setDisplayedText('');
    setCurrentIndex(0);
  }, [text, isPlaceholder]);

  useEffect(() => {
    if (isPlaceholder && !text) return; // Don't type if it's a placeholder waiting for content

    if (currentIndex < text.length) {
      const timeoutId = setTimeout(() => {
        setDisplayedText((prev) => prev + text[currentIndex]);
        setCurrentIndex((prev) => prev + 1);
      }, typingSpeed); // Use the new typingSpeed variable
      return () => clearTimeout(timeoutId);
    }
  }, [currentIndex, text, isPlaceholder, typingSpeed]);

  return (
    <>
      <strong>{modelName}:</strong> 
      {/* Use ReactMarkdown for the assistant's message content */}
      <ReactMarkdown>{displayedText}</ReactMarkdown>
      {(currentIndex < text.length || (isPlaceholder && !text)) && <span className="typing-cursor"></span>}
    </>
  );
}

function ChatInterface({ selectedModelName, onSendMessage, chatHistory, onClearSelectedModel }) {
  const [message, setMessage] = useState('');
  const chatMessagesEndRef = useRef(null);

  const scrollToBottom = () => {
    chatMessagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }

  useEffect(scrollToBottom, [chatHistory]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (message.trim()) {
      // Immediately add user message
      onSendMessage(message.trim());
      setMessage('');
    } else {
      alert('Message cannot be empty.');
    }
  };

  return (
    <div className="chat-page-container">
      <div className="chat-header">
        <h3>{selectedModelName}</h3>
        <button onClick={onClearSelectedModel} className="back-button">Change Model</button>
      </div>
      <div className="chat-messages-container">
        <div className="chat-messages">
          {chatHistory.map((msg, index) => (
            <div key={index} className={`chat-message ${msg.role}`}>
              {msg.role === 'user' ? (
                <>
                  <strong>You:</strong> {msg.content}
                </>
              ) : (
                <TypingMessage 
                  text={msg.content} 
                  modelName={selectedModelName.split('/')[1] || selectedModelName.split(':')[0] || 'Assistant'} 
                  isPlaceholder={!!msg.placeholder && !msg.content} // Pass placeholder status
                />
              )}
            </div>
          ))}
          <div ref={chatMessagesEndRef} />
        </div>
      </div>
      <form onSubmit={handleSubmit} className="chat-input-area">
        <textarea 
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder={`Message ${selectedModelName}...`}
          rows="3"
        />
        <button type="submit">Send</button>
      </form>
    </div>
  );
}

export default ChatInterface;
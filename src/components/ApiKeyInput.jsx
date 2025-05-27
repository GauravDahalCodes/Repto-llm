import React, { useState } from 'react';

function ApiKeyInput({ onSubmit, initialApiKey }) {
  const [key, setKey] = useState(initialApiKey || '');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (key.trim()) {
      onSubmit(key.trim());
    } else {
      // Pitfall: User might submit an empty key. Add validation or feedback.
      alert('API Key cannot be empty.');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Enter Your OpenRouter API Key</h2>
      <p>This key will be used to fetch models and send chat messages. It will be stored in your browser's localStorage.</p>
      <input 
        type="password" // Use password type to obscure the key
        value={key}
        onChange={(e) => setKey(e.target.value)}
        placeholder="sk-or-v1-..."
        style={{ width: 'calc(100% - 22px)', marginBottom: '10px' }}
      />
      <button type="submit">Save and Use API Key</button>
    </form>
  );
}

export default ApiKeyInput;
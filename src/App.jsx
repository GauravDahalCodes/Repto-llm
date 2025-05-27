import React, { useState, useEffect, useCallback } from 'react';
// ApiKeyInput is no longer needed
import ModelSelector from './components/ModelSelector';
import ChatInterface from './components/ChatInterface';
import LoadingSpinner from './components/LoadingSpinner';
// getApiKey and saveApiKey are no longer needed for the primary key
import { getSelectedModel, setSelectedModel as saveSelectedModel } from './utils/localStorage';
import { fetchModels, sendMessage } from './services/openrouterAPI';

// --- Hardcoded API Key ---
const HARDCODED_API_KEY = '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';

function App() {
  // State related to API key input is removed
  // const [apiKey, setApiKey] = useState(getApiKey() || import.meta.env.VITE_OPENROUTER_API_KEY || '');
  // const [isAuthenticated, setIsAuthenticated] = useState(!!apiKey);
  // We assume authentication with the hardcoded key
  const [apiKey] = useState(HARDCODED_API_KEY);
  const [isAuthenticated] = useState(true); // Always authenticated with the hardcoded key

  const [models, setModels] = useState([]);
  const [filteredModels, setFilteredModels] = useState([]);
  const [selectedModel, setSelectedModel] = useState(getSelectedModel() || null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [chatHistory, setChatHistory] = useState([]);

  // Effect to load models (no longer depends on user-supplied apiKey changes)
  useEffect(() => {
    if (isAuthenticated && apiKey) {
      const loadModels = async () => {
        setIsLoading(true);
        setError('');
        try {
          const fetchedModels = await fetchModels(apiKey);
          setModels(fetchedModels.data || []); 
        } catch (err) {
          console.error('Failed to fetch models:', err);
          setError(`Failed to fetch models: ${err.message}.`);
          setModels([]);
        }
        setIsLoading(false);
      };
      loadModels();
    }
  }, [isAuthenticated, apiKey]); // apiKey here is the hardcoded one, so this runs once on mount

  // Effect to filter models based on criteria
  useEffect(() => {
    const freeModels = models.filter(model => 
      model.id.endsWith(':free') || (model.pricing && model.pricing.tier === 'free')
    );
    setFilteredModels(freeModels);
  }, [models]);

  // Effect to handle selected model changes
  useEffect(() => {
    if (selectedModel) {
      saveSelectedModel(selectedModel);
    }
  }, [selectedModel]);

  // handleApiKeySubmit is removed

  const handleModelSelect = (modelId) => {
    const model = models.find(m => m.id === modelId);
    setSelectedModel(model);
    setChatHistory([]); 
  };

  const handleSendMessage = async (messageContent) => {
    if (!selectedModel || !apiKey) {
      setError('Please select a model.');
      return;
    }

    const userMessage = { role: 'user', content: messageContent };
    const assistantPlaceholderMessage = { 
      role: 'assistant', 
      content: '', 
      placeholder: true 
    };

    setChatHistory(prev => [...prev, userMessage, assistantPlaceholderMessage]);
    // setIsLoading(true); // <-- REMOVE THIS LINE
    setError('');

    try {
      const response = await sendMessage(apiKey, selectedModel.id, [...chatHistory, userMessage]);
      if (response.choices && response.choices.length > 0) {
        const assistantActualMessage = response.choices[0].message;
        setChatHistory(prev => 
          prev.map(msg => msg.placeholder ? assistantActualMessage : msg)
        );
      } else {
        setError('Received an empty response from the model.');
        setChatHistory(prev => prev.filter(msg => !msg.placeholder)); 
      }
    } catch (err) {
      console.error('Failed to send message:', err);
      setError(`Failed to send message: ${err.message}.`);
      setChatHistory(prev => prev.filter(msg => msg.role !== 'user' && !msg.placeholder)); // Consider keeping user message
    }
    // setIsLoading(false); // <-- REMOVE THIS LINE
  };

  return (
    <div className="app-container-wrapper"> 
      {isLoading && <LoadingSpinner />}
      {error && <p className="error-message">{error}</p>}

      {!selectedModel ? (
        <div className="model-selection-view"> 
          <h1 className="main-title">Select an OpenRouter Free Model</h1>
          <ModelSelector
            models={filteredModels} // <-- CHANGE THIS from 'models' to 'filteredModels'
            onSelectModel={handleModelSelect}
          />
        </div>
      ) : (
        <ChatInterface
          selectedModelName={selectedModel.name || selectedModel.id}
          onSendMessage={handleSendMessage} 
          chatHistory={chatHistory}
          onClearSelectedModel={() => setSelectedModel(null)} 
        />
      )}
      
      { !selectedModel && 
        <footer className="app-footer">
          <p><small>Using hardcoded API Key. Chat model selection persists in localStorage.</small></p>
          <p><small>OpenRouter Rate Limits: 20 requests/minute, 200 requests/day for free tier.</small></p>
        </footer>
      }
    </div>
  );
}

export default App;
import React, { useState, useMemo } from 'react';

function ModelSelector({ models, selectedModelId, onSelectModel }) {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredModels = useMemo(() => {
    if (!searchTerm) return models;
    return models.filter(model => 
      model.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      model.id.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [models, searchTerm]);

  if (models.length === 0) {
    return <p className="loading-models-message">Loading models...</p>;
  }

  return (
    <div className="model-selector-container">
      <div className="model-selector-header">
        <h4>Select a Model</h4>
        <input 
          type="text"
          placeholder="Search models by name or ID..."
          className="model-search-input"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      {filteredModels.length === 0 && searchTerm && (
        <p className="no-models-found-message">No models match your search.</p>
      )}
      <ul className="model-list">
        {filteredModels.map(model => (
          <li key={model.id} className={`model-item ${selectedModelId === model.id ? 'selected' : ''}`}>
            <div className="model-item-info">
              {/* Display only Name and ID as requested */}
              <span><strong>Name:</strong> {model.name || 'N/A'}</span>
              <span><strong>ID:</strong> {model.id}</span>
            </div>
            <button 
              onClick={() => onSelectModel(model.id)}
              disabled={selectedModelId === model.id}
            >
              {selectedModelId === model.id ? 'Selected' : 'Select & Chat'}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ModelSelector;
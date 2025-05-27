const API_KEY_STORAGE_KEY = 'openrouter_api_key';
const SELECTED_MODEL_STORAGE_KEY = 'openrouter_selected_model';

/**
 * Retrieves the API key from localStorage.
 * @returns {string|null} The API key or null if not found.
 */
export const getApiKey = () => {
  try {
    return localStorage.getItem(API_KEY_STORAGE_KEY);
  } catch (e) {
    // Pitfall: localStorage might be disabled or full (e.g., in private browsing mode).
    console.error('Failed to get API key from localStorage:', e);
    return null;
  }
};

/**
 * Saves the API key to localStorage.
 * @param {string} apiKey - The API key to save.
 */
export const setApiKey = (apiKey) => {
  try {
    if (apiKey) {
      localStorage.setItem(API_KEY_STORAGE_KEY, apiKey);
    } else {
      localStorage.removeItem(API_KEY_STORAGE_KEY);
    }
  } catch (e) {
    console.error('Failed to set API key in localStorage:', e);
  }
};

/**
 * Retrieves the selected model object from localStorage.
 * @returns {Object|null} The selected model object or null if not found.
 */
export const getSelectedModel = () => {
  try {
    const modelJson = localStorage.getItem(SELECTED_MODEL_STORAGE_KEY);
    return modelJson ? JSON.parse(modelJson) : null;
  } catch (e) {
    console.error('Failed to get selected model from localStorage:', e);
    // Pitfall: If JSON is malformed, parsing will fail. Clear it.
    localStorage.removeItem(SELECTED_MODEL_STORAGE_KEY);
    return null;
  }
};

/**
 * Saves the selected model object to localStorage.
 * @param {Object} model - The model object to save.
 */
export const setSelectedModel = (model) => {
  try {
    if (model) {
      localStorage.setItem(SELECTED_MODEL_STORAGE_KEY, JSON.stringify(model));
    } else {
      localStorage.removeItem(SELECTED_MODEL_STORAGE_KEY);
    }
  } catch (e) {
    console.error('Failed to set selected model in localStorage:', e);
  }
};
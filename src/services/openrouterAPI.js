import axios from 'axios';

const OPENROUTER_API_BASE_URL = 'https://openrouter.ai/api/v1';

/**
 * Fetches the list of models from OpenRouter.
 * @param {string} apiKey - The OpenRouter API key.
 * @returns {Promise<Object>} The API response data.
 * @throws Will throw an error if the API request fails.
 */
export const fetchModels = async (apiKey) => {
  if (!apiKey) {
    throw new Error('API key is required to fetch models.');
  }
  try {
    const response = await axios.get(`${OPENROUTER_API_BASE_URL}/models`, {
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        // 'HTTP-Referer': 'YOUR_SITE_URL', // Optional: For OpenRouter to identify your app
        // 'X-Title': 'YOUR_APP_NAME', // Optional: For OpenRouter to identify your app
      }
    });
    return response.data;
  } catch (error) {
    // Pitfall: Axios errors contain response data in error.response.
    // Log more details for debugging.
    console.error('Error fetching models:', error.response ? error.response.data : error.message);
    if (error.response && error.response.status === 401) {
      throw new Error('Unauthorized: Invalid API Key or insufficient permissions.');
    }
    if (error.response && error.response.status === 429) {
        throw new Error('Rate limit exceeded. Please try again later. (OpenRouter limits: 20 req/min, 200 req/day)');
    }
    throw new Error(error.response ? error.response.data.error.message : 'Failed to fetch models from OpenRouter.');
  }
};

/**
 * Sends a chat message to the specified model via OpenRouter.
 * @param {string} apiKey - The OpenRouter API key.
 * @param {string} modelId - The ID of the model to use.
 * @param {Array<Object>} messages - The chat history (array of message objects).
 * @returns {Promise<Object>} The API response data containing the model's reply.
 * @throws Will throw an error if the API request fails.
 */
export const sendMessage = async (apiKey, modelId, messages) => {
  if (!apiKey) {
    throw new Error('API key is required to send messages.');
  }
  if (!modelId) {
    throw new Error('Model ID is required to send messages.');
  }
  try {
    const response = await axios.post(`${OPENROUTER_API_BASE_URL}/chat/completions`, 
      {
        model: modelId,
        messages: messages,
        // stream: false, // Set to true for streaming responses, would require different handling
      },
      {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          // 'HTTP-Referer': 'YOUR_SITE_URL', 
          // 'X-Title': 'YOUR_APP_NAME',
        }
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error sending message:', error.response ? error.response.data : error.message);
    // Pitfall: Handle rate limits (429 Too Many Requests) gracefully.
    // Production apps should implement exponential backoff and retry mechanisms.
    // For this demo, we'll just throw the error.
    if (error.response && error.response.status === 401) {
      throw new Error('Unauthorized: Invalid API Key or insufficient permissions for chat.');
    }
    if (error.response && error.response.status === 429) {
        throw new Error('Rate limit exceeded. Please try again later. (OpenRouter limits: 20 req/min, 200 req/day)');
    }
    // Pitfall: Some models might have specific input requirements or might be temporarily unavailable.
    // The error messages from OpenRouter should be relayed to the user if possible.
    throw new Error(error.response ? error.response.data.error.message : 'Failed to send message to OpenRouter.');
  }
};
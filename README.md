# OpenRouter Free Models Chat Application

This is a web application that allows users to interact with free models available through the OpenRouter API. Users can authenticate using their OpenRouter API key, select a model, and engage in chat sessions.

## Features

-   **API Key Authentication:** Users supply their OpenRouter API key directly in the UI.
-   **Model Fetching:** Fetches a list of all models from OpenRouter.
-   **Model Filtering:** Filters for models whose `id` ends with `:free` or whose pricing `tier` is `free`.
-   **Model Display:** Shows each model’s `id`, `name`, `context_length`, and pricing details.
-   **Model Selection:** Allows users to select a model for chat.
-   **Persistence:** The API key and current model choice are persisted in `localStorage`.
-   **Chat Interface:** Provides a basic chat interface to send messages to the chosen model.
-   **Error Handling:** Basic error handling for API calls and rate limit awareness.

## Project Structure

-   `public/`: Static assets.
-   `src/`: Source code.
    -   `components/`: React components (ApiKeyInput, ModelSelector, ChatInterface, LoadingSpinner).
    -   `services/`: API interaction logic (openrouterAPI.js).
    -   `utils/`: Utility functions (localStorage.js).
    -   `App.jsx`: Main application component.
    -   `main.jsx`: Application entry point.
    -   `index.css`: Global styles.
-   `.env.sample`: Sample environment variables file.
-   `README.md`: This file.
-   `package.json`: Project metadata and dependencies.
-   `vite.config.js`: Vite configuration.

## Setup and Installation

1.  **Clone the repository (or create the files manually):**
    ```bash
    # If you had a git repo, you would clone it
    # git clone <repository-url>
    # cd openrouter-chat-app
    ```
    For now, create a directory named `openrouter-chat-app` and create all the files listed above with their respective content.

2.  **Install dependencies:**
    Navigate to the project directory in your terminal and run:
    ```bash
    npm install
    # or
    # yarn install
    ```

3.  **Set up environment variables:**
    Copy the `.env.sample` file to a new file named `.env` in the project root:
    ```bash
    cp .env.sample .env
    ```
    Open the `.env` file and replace the placeholder with your actual OpenRouter API key:
    ```env
    VITE_OPENROUTER_API_KEY=your_actual_openrouter_api_key_here
    ```
    *Note: The application also allows entering the API key directly in the UI, which will override the `.env` key and be stored in `localStorage`.*

## Development

To run the application in development mode (with hot-reloading):

```bash
npm run dev
# or
# yarn dev
```
# Music Recommendation System

A full-stack application designed to provide music recommendations based on track features. The backend is built with FastAPI and uses a machine learning model for generating recommendations, while the frontend is a React application.

## Features

*   **Track Recommendations**: Get a list of recommended tracks similar to a given input track.
*   **Search Suggestions**: Provides auto-suggestions for track names as the user types.
*   **Data-driven**: Utilizes a dataset of tracks (`top_10000_1950-now.csv`) to learn features and provide recommendations.
*   **Containerized Backend**: The backend service is designed to be run with Docker.

## Tech Stack

*   **Backend**:
    *   Python
    *   FastAPI
    *   Uvicorn (ASGI server)
    *   Pandas (Data manipulation)
    *   Scikit-learn (Machine learning for clustering and similarity)
*   **Frontend**:
    *   JavaScript
    *   React
    *   React Router
    *   Testing Library (for tests)
*   **Orchestration**:
    *   Docker & Docker Compose (currently configured for backend)

## Project Structure

The project is organized into two main directories:

*   `backend/`: Contains the FastAPI application, recommendation logic, and data handling.
*   `frontend/`: Contains the React application for the user interface.

Key files:
*   `docker-compose.yml`: Defines services for the application (currently focused on the backend).
*   `backend/main.py`: The main FastAPI application file with API endpoints.
*   `backend/requirements.txt`: Python dependencies for the backend.
*   `frontend/package.json`: Node dependencies and scripts for the frontend.
*   `frontend/src/index.js`: Entry point for the React application.
*   `top_10000_1950-now.csv`: (Expected in the `backend/` directory) The dataset used for recommendations.

## Setup and Installation

### Prerequisites

*   Docker and Docker Compose
*   Node.js and npm (for running frontend locally)
*   Python (for running backend locally, if not using Docker)

### Running with Docker (Backend)

The `docker-compose.yml` is currently set up to run the backend service.

1.  **Dataset**: Ensure the `top_10000_1950-now.csv` file is present in the `backend/` directory.
2.  **Build and Run**:
    ```bash
    docker-compose up --build
    ```
    The backend API will be available at `http://localhost:8000`.

### Running Frontend Locally

1.  Navigate to the `frontend` directory:
    ```bash
    cd frontend
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Start the development server:
    ```bash
    npm start
    ```
    The frontend application will be available at `http://localhost:3000`.

**Note**: The backend `main.py` currently includes imports for `models`, `schemas`, `auth`, and `database` modules, and uses `auth.get_current_active_user` in its endpoints. These modules appear to have been recently removed. For full functionality, especially regarding user authentication, these components would need to be restored or the dependencies removed from the endpoints. The `docker-compose.yml` also primarily focuses on the backend; a complete setup would typically include the frontend service and potentially a database service.

## API Endpoints (Backend)

The backend exposes the following API endpoints:

*   **`GET /`**
    *   Description: Root endpoint to check if the API is running.
    *   Response: `{"message": "Spotify Recommendation API is running!"}`

*   **`GET /recommendations/{track_name}?top_n=5`**
    *   Description: Get song recommendations for a given track name.
    *   Path Parameters:
        *   `track_name` (string, required): The name of the track to get recommendations for.
    *   Query Parameters:
        *   `top_n` (integer, optional, default: 5): Number of recommendations to return.
    *   Response: A JSON object containing the input song details and a list of recommended songs with their metadata and similarity score.
        ```json
        {
          "input_song": {
            "Track Name": "Some Song",
            "Artist Name(s)": "Some Artist",
            "Album Image URL": "http://example.com/image.jpg",
            "Track URI": "spotify:track:someuri"
          },
          "recommendations": [
            {
              "Track Name": "Recommended Song 1",
              "Artist Name(s)": "Artist 1",
              "Album Image URL": "http://example.com/rec_image1.jpg",
              "Track URI": "spotify:track:rec_uri1",
              "Similarity": 0.95
            }
            
          ]
        }
        ```

*   **`GET /search_suggestions/{query}?limit=10`**
    *   Description: Get search suggestions for track names based on a query.
    *   Path Parameters:
        *   `query` (string, required): The search query (min 2 characters).
    *   Query Parameters:
        *   `limit` (integer, optional, default: 10): Maximum number of suggestions to return.
    *   Response: A list of unique track names and artists matching the query.
        ```json
        [
          {
            "Track Name": "Suggested Track 1",
            "Artist Name(s)": "Artist A"
          },
          {
            "Track Name": "Suggested Track 2",
            "Artist Name(s)": "Artist B"
          }
        ]
        ```

## How to Use

1.  Start the backend service (e.g., using Docker).
2.  Start the frontend development server.
3.  Open your browser and navigate to `http://localhost:3000`.
4.  Use the interface to search for songs and get recommendations.


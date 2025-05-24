# Installation Guide

This guide will walk you through setting up the Music Recommendation System on your local machine.

## Prerequisites

Before you begin, ensure you have the following installed:

- [Docker](https://www.docker.com/get-started) (v20.10.0 or higher)
- [Docker Compose](https://docs.docker.com/compose/install/) (v2.0.0 or higher)
- [Git](https://git-scm.com/downloads)
- [Node.js](https://nodejs.org/) (v16 or higher) - Only needed for frontend development
- [Python](https://www.python.org/downloads/) (3.8 or higher) - Only needed for backend development

## Quick Start with Docker (Recommended)

1. **Clone the repository**
   ```bash
   git clone https://github.com/V32V3T/SONG_RECOMMENDER.git
   cd SONG_RECOMMENDER
   ```

2. **Set up environment variables**
   Create a `.env` file in the project root with the following content:
   ```
   # Backend
   DATABASE_URL=postgresql://user:password@db:5432/mydatabase
   
   # Frontend (if running separately)
   REACT_APP_API_URL=http://localhost:8000
   ```

3. **Start the application**
   ```bash
   docker-compose up --build
   ```
   This will start:
   - Backend API on `http://localhost:8000`
   - Frontend on `http://localhost:3000`
   - PostgreSQL database on port 5433

## Manual Installation (Development)

### Backend Setup

1. **Create and activate a virtual environment**
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: .\venv\Scripts\activate
   ```

2. **Install dependencies**
   ```bash
   cd backend
   pip install -r requirements.txt
   ```

3. **Set up the database**
   ```bash
   # Run database migrations
   alembic upgrade head
   ```

4. **Start the backend server**
   ```bash
   uvicorn main:app --reload --host 0.0.0.0 --port 8000
   ```

### Frontend Setup

1. **Install Node.js dependencies**
   ```bash
   cd frontend
   npm install
   ```

2. **Start the development server**
   ```bash
   npm start
   ```
   The frontend will be available at `http://localhost:3000`

## Database Setup

The application uses PostgreSQL as the database. When using Docker Compose, the database is automatically set up with the following credentials:

- **Host**: localhost
- **Port**: 5433
- **Database**: mydatabase
- **Username**: user
- **Password**: password

## Environment Variables

### Backend

| Variable | Description | Default |
|----------|-------------|---------|
| `DATABASE_URL` | PostgreSQL connection URL | `postgresql://user:password@db:5432/mydatabase` |
| `SECRET_KEY` | Secret key for JWT token generation | `your-secret-key` |
| `ALGORITHM` | Algorithm for JWT | `HS256` |
| `ACCESS_TOKEN_EXPIRE_MINUTES` | Token expiration time | `30` |

### Frontend

| Variable | Description | Default |
|----------|-------------|---------|
| `REACT_APP_API_URL` | Backend API URL | `http://localhost:8000` |

## Troubleshooting

1. **Port conflicts**
   - If ports 3000, 8000, or 5433 are already in use, update the `docker-compose.yml` file with available ports.

2. **Database connection issues**
   - Ensure PostgreSQL is running and accessible
   - Verify the database credentials in your `.env` file
   - Check the logs: `docker-compose logs db`

3. **Docker build issues**
   - Clear Docker cache: `docker system prune -a`
   - Rebuild with no cache: `docker-compose build --no-cache`

## Additional Resources

- [Docker Documentation](https://docs.docker.com/)
- [FastAPI Documentation](https://fastapi.tiangolo.com/)
- [React Documentation](https://reactjs.org/)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)

## Support

For additional help, please open an issue on the [GitHub repository](https://github.com/V32V3T/SONG_RECOMMENDER/issues).

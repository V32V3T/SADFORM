from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
import pandas as pd
from sklearn.preprocessing import StandardScaler
from sklearn.cluster import KMeans
from sklearn.metrics.pairwise import cosine_similarity
import os
from datetime import timedelta
import models
import schemas
import auth
import database

models.Base.metadata.create_all(bind=database.engine)

app = FastAPI()

#CORS Configuration
origins = [
    "http://localhost:3000",  
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],  
)

# Configuration
DATA_FILE = "top_10000_1950-now.csv"
AUDIO_FEATURES = [
    "Danceability", "Energy", "Loudness", "Speechiness", "Acousticness",
    "Instrumentalness", "Liveness", "Valence", "Tempo"
]
METADATA_COLUMNS = ["Track Name", "Artist Name(s)", "Album Image URL", "Track URI"]
N_CLUSTERS = 10

#Data Loading and Preprocessing
df_clean = pd.DataFrame()
scaler = StandardScaler()
kmeans = KMeans(n_clusters=N_CLUSTERS, random_state=42, n_init='auto')
X_scaled = None

def load_and_preprocess_data():
    global df_clean, X_scaled, scaler, kmeans
    
    if not os.path.exists(DATA_FILE):
        print(f"Error: Data file '{DATA_FILE}' not found in the backend directory.")
        return

    df = pd.read_csv(DATA_FILE)
    
    df_clean = df.dropna(subset=AUDIO_FEATURES + METADATA_COLUMNS).copy()
    df_clean.reset_index(drop=True, inplace=True)

    if df_clean.empty:
        print("Error: DataFrame is empty after dropping NaNs. Check your data and feature columns.")
        return

    # Feature Scaling
    X_scaled = scaler.fit_transform(df_clean[AUDIO_FEATURES])
    
    # KMeans Clustering
    df_clean["Cluster"] = kmeans.fit_predict(X_scaled)
    print("Data loaded and model trained successfully.")

# Load data and train model on startup
@app.on_event("startup")
async def startup_event():
    print("Application startup: Loading data and training model...")
    load_and_preprocess_data()
    if df_clean.empty:
        print("Startup Warning: df_clean is empty after load_and_preprocess_data. Recommendations might not work.")
    else:
        print(f"df_clean populated with {len(df_clean)} tracks.")


#API Endpoints

#Recommendation Endpoints
@app.get("/")
async def root():
    return {"message": "Spotify Recommendation API is running!"}

@app.get("/recommendations/{track_name}")
async def get_recommendations_endpoint(track_name: str, top_n: int = 5, current_user: models.User = Depends(auth.get_current_active_user)):
    global df_clean, scaler

    if df_clean.empty:
        return {"error": "Dataset not loaded or is empty. Cannot provide recommendations."}

    matches = df_clean[df_clean["Track Name"].str.lower() == track_name.lower()]
    
    if matches.empty:
        return {"error": f"Track '{track_name}' not found in dataset."}
    
    song_row = matches.iloc[0]
    input_song_details = song_row[METADATA_COLUMNS].to_dict()
    
    target_cluster = song_row["Cluster"]
    cluster_songs = df_clean[df_clean["Cluster"] == target_cluster].copy()


    song_row_scaled_features = scaler.transform(song_row[AUDIO_FEATURES].values.reshape(1, -1))
    cluster_songs_scaled_features = scaler.transform(cluster_songs[AUDIO_FEATURES])
        
    similarities = cosine_similarity(song_row_scaled_features, cluster_songs_scaled_features).flatten()
    cluster_songs["Similarity"] = similarities
    
    recommendations_df = cluster_songs.sort_values(by="Similarity", ascending=False)
    recommendations_df = recommendations_df[recommendations_df["Track URI"] != song_row["Track URI"]]

    input_song_name_lower = song_row["Track Name"].lower()
    input_song_artists_lower = song_row["Artist Name(s)"].lower()
    recommendations_df = recommendations_df[
        ~(
            (recommendations_df["Track Name"].str.lower() == input_song_name_lower) &
            (recommendations_df["Artist Name(s)"].str.lower() == input_song_artists_lower)
        )
    ]
    
    final_recommendations = recommendations_df.head(top_n)[METADATA_COLUMNS + ["Similarity"]].to_dict(orient="records")
    
    return {
        "input_song": input_song_details,
        "recommendations": final_recommendations
    }

@app.get("/search_suggestions/{query}")
async def get_search_suggestions(query: str, limit: int = 10, current_user: models.User = Depends(auth.get_current_active_user)):
    global df_clean
    if df_clean.empty:
        return {"error": "Dataset not loaded or is empty."}
    
    if not query or len(query) < 2: 
        return []
    suggestions = df_clean[df_clean["Track Name"].str.lower().str.contains(query.lower())]
    unique_suggestions = suggestions[["Track Name", "Artist Name(s)"]].drop_duplicates().head(limit)
    return unique_suggestions.to_dict(orient="records")

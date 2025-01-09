from deepface import DeepFace
from pymongo import MongoClient
from scipy.spatial import distance
import time
import tempfile
import os

# Datalles conexión MongoDB
DB_STRING = "mongodb+srv://adhisson:XVNqbidUA8Lu7iAm@tic.cerq8.mongodb.net/PoliceDB?retryWrites=true&w=majority&appName=TIC"
client = MongoClient(DB_STRING)
db = client["PoliceDB"]
people_collection = db["people"]
images_collection = db["images"]
vector_collection = db["vectores"] 

def extract_face_embedding(img_file_path):
    """Generate a face embedding for the given image using DeepFace."""
    start_time = time.time()  # Medir el tiempo de inicio
    try:
        embedding = DeepFace.represent(img_path=img_file_path, model_name="Facenet", enforce_detection=False)[0]['embedding']
        if not embedding:
            raise ValueError("No embedding generated from the image.")
        print(f"Generated embedding: {embedding}")  # Verificar el embedding generado
        end_time = time.time()  # Medir el tiempo de fin
        print(f"Embedding generation time: {end_time - start_time} seconds")
        return embedding
    except Exception as e:
        print(f"Embedding extraction failed: {e}")
        raise

def store_embedding_for_user(embedding_vector):
    """Store only the photo_vector in the database."""
    try:
        # Store only the photo_vector in the database (no photo_id)
        vector_data = {
            "photo_vector": embedding_vector  # Only store the photo_vector
        }

        # Insert the vector data into MongoDB collection
        start_time = time.time()  # Medir el tiempo de inicio de la inserción
        result = vector_collection.insert_one(vector_data)
        end_time = time.time()  # Medir el tiempo de fin

        print(f"Database insert time: {end_time - start_time} seconds")
        print(f"Inserted vector: {vector_data}")  # Verificar los datos insertados

        if result.inserted_id:
            print(f"Document created successfully with ObjectID: {result.inserted_id}")
            return result.inserted_id
        else:
            print("Failed to create a new document.")
            return False
    except Exception as e:
        print(f"Error storing embedding in the database: {e}")
        return False

def retrieve_all_embeddings():
    """Retrieve all stored face embeddings from the database."""
    start_time = time.time()  # Medir el tiempo de inicio
    try:
        embeddings = list(vector_collection.find())
        end_time = time.time()  # Medir el tiempo de fin
        print(f"Time to retrieve embeddings: {end_time - start_time} seconds")
        return embeddings
    except Exception as e:
        print(f"Error retrieving face vectors: {e}")
        return []

def compare_with_db(uploaded_embedding):
    """Compare the uploaded face embedding with stored embeddings using Euclidean distance."""
    try:
        stored_vectors = retrieve_all_embeddings()
        print(f"Stored vectors: {stored_vectors}")  # Verificar los vectores recuperados

        best_match = None
        best_score = float('inf')

        for vector in stored_vectors:
            stored_embedding = vector['photo_vector']
            similarity_score = distance.cosine(uploaded_embedding, stored_embedding)

            if similarity_score < best_score:
                best_score = similarity_score
                best_match = vector

        if best_score < 0.8:  # Threshold for matching
            return {
                "status": "Match Found", 
                "photo_vector": best_match["photo_vector"], 
                "score": best_score,
                "match_details": best_match
            }
        else:
            return {
                "status": "No Match", 
                "score": best_score,
                "match_details": {}
            }
    except Exception as e:
        print(f"Error comparing embeddings: {e}")
        return {"status": "Error", "message": str(e)}
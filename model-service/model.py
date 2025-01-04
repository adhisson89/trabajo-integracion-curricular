import uuid
from deepface import DeepFace
from pymongo import MongoClient
from scipy.spatial import distance
from bson import ObjectId
import tempfile
import os

# MongoDB connection details
DB_STRING = "mongodb+srv://adhisson:XVNqbidUA8Lu7iAm@tic.cerq8.mongodb.net/PoliceDB?retryWrites=true&w=majority&appName=TIC"
client = MongoClient(DB_STRING)
db = client["PoliceDB"]
people_collection = db["people"]
images_collection = db["images"]
vector_collection = db["vectores"]  # Nueva colección para almacenar los vectores

def extract_face_embedding(img_file_path):
    """Generate a face embedding for the given image using DeepFace."""
    try:
        embedding = DeepFace.represent(img_path=img_file_path, model_name="Facenet", enforce_detection=False)[0]['embedding']
        if not embedding:
            raise ValueError("No embedding generated from the image.")
        return embedding
    except Exception as e:
        print(f"Embedding extraction failed: {e}")
        raise

def store_embedding_for_user(photo_id, embedding_vector):
    """Store the embedding vector in the database under the given user photo_id."""
    try:
        # Asegúrate de que el photo_id se maneje correctamente como un ObjectId
        photo_id = ObjectId(photo_id)  # Convierte el photo_id en un ObjectId de MongoDB

        # Verifica si el photo_id ya está registrado en la colección 'people'
        person = people_collection.find_one({"photo_id": photo_id})
        
        if person:
            # Almacena el embedding y el photo_id en la colección de vectores
            vector_data = {
                "photo_vector_id": embedding_vector,  # El vector de la imagen
                "photo_id": photo_id  # Usa el photo_id de la persona como ObjectId
            }
            vector_collection.insert_one(vector_data)
            print(f"Embedding for photo_id {photo_id} stored successfully.")
            return True
        else:
            print(f"User with photo_id {photo_id} not found.")
            return False
    except Exception as e:
        print(f"Error storing embedding in the database: {e}")
        return False

def save_image_in_db(file, photo_id):
    """Save the image to MongoDB and return the generated user ID."""
    try:
        with tempfile.NamedTemporaryFile(delete=False, suffix=".jpg") as temp_file:
            temp_file_path = temp_file.name
            file.save(temp_file_path)

        # Extract embedding from the saved image
        photo_embedding = extract_face_embedding(temp_file_path)

        # Store the embedding in the database
        success = store_embedding_for_user(photo_id, photo_embedding)

        # Remove the temporary file
        os.remove(temp_file_path)

        return {"status": "success"} if success else {"status": "failed"}

    except Exception as e:
        print(f"Error saving image in database: {e}")
        return {"status": "failed", "message": str(e)}

def retrieve_all_embeddings():
    """Retrieve all stored face embeddings from the database."""
    try:
        return list(vector_collection.find())
    except Exception as e:
        print(f"Error retrieving face vectors: {e}")
        return []

def compare_with_db(uploaded_embedding):
    """Compare the uploaded face embedding with stored embeddings."""
    try:
        stored_vectors = retrieve_all_embeddings()

        best_match = None
        best_score = float('inf')

        for vector in stored_vectors:
            stored_embedding = vector['photo_vector_id']
            cosine_distance = distance.cosine(uploaded_embedding, stored_embedding)

            if cosine_distance < best_score:
                best_score = cosine_distance
                best_match = vector

        if best_score < 0.9:  # Threshold for matching
            return {"status": "Match Found", "photo_id": best_match["photo_id"], "score": best_score}
        else:
            return {"status": "No Match", "score": best_score}
    except Exception as e:
        print(f"Error comparing embeddings: {e}")
        return {"status": "Error", "message": str(e)}
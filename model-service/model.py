from deepface import DeepFace
from pymongo import MongoClient
from scipy.spatial import distance

# Configuración de MongoDB
DB_STRING = "mongodb+srv://adhisson:XVNqbidUA8Lu7iAm@tic.cerq8.mongodb.net/PoliceDB?retryWrites=true&w=majority&appName=TIC"
client = MongoClient(DB_STRING)
db = client["PoliceDB"]
people_collection = db["people"]

def get_embedding(img_path, model_name="Facenet"):
    return DeepFace.represent(img_path=img_path, model_name=model_name, enforce_detection=False)[0]['embedding']

def compare_embedding(photo_embedding, threshold=0.9):
    people = list(people_collection.find())
    for person in people:
        stored_embedding = person.get('photo_vector')
        if stored_embedding:
            cosine_dist = distance.cosine(photo_embedding, stored_embedding)
            if cosine_dist < threshold:
                return {"status": "True", "person": person["name"], "id": person["identification"]}
    return {"status": "False"}

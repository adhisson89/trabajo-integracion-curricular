from pymongo import MongoClient

DB_STRING = "mongodb+srv://adhisson:XVNqbidUA8Lu7iAm@tic.cerq8.mongodb.net/PoliceDB?retryWrites=true&w=majority&appName=TIC"
client = MongoClient(DB_STRING)
db = client["PoliceDB"]
print(db.list_collection_names())  # Esto debería listar las colecciones en la base de datos

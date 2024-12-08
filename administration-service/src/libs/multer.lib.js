const multer = require('multer');

// Configuración de multer
const storage = multer.memoryStorage(); // Almacena la imagen en memoria antes de guardarla en MongoDB
const upload = multer({ storage });

module.exports = upload;
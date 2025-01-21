const mongoose = require("mongoose");
const { Schema } = mongoose;

const ImageSchema = new Schema({
    filename: {
        type: String,
        required: true
    },
    data: {
        type: Buffer, // Para almacenar los datos binarios de la imagen
        required: true
    },
    contentType: {
        type: String,
        required: true
    },
}, {
    timestamps: true,
    versionKey: false,
});

module.exports = mongoose.model("Image", ImageSchema);

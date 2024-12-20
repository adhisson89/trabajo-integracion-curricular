const mongoose = require('mongoose');
const { Schema } = mongoose;

const otherDataSchema = new mongoose.Schema({
    key: String,
    value: mongoose.Schema.Types.Mixed
}, { _id: false });

const personSchema = new Schema({
    identification: {
        type: String,
        unique: true,
        required: true,
        trim: true
    },
    name: {
        type: String,
        required: true,
        trim: true
    },
    surename: {
        type: String,
        required: true,
        trim: true
    },
    role: {
        type: String,
        enum: ['ESTUDIANTE', 'PROFESOR', 'ADMINISTRATIVO', 'COLABORADOR', 'INDIVIDUAL', 'GRUPAL'],
        trim: true
    },
    photo_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Image",
        required: false,
    },
    photo_vector: {
        type: String,
        required: true,
    },
    other_data: [otherDataSchema]
}, {
    timestamps: true,
    versionKey: false,
});

module.exports = mongoose.model('Person', personSchema);

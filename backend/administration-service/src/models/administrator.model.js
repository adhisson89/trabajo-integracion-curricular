const mongoose = require('mongoose');

const administratorSchema = new mongoose.Schema({
    email: {
        type: String,
        unique: true,
        required: true,
        trim: true,
    },
    password: {
        type: String,
        required: true,
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
    }
}, {
    timestamps: true,
    versionKey: false,
});

module.exports = mongoose.model('Administrator', administratorSchema);

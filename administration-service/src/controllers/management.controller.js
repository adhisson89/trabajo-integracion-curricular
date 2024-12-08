const bcrypt = require('bcryptjs');
const cookie = require('cookie');

const createAccessToken = require('../libs/jwt.lib.js');

const Person = require('../models/person.model.js');
const Image = require("../models/image.model.js");

const controller = {

    createPerson: async function (req, res) {

        const { identification,
                name,
                surename,
                role,
                photo_id,
                other_data } = req.body;

        const vector = "INSERTE VECTOR AQUI XD";

        try {

            const personFound = await Person.findOne({ identification });
            if (personFound) return res.status(400).json({ message: "La persona ya existe" });

            // Verificar si existe la imagen en la colección
            const image = await Image.findById(photo_id);
            if (!image) {
                return res.status(400).json({ message: "La imagen proporcionada no existe" });
            }

            const newPerson = new Person({
                identification,
                name,
                surename,
                role,
                photo_id,
                photo_vector: vector,
                other_data
            });

            

            //TODO: LLAMAR LA SERVICIO DE IA PARA CRECION DE VECTORES DE IMAGENES
            

            const personSaved = await newPerson.save();


            return res
                .status(200)
                .json({
                    id: personSaved._id,
                    fullname: personSaved.name + ' ' + personSaved.surename
                });

        } catch (error) {
            return res.status(500).json({ message: error.message });
        }

    },


    getPeople: async function (req, res) {

        try {

            const people = await Person.find();

            return res
                .status(200)
                .json(people);

        } catch (error) {
            return res.status(500).json({ message: error.message });
        }

    },

    getPersonByIdentification: async function (req, res) {
            
        const { identification } = req.params;

        try {

            const person = await Person.findOne({identification}).populate("photo_id", "filename contentType");
            if (!person) return res.status(400).json({ message: "La identificación no existe" });

            return res
                .status(200)
                .json(person);

        } catch (error) {
            return res.status(500).json({ message: error.message });
        }

    },

    updatePerson: async function (req, res) {
        
        const { identification } = req.params;
        const { name, surename, role, other_data, photo_id } = req.body;

        try {

            const personFound = await Person.findOne({ identification });
            if (!personFound) return res.status(400).json({ message: "La persona no existe" });

            if (photo_id) {
                const image = await Image.findById(photo_id);
                if (!image) {
                    return res.status(400).json({ message: "El ID de la imagen proporcionado no existe" });
                }
            }

            // Si deseo actualizar el contenido de another_data tengo que pasar el array completo de datos ya que se sobrescribe completamente
            const personUpdated = await Person.findOneAndUpdate(
                { identification }, 
                { name, surename, role, other_data, ...(photo_id && { photo_id: photo_id }) }, { new: true });

            return res
                .status(200)
                .json(personUpdated);

        } catch (error) {
            return res.status(500).json({ message: error.message });
        }

    },

    deletePerson: async function (req, res) {
        
        const { identification } = req.body;

        try {

            const personFound = await Person.findOne({ identification });
            if (!personFound) return res.status(400).json({ message: "La persona no existe" });

            if (personFound.photo_id) {
                await Image.findByIdAndDelete(personFound.photo_id);
            }

            await Person.findOneAndDelete({ identification });

            return res
                .status(200)
                .json({ message: "Persona eliminada" });

        } catch (error) {
            return res.status(500).json({ message: error.message });
        }

    },

    uploadImage: async function (req, res) {

        if (!req.file) {
            return res.status(400).json({ message: "No se proporcionaron los datos correctos" });
        }
        
        try {

            const newImage = new Image({
                filename: req.file.originalname,
                data: req.file.buffer,
                contentType: req.file.mimetype,
            });

            const savedImage = await newImage.save();

            return res
                .status(200)
                .json({
                    imageId: savedImage._id,
                    message: "Imagen subida exitosamente",
                });

        } catch (error) {
            return res.status(500).json({ message: error.message });
        }

    },

    getImage: async function (req, res) {

        const { id } = req.params;

        try {

            const image = await Image.findById(id);
            if (!image) return res.status(400).json({ message: "La imagen no existe" });

            res.setHeader('Content-Type', image.contentType);
            return res.send(image.data);

        } catch (error) {
            return res.status(500).json({ message: error.message });
        }

    },

    updateImage: async function (req, res) {

        const { id } = req.body;

        if (!req.file) {
            return res.status(400).json({ message: "No se proporcionaron los datos correctos" });
        }

        try {

            const image = await Image.findById(id);
            if (!image) return res.status(400).json({ message: "La imagen no existe" });

            await Image.findOneAndUpdate({ _id: id }, {
                filename: req.file.originalname,
                data: req.file.buffer,
                contentType: req.file.mimetype,
            });

            return res
                .status(200)
                .json({ message: "Imagen actualizada" });

        } catch (error) {
            return res.status(500).json({ message: error.message });
        }
    },


}

module.exports = controller;
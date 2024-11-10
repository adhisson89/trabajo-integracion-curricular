const bcrypt = require('bcryptjs');
const cookie = require('cookie');

const createAccessToken = require('../libs/jwt.lib.js');

const Person = require('../models/person.model.js');
const { get } = require('mongoose');

const controller = {

    createPerson: async function (req, res) {

        const { identification,
                name,
                surename,
                role,
                other_data } = req.body;

        const vector = "INSERTE VECTOR AQUI XD";

        try {

            const newPerson = new Person({
                identification,
                name,
                surename,
                role,
                photo_vector: vector,
                other_data
            });

            const personFound = await Person.findOne({ identification });
            if (personFound) return res.status(400).json({ message: "La persona ya existe" });

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

            const person = await Person.findOne({identification});
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
        const { name, surename, role, other_data } = req.body;

        try {

            const personFound = await Person.findOne({ identification });
            if (!personFound) return res.status(400).json({ message: "La persona no existe" });

            // Si deseo actualizar el contenido de another_data tengo que pasar el array completo de datos ya que se sobrescribe completamente
            const personUpdated = await Person.findOneAndUpdate({ identification }, { name, surename, role, other_data }, { new: true });

            return res
                .status(200)
                .json(personUpdated);

        } catch (error) {
            return res.status(500).json({ message: error.message });
        }

    },

    deletePerson: async function (req, res) {
        
        const { identification } = req.params;

        try {

            const personFound = await Person.findOne({ identification });
            if (!personFound) return res.status(400).json({ message: "La persona no existe" });

            await Person.findOneAndDelete({ identification });

            return res
                .status(200)
                .json({ message: "Persona eliminada" });

        } catch (error) {
            return res.status(500).json({ message: error.message });
        }

    }

}

module.exports = controller;
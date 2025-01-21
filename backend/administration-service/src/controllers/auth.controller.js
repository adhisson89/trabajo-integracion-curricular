const bcrypt = require('bcryptjs');
const cookie = require('cookie');

const createAccessToken = require('../libs/jwt.lib.js');

const Administrator = require('../models/administrator.model.js');

const controller = {

    login: async function (req, res) {
        
        const { email, password } = req.body;

        try {

            const administratorFound = await Administrator.findOne({ email });
            if (!administratorFound) return res.status(400).json({ message: "Credenciales Inválidas" });

            const isMatch = await bcrypt.compare(password, administratorFound.password);
            if (!isMatch) return res.status(400).json({ message: "Credenciales Inválidas" });

            const token = await createAccessToken({
                id: administratorFound._id,
                email: administratorFound.email,
                fullname: administratorFound.name + ' ' + administratorFound.surename,
            });


            return res
                .json({
                    id: administratorFound._id,
                    email: administratorFound.email,
                    fullname: administratorFound.name + ' ' + administratorFound.surename,
                    token: token
                })
                .end();

        } catch (error) {
            return res.status(500).json({ message: error.message });
        }


    },

    register: async function (req, res) {

        const { email, password, name, surename } = req.body;

        try {

            const passwordHash = await bcrypt.hash(password, 10);

            const newAdministrator = new Administrator({
                email,
                password: passwordHash,
                name,
                surename
            });

            const administratorSaved = await newAdministrator.save();

            const token = await createAccessToken({
                id: administratorSaved._id,
                email: administratorSaved.email,
                name: administratorSaved.name,
                surename: administratorSaved.surename
            });

            return res
                .status(200)
                .json({
                    id: administratorSaved._id,
                    email: administratorSaved.email,
                    name: administratorSaved.name,
                    surename: administratorSaved.surename,
                    token: token
                });

        } catch (error) {
            return res.status(500).json({ message: error.message });
        }

    }
    
}

module.exports = controller;
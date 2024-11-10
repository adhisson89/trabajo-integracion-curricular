const jwt = require('jsonwebtoken');
const Administrator = require('../models/administrator.model.js');

const postAuthRequired = async (req, res, next) => {
    try {
        const { token } = req.body.payload;

        if (!token) return res.status(401).json({ message: "No token, autorización denegada" });

        // Verificar el token
        jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, async (err, user) => {
            if (err) return res.status(401).json({ message: "Token inválido" });

            // Verificar si el administrator existe en la base de datos
            const administratorEnBase = await Administrator.findById(user.id);
            if (!administratorEnBase) {
                return res.status(401).json({ message: "Administrator no válido" });
            }

            req.user = administratorEnBase;
            next();
        });
    } catch (error) {
        return res.status(500).json({ message: "Error al procesar el token" });
    }
};


const getAuthRequired = async (req, res, next) => {

    try {
        const token = req.params.token;

        if (!token) return res.status(401).json({ message: "No token, autorización denegada" });

        jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, async (err, user) => {
            if (err) return res.status(401).json({ message: "Token inválido" });

            // Verificar si el administrator existe en la base de datos
            const administratorEnBase = await Administrator.findById(user.id);
            if (!administratorEnBase) {
                return res.status(401).json({ message: "Administrador no válido" });
            }

            req.user = administratorEnBase;
            next();

        });

    } catch (error) {
        return res.status(500).json({ message: "Error al procesar el token" });
    }
}

module.exports = { postAuthRequired, getAuthRequired };
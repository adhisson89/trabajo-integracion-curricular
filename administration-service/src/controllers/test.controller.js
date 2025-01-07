const { getServiceUrl } = require('../eureka-client.js');

const controller = {
    getTest: async function (req, res) {
        return res.status(200).send({ data: "Get Test" });
    },
    
    updateTest: async function (req, res) {
        return res.status(200).send({ data: "Update Test" });
    },

    getHealth: async function (req, res) {
        return res.status(200).send('OK');
    },

    getLista: async function (req, res) {
        const url = getServiceUrl(req.params.serviceName);
        return res.status(200).send({ data: url });
    }
    
}

module.exports = controller;
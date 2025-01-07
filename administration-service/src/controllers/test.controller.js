const controller = {
    getTest: async function (req, res) {
        return res.status(200).send({ data: "Get Test" });
    },
    
    updateTest: async function (req, res) {
        return res.status(200).send({ data: "Update Test" });
    },

    getHealth: async function (req, res) {
        return res.status(200).send('OK');
    }
    
}

module.exports = controller;
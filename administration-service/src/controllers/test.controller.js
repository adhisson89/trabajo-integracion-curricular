const controller = {
    getTest: async function (req, res) {
        return res.status(200).send({ data: "Get Test" });
    },
    
    updateTest: async function (req, res) {
        return res.status(200).send({ data: "Update Test" });
    },
    
}

module.exports = controller;
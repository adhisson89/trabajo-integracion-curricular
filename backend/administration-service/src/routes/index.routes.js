const express = require("express");
const router = express.Router();
const fs = require("fs");

const PATH_ROUTER = __dirname;

const cleanFileName = (fileName) => {
    // Elimina la extensión ".js" y cualquier otro texto después del último punto.
    const clean = fileName.replace(/\.routes\.js$/, '');
    return clean;
}

//TODO [index.js, file_name.js]
fs.readdirSync(PATH_ROUTER).filter(fileName => {
    const prefixRoute = cleanFileName(fileName);
    if (prefixRoute !== "index") {
        console.log(`Cargando la ruta: ${prefixRoute}`);
        router.use(`/${prefixRoute}`, require(`./${prefixRoute}.routes.js`));
    }
})

module.exports = { router };
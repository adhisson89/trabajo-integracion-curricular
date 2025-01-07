const app = require("./app.js");
const connectDB = require("./database.js");
const eureka = require('./eureka-client.js');

require("dotenv").config();
connectDB();

const port = Math.floor(Math.random() * (3999 - 3000 + 1)) + 3000;
process.env.PORT = port;
const PORT = process.env.PORT || 3000;

eureka.registerWithEureka(PORT);

connectDB();


app.listen(PORT, () => console.log(`La API se levantó en el puerto ${PORT}`));

const app = require("./app.js");
const connectDB = require("./database.js");

require("dotenv").config();

connectDB();

const port = Math.floor(Math.random() * (3999 - 3000 + 1)) + 3000;
process.env.PORT = port;

// require('./eureka-client');

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => console.log("La API se levanto en ", PORT));

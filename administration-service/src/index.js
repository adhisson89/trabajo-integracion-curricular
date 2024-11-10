const app = require("./app.js");
const connectDB = require("./database.js");

require("dotenv").config();

connectDB();

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => console.log("La API se levanto en ", PORT));

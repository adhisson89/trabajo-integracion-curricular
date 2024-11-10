const app = require("./app.js");

require("dotenv").config();




const PORT = process.env.PORT || 3000;

app.listen(PORT, () => console.log("La API se levanto en ", PORT));

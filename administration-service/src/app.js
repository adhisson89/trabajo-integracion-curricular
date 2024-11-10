const express = require("express");
const app = express();
const cors = require("cors");
const { router } = require("./routes/index.routes.js")
const morgan = require("morgan");
const cookieParser = require("cookie-parser");




app.use(express.json());
app.use(cookieParser());
app.use(morgan("dev"));
app.use(cors());
app.use("/api/administration", router);

module.exports = app;

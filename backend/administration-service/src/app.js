const express = require("express");
const app = express();
const { router } = require("./routes/index.routes.js")
const morgan = require("morgan");
const cookieParser = require("cookie-parser");




app.use(express.json());
app.use(cookieParser());
app.use(morgan("dev"));
app.use("/api/administration", router);

module.exports = app;

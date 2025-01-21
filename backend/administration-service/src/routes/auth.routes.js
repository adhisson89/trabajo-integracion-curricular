const express = require('express');
const router = express.Router();

const validateToken = require("../middlewares/validateToken.middleware.js");
const validateSchema = require("../middlewares/validateSchema.middleware.js");

const controller  = require("../controllers/auth.controller")
const { loginSchema, registerSchema } = require('../schemas/auth.schema.js');


//TODO http://localhost:3001/api/[microservice name]/auth/...
router.post("/login", validateSchema(loginSchema), controller.login);
// router.post("/register", validateSchema(registerSchema), controller.register);
router.post("/register", validateToken.postAuthRequired, validateSchema(registerSchema), controller.register);

// router.post("/logout", controller.getTest);



module.exports = router;
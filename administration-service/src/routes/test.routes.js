const express = require('express');
const router = express.Router();
const controller  = require("../controllers/test.controller")

//TODO http://localhost:3001/api/[microservice name]/test/...
router.get("/", controller.getTest);
router.put("/:id", controller.updateTest);
router.get("/health", controller.getHealth);
router.get("/list/:serviceName", controller.getLista);

module.exports = router;

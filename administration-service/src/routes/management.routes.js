const express = require('express');
const router = express.Router();

const validateToken = require("../middlewares/validateToken.middleware.js");
const validateSchema = require("../middlewares/validateSchema.middleware.js");

const controller  = require("../controllers/management.controller.js")
const { createPersonSchema, updatePersonSchema } = require('../schemas/person.schema.js');


//TODO http://localhost:3001/api/[microservice name]/management/...
router.post("/person", validateToken.postAuthRequired, validateSchema(createPersonSchema), controller.createPerson);
router.get("/people/:token", validateToken.getAuthRequired, controller.getPeople);
router.get("/person/:token/:identification", validateToken.getAuthRequired, controller.getPersonByIdentification);

router.patch("/person/:identification", validateToken.postAuthRequired, validateSchema(updatePersonSchema), controller.updatePerson);
router.delete("/person/:identification", validateToken.postAuthRequired, controller.deletePerson);




module.exports = router;
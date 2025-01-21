const express = require('express');
const router = express.Router();

const upload = require('../libs/multer.lib.js');

const validateToken = require("../middlewares/validateToken.middleware.js");
const validateSchema = require("../middlewares/validateSchema.middleware.js");

const controller  = require("../controllers/management.controller.js")
const { createPersonSchema, updatePersonSchema } = require('../schemas/person.schema.js');


//TODO http://localhost:3001/api/[microservice name]/management/...
router.post("/person", validateToken.postAuthRequired, validateSchema(createPersonSchema), controller.createPerson);
router.get("/people/:token", validateToken.getAuthRequired, controller.getPeople);
router.get("/person/:token/:identification", validateToken.getAuthRequired, controller.getPersonByIdentification);

router.patch("/person/:identification", validateToken.postAuthRequired, validateSchema(updatePersonSchema), controller.updatePerson);
router.delete("/person", validateToken.postAuthRequired, controller.deletePerson);


router.post("/image", upload.single("photo"), validateToken.postAuthRequired, controller.uploadImage);
router.get("/image/:token/:id", validateToken.getAuthRequired, controller.getImage);
router.patch("/image", upload.single("photo"), validateToken.postAuthRequired, controller.updateImage);



module.exports = router;
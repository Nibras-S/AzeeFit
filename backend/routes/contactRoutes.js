const express =require("express");
const router = express.Router();
const {
    getcontact,updateContact,createContact,
    deleteContact,getcontactbyid
} = require("../controllers/contactController")

router.route("/").get(getcontact).post(createContact);

router.route("/:id").get(getcontactbyid).delete(deleteContact).put(updateContact);



module.exports = router;
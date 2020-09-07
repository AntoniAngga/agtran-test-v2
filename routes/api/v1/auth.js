var express = require("express");
var router = express.Router();
const auths = require("../../../controller/auth.controller.js");

//create User
router.post("/change_password/:id", auths.change_password);

//User Login
router.post("/login", auths.login);

router.post('/logout', auths.logout);


module.exports = router;




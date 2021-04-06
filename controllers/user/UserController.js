const express = require("express");

const router = express.Router();
const User = require("../../models/user/User");

router.get("/admin/user", (req, res) => {
	res.send("Listagem de usuários");
});

router.get("/admin/user/create", (req, res) => {
	res.render("admin/users/create");
});


module.exports = router;
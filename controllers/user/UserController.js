const express = require("express");

const router = express.Router();
const User = require("../../models/user/User");
const bcrypt = require("bcryptjs");

router.get("/admin/user", (req, res) => {
	res.send("Listagem de usuários");
});

router.get("/admin/user/create", (req, res) => {
	res.render("admin/users/create");
});

router.post("/users/create", (req, res) => {
	const { email, password } = req.body;
	const salt = bcryptjs.genSaltSync(10);
	const hash = bcryptjs.hashSync(password, salt);

	User.create({ email, password: hash })
		.then(() => {
			res.redirect("/");
		})
		.catch((err) => res.redirect("/"));
});

module.exports = router;

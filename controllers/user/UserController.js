const express = require("express");

const router = express.Router();
const User = require("../../models/user/User");
const bcrypt = require("bcryptjs");

router.get("/admin/users", (req, res) => {
	User.findAll().then(users => {
		res.render("admin/users/index", {
			users,
		});
	});
});

router.get("/admin/user/create", (req, res) => {
	res.render("admin/users/create");
});

router.post("/users/create", (req, res) => {
	const { email, password } = req.body;

	User.findOne({ where: { email: email } }).then(user => {
		if (user == undefined) {
			const salt = bcrypt.genSaltSync(10);
			const hash = bcrypt.hashSync(password, salt);
			User.create({
				email,
				password: hash,
			})
				.then(() => {
					res.redirect("/admin/users");
				})
				.catch(() => {
					res.redirect("/");
				});
		} else {
			res.redirect("/admin/users/create");
		}
	});
});

module.exports = router;

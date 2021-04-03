const express = require("express");

const router = express.Router();
const Category = require("../../models/categories/Category");
const slugify = require("slugify");
router.get("/admin/categories/new", (req, res) => {
	res.render("admin/categories/new");
});

router.post("/categories/save", (req, res) => {
	const { title } = req.body;
	if (title != undefined)
		Category.create({
			title,
			slug: slugify(title),
		}).then(() => {
			res.redirect("/");
		});
	else res.redirect("/admin/categories/new");
});
module.exports = router;

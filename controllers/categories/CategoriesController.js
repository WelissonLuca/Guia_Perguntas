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

router.get("/admin/categories", (req, res) => {
	Category.findAll().then((categories) => {
		res.render("./admin/categories/index", { categories });
	});
});

router.post("/categories/delete", (req, res) => {
	const { id } = req.body;
	if (id != undefined)
		if (!isNaN(id))
			Category.destroy({ where: { id } }).then(() =>
				res.redirect("/admin/categories")
			);
		else res.redirect("/admin/categories");
	else res.redirect("/admin/categories");
});
module.exports = router;

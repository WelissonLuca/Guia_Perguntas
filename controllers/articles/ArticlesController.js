const express = require("express");
const router = express.Router();
const Category = require("../../models/categories/Category");
const Article = require("../../models/articles/Articles");
const slugify = require("slugify");

router.get("/admin/articles", (req, res) => {
	Article.findAll({
		include: [{ model: Category }],
	}).then((articles) => {
		res.render("./admin/articles/index", { articles: articles });
	});
});

router.get("/admin/articles/new", (req, res) => {
	Category.findAll().then((categories) => {
		res.render("admin/articles/new", { categories });
	});
});

router.post("/articles/save", (req, res) => {
	const { title, body, category } = req.body;
	Article.create({
		title,
		slug: slugify(title),
		body,
		categoryId: category,
	}).then(() => res.redirect("/admin/articles"));
});

module.exports = router;

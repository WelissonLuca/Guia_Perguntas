const express = require("express");
const router = express.Router();
const Category = require("../../models/categories/Category");
const Article = require("../../models/articles/Articles");
const slugify = require("slugify");
const adminAuth = require("../../middlewares/adminAuth");
router.get("/admin/articles", adminAuth, (req, res) => {
	Article.findAll({
		include: [{ model: Category }],
	}).then(articles => {
		res.render("./admin/articles/index", { articles });
	});
});

router.get("/admin/articles/new", adminAuth, (req, res) => {
	Category.findAll().then(categories => {
		res.render("admin/articles/new", { categories });
	});
});

router.get("/admin/articles/edit/:id", adminAuth, (req, res) => {
	const { id } = req.params;
	if (!isNaN(id)) {
		Article.findByPk(id)
			.then(article => {
				if (article != undefined) {
					Category.findAll().then(categories => {
						res.render("admin/articles/edit", {
							article,
							categories,
						});
					});
				} else {
					res.redirect("/admin/articles/");
				}
			})
			.catch(error => {
				res.redirect("/admin/articles/");
			});
	} else {
		res.redirect("/admin/articles/");
	}
});
router.post("/articles/update", (req, res) => {
	const { id, title, body, categoryId } = req.body;
	Article.update(
		{
			title,
			body,
			slug: slugify(title).toLowerCase(),
			categoryId,
		},
		{
			where: { id },
		},
	)
		.then(() => {
			res.redirect("/admin/articles/");
		})
		.catch(error => {
			res.redirect("/admin/articles/");
		});
});
router.post("/articles/update", (req, res) => {
	const { title, body, category, slug } = req.body;
	Article.update(
		{
			title,
			slug: slugify(title),
			body,
			categoryId: category,
		},
		{
			where: {
				slug,
			},
		},
	).then(() => res.redirect("/admin/articles"));
});
router.post("/articles/delete", (req, res) => {
	const { id } = req.body;
	if (id != undefined)
		if (!isNaN(id))
			Article.destroy({ where: { id } }).then(() =>
				res.redirect("/admin/articles"),
			);
		else res.redirect("/admin/articles");
	else res.redirect("/admin/articles");
});

router.get("/articles/page/:num", (req, res) => {
	const pageLimit = 4;

	let page = req.params.num;
	let offset = 0;

	isNaN(page) || page == 0 || page == 1
		? (offset = 0)
		: (offset = (parseInt(page) - 1) * pageLimit);

	Article.findAndCountAll({
		limit: pageLimit,
		offset: offset,
		order: [["id", "DESC"]],
	}).then(articles => {
		let next;
		offset + pageLimit >= articles.count ? (next = false) : (next = true);

		let result = {
			page: parseInt(page),
			next: next,
			articles: articles,
		};

		Category.findAll().then(categories => {
			res.render("admin/articles/page", {
				result: result,
				categories: categories,
			});
		});
	});
});

module.exports = router;

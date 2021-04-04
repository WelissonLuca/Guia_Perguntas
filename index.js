const express = require("express");
const app = express();
// DB
const connection = require("./database/database");
//Controllers
const categoriesController = require("./controllers/categories/CategoriesController.js");
const articlesController = require("./controllers/articles/ArticlesController.js");

//Models
const Article = require("./models/articles/Articles");
const Category = require("./models/categories/Category");

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(express.urlencoded({ extended: false }));

app.use(express.json());

connection
	.authenticate()
	.then(() => {
		console.log("successful connection");
	})
	.catch((err) => {
		console.log("failed connection" + err);
	});
app.use("/", categoriesController);
app.use("/", articlesController);

app.get("/", (req, res) => {
	Article.findAll({
		order: [["id", "DESC"]],
	}).then((articles) =>
		Category.findAll().then((categories) => {
			res.render("index", { articles, categories });
		})
	);
});

app.get("/:slug", (req, res) => {
	const { slug } = req.params;

	Article.findOne({
		where: {
			slug,
		},
	})
		.then((article) => {
			if (article != undefined)
				Category.findAll().then((categories) =>
					res.render("article", { article, categories })
				);
			else res.redirect("/");
		})
		.catch((err) => res.redirect("/"));
});

app.get("/category/:slug", (req, res) => {
	const { slug } = req.params;
	Category.findOne({
		where: {
			slug: slug,
		},
		include: [{ model: Article }],
	})
		.then((category) => {
			if (category != undefined)
				Category.findAll().then((categories) =>
					res.render("index", {
						articles: category.articles,
						categories: categories,
					})
				);
			else res.redirect("/");
		})
		.catch((err) => res.redirect("/"));
});
app.listen(8080, () => console.log("server is running"));

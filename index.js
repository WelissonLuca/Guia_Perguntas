const express = require("express");
const app = express();
const session = require("express-session");
// DB
const connection = require("./database/database");
//Controllers
const categoriesController = require("./controllers/categories/CategoriesController.js");
const articlesController = require("./controllers/articles/ArticlesController.js");

const usersController = require("./controllers/user/UserController");

//Models
const Article = require("./models/articles/Articles");
const Category = require("./models/categories/Category");
const User = require("./models/user/User");
app.set("view engine", "ejs");
app.use(
	session({
		secret: "k2jsda22312das",
		cookie: { maxAge: 3000 },
	}),
);
app.use(express.static("public"));
app.use(express.urlencoded({ extended: false }));

app.use(express.json());

connection
	.authenticate()
	.then(() => {
		console.log("successful connection");
	})
	.catch(err => {
		console.log("failed connection" + err);
	});
app.use("/", categoriesController);
app.use("/", articlesController);
app.use("/", usersController);

app.get("/session", (req, res) => {});
app.get("/", (req, res) => {
	Article.findAll({
		order: [["id", "DESC"]],
		limit: 4,
	}).then(articles =>
		Category.findAll().then(categories => {
			res.render("index", { articles, categories });
		}),
	);
});

app.get("/:slug", (req, res) => {
	const { slug } = req.params;

	Article.findOne({
		where: {
			slug,
		},
	})
		.then(article => {
			if (article != undefined)
				Category.findAll().then(categories =>
					res.render("article", { article, categories }),
				);
			else res.redirect("/");
		})
		.catch(err => res.redirect("/"));
});

app.get("/category/:slug", (req, res) => {
	const { slug } = req.params;
	Category.findOne({
		where: {
			slug: slug,
		},
		include: [{ model: Article }],
	})
		.then(category => {
			if (category != undefined)
				Category.findAll().then(categories =>
					res.render("index", {
						articles: category.articles,
						categories,
					}),
				);
			else res.redirect("/");
		})
		.catch(err => res.redirect("/"));
});
app.listen(8080, () => console.log("server is running"));

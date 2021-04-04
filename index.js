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
	}).then((articles) => {
		Category.findAll().then((categories) => {
			res.render("index", { articles: articles, categories: categories });
		});
	});
});

app.listen(8080, () => {
	console.log("server is running");
});

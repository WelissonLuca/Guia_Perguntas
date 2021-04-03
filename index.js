const express = require("express");
const connection = require("./database/database");
const categoriesController = "./controllers/categories/CategoriesController.js";
const articlesController = "./controllers/articles/ArticlesController.js";
const app = express();

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(express.urlencoded({ extended: false }));

app.use(express.json());

connection
	.authenticate()
	.then(() => {
		console.log("successful connection");
	})
	.cath((err) => {
		console.log("failed connection" + err);
	});

app.use("/", categoriesController);
app.use("/", articlesController);

app.listen(8080, () => {
	console.log("server is running");
});

const express = require("express");
const { createPoolCluster } = require("mysql2");
const connection = require("./database/database");

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
app.get("/", (req, res) => {
	res.render("index");
});

app.listen(8080, () => {
	console.log("server is running");
});

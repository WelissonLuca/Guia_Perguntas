const express = require("express");

const router = express.Router();

router.get("/categories", (req, res) => {
	res.send("Rota Categoria");
});

router.get("/admin/categories/new", (req, res) => {
	res.send("Rota Categoria");
});

module.exports = router;

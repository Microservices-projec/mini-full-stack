const express = require("express");
const mysql = require("mysql2");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
app.use(bodyParser.json());
app.use(cors());

// MySQL Connection
const db = mysql.createConnection({
  host: "host.docker.internal",
  user: "root", // apna mysql username
  password: "root", // apna mysql password
  database: "productdb",
});

db.connect((err) => {
  if (err) throw err;
  console.log(" MySQL Connected...");
});

// ---------------- API ROUTES ----------------

// Create Product (POST)
app.post("/products", (req, res) => {
  const { name, price } = req.body;
  db.query(
    "INSERT INTO products (name, price) VALUES (?, ?)",
    [name, price],
    (err, result) => {
      if (err) throw err;
      res.send({ message: "Product Added", id: result.insertId });
    }
  );
});

// Get All Products (GET)
app.get("/products", (req, res) => {
  db.query("SELECT * FROM products", (err, rows) => {
    if (err) throw err;
    res.send(rows);
  });
});

// Update Product (PUT)
app.put("/products/:id", (req, res) => {
  const { name, price } = req.body;
  db.query(
    "UPDATE products SET name=?, price=? WHERE id=?",
    [name, price, req.params.id],
    (err) => {
      if (err) throw err;
      res.send({ message: "Product Updated" });
    }
  );
});

// Delete Product (DELETE)
app.delete("/products/:id", (req, res) => {
  db.query("DELETE FROM products WHERE id=?", [req.params.id], (err) => {
    if (err) throw err;
    res.send({ message: "Product Deleted" });
  });
});

// Get single product by ID
app.get("/products/:id", (req, res) => {
  const productId = req.params.id;

  const sql = "SELECT * FROM products WHERE id = ?";
  db.query(sql, [productId], (err, result) => {
    if (err) {
      return res.status(500).json({ error: "Database error" });
    }

    if (result.length === 0) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json(result[0]); // single product return karega
  });
});

// Get all products
app.get("/products", (req, res) => {
  const sql = "SELECT * FROM products";
  db.query(sql, (err, result) => {
    if (err) {
      return res.status(500).json({ error: "Database error" });
    }
    res.json(result);
  });
});

// Start Server
app.listen(3000, () =>
  console.log("🚀 Server running at http://localhost:3000")
);

const express = require("express");
const cors = require("cors");
const productsDB = require("../Db/database");
require("dotenv").config();
const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET;
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config(); // یادت نره
const app = express();
app.use(cors());
app.use(express.json()); // برای پردازش req.body

// دریافت همه محصولات
app.get("/api/products", (req, res) => {
  const getmain = `SELECT * FROM products`;
  productsDB.query(getmain, (error, result) => {
    if (error) {
      res.status(500).send(null);
    } else {
      res.send(result);
    }
  });
});

// ویرایش یک محصول
app.put("/api/products/edit/:id", (req, res) => {
  const id = req.params.id;
  const { name, price, count } = req.body;

  const sql = `UPDATE products SET name = ?, price = ?, count = ? WHERE id = ?`;
  const values = [name, price, count, id];

  productsDB.query(sql, values, (error, result) => {
    if (error) {
      res.status(500).send(null);
    } else {
      res.send({ success: true, result });
    }
  });
});
app.delete("/api/products/delete/:id", (req, res) => {
  const id = req.params.id;

const sql = `DELETE FROM products WHERE id = ?`;
  const values = [id];

  productsDB.query(sql, values, (error, result) => {
    if (error) {
      res.status(500).send(null);
    } else {
      res.send({ success: true, result });
    }
  });
});
app.post("/api/products/create", (req, res) => {
  const { name, price, count,image } = req.body;

const sql = `INSERT INTO products (name,count,price,image) VALUES (?,?,?,?)`;

  const values = [name, count, price,image];

  productsDB.query(sql, values, (error, result) => {
    if (error) {
      res.status(500).send(null);
    } else {
      res.send({ success: true, result });
    }
  });
});


// users///////////////////////////////////
app.post("/api/users", (req, res) => {
  const { name, phone, password } = req.body;
  

  const sql = `INSERT INTO users (name, phone, password) VALUES (?, ?, ?)`;
  const values = [name, phone, password];

  productsDB.query(sql, values, (error, result) => {
    if (error) {
      return res.status(500).json({ error: "خطا در ثبت نام" });
    }

    // بعد از ثبت نام، توکن می‌سازیم با id جدید
    const token = jwt.sign(
      { id: result.insertId, phone, name },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({ token });
  });
});




app.post("/api/users/login", (req, res) => {
  const { phone, password } = req.body;

  const sql = `SELECT * FROM users WHERE phone=? AND password=?`;
  const values = [phone, password];

  productsDB.query(sql, values, (error, result) => {
    if (error) {
      return res.status(500).json({ error: "خطا در سرور" });
    }

    if (result.length === 0) {
      return res.status(401).json({ error: "کاربر یافت نشد یا رمز اشتباه است" });
    }

    // ساختن توکن با name هم
    const token = jwt.sign(
      { 
        id: result[0].id, 
        phone: result[0].phone, 
        name: result[0].name  // اضافه شده
      },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({ token });
  });
});


app.listen(3001, () => {
  console.log("Server is running on http://localhost:3001");
});



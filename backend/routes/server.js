const express = require("express");
const cors = require("cors");
const productsDB = require("../Db/database");
require("dotenv").config();
const PORT = process.env.PORT || 3001;
const JWT_SECRET = process.env.JWT_SECRET;
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const app = express();

// سشن و کوکی/////////////
// const session = require('express-session');
// const cookieParser = require('cookie-parser');

// app.use(cookieParser());
// app.use(session({
//   secret: 'yourSecretKey',
//   resave: false,
//   saveUninitialized: true,
//   cookie: { maxAge: 24 * 60 * 60 * 1000 }, // 1 روز
// }));
//////////////////////////////////

// آپلود فایل 
const multer = require('multer');
const path = require('path');
const fs = require('fs');


// پوشه آپلود اگر وجود نداشت، بساز
const uploadDir = './uploads';
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);

// تنظیمات ذخیره‌سازی فایل
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // محل ذخیره
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const filename = `${Date.now()}-${Math.round(Math.random() * 1E9)}${ext}`;
    cb(null, filename);
  }
});

// فیلتر برای نوع فایل
const fileFilter = (req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/png', 'application/pdf'];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true); // قبول
  } else {
    cb(new Error('فرمت فایل مجاز نیست'), false); // رد
  }
};

// محدودیت‌ها: مثلاً حجم فایل ۵ مگابایت
const limits = {
  fileSize: 5 * 1024 * 1024, // 5MB
};

// ایجاد middleware multer
const upload = multer({
  storage,
  fileFilter,
  limits,
});

// مسیر آپلود فایل
app.post('/main', upload.single('file'), (req, res) => {
  res.json({ message: 'فایل با موفقیت آپلود شد!', file: req.file });
});

// هندل کردن خطاهای multer
app.use((err, req, res, next) => {
  if (err instanceof multer.MulterError || err.message.includes('فرمت')) {
    return res.status(400).json({ error: err.message });
  }
  next(err);
});

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// <form action="http://localhost:3001/main" method="POST" enctype="multipart/form-data">
//   <input type="file" name="file" />
//   <button type="submit">Upload</button>
// </form>
//////////////////////////////////////













dotenv.config(); // یادت نره
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

  const checkBan = `SELECT * FROM users WHERE phone=? AND isBanned = TRUE`;
  productsDB.query(checkBan, [phone], (banErr, banResult) => {
    if (banErr) return res.status(500).json({ error: "خطای سرور" });

    if (banResult.length > 0) {
      return res.status(403).json({ error: "اکانت شما مسدود شده است" });
      
    }

    const sql = `INSERT INTO users (name, phone, password) VALUES (?, ?, ?)`;
    const values = [name, phone, password];

    productsDB.query(sql, values, (error, result) => {
      if (error) return res.status(500).json({ error: "خطا در ثبت‌نام" });

      const token = jwt.sign(
        { id: result.insertId, phone, name,password },
        process.env.JWT_SECRET,
        { expiresIn: "1d" }
      );

      res.json({ token });
    });
  });
});





app.post("/api/users/login", (req, res) => {
  const { phone, password } = req.body;

  const checkBan = `SELECT * FROM users WHERE phone=? AND isBanned = TRUE`;
  productsDB.query(checkBan, [phone], (banErr, banResult) => {
    if (banErr) return res.status(500).json({ error: "خطای سرور" });

    if (banResult.length > 0) {
      return res.status(403).json({ error: "اکانت شما مسدود شده است" });
    }

    // بعد از اطمینان از مسدود نبودن کاربر، حالا بررسی لاگین
    const sql = `SELECT * FROM users WHERE phone=? AND password=?`;
    const values = [phone, password];

    productsDB.query(sql, values, (error, result) => {
      if (error) {
        return res.status(500).json({ error: "خطا در سرور" });
      }

      if (result.length === 0) {
        return res.status(401).json({ error: "کاربر یافت نشد یا رمز اشتباه است" });
      }

      const token = jwt.sign(
        { 
          id: result[0].id, 
          phone: result[0].phone, 
          name: result[0].name,
          password:result[0].password
        },
        process.env.JWT_SECRET,
        { expiresIn: "1d" }
      );

      res.json({ token });
    });
  });
});


app.put("/api/users/edit/password", (req, res) => {
  const { password, id } = req.body;

  const sql = `UPDATE users SET password = ? WHERE id = ?`;
  const values = [password, id];

  productsDB.query(sql, values, (error, result) => {
    if (error) {
      return res.status(500).json({ error: "خطا در تغییر رمز" });
    }

    // پس از تغییر موفق رمز، یوزر رو از دیتابیس بگیر برای تولید توکن جدید
    const getUserSql = `SELECT * FROM users WHERE id = ?`;
    productsDB.query(getUserSql, [id], (err, userResult) => {
      if (err || userResult.length === 0) {
        return res.status(500).json({ error: "خطا در دریافت اطلاعات کاربر" });
      }

      const user = userResult[0];
      const newToken = jwt.sign(
        {
          id: user.id,
          phone: user.phone,
          name: user.name,
          password: user.password, // 🆕 پسورد جدید
        },
        process.env.JWT_SECRET,
        { expiresIn: "1d" }
      );

      res.json({ success: true, token: newToken }); // ⬅️ توکن جدید
    });
  
  })
})

app.put("/api/users/edit/profile", upload.single('image'), (req, res) => {
  const { id,phone,name } = req.body;

  const sql = `UPDATE users SET image = ?,name=?,phone=? WHERE id = ?`;
    const image = req.file.filename; // فقط اسم فایل در دیتابیس ذخیره بشه

const values = [image, name, phone, id]; // ترتیب دقیق بر اساس SQL

  productsDB.query(sql, values, (error, result) => {
    if (error) {
      return res.status(500).json({ error: "خطا در تغییر رمز" });
    }

    // پس از تغییر موفق رمز، یوزر رو از دیتابیس بگیر برای تولید توکن جدید
    const getUserSql = `SELECT * FROM users WHERE id = ?`;
    productsDB.query(getUserSql, [id], (err, userResult) => {
      if (err || userResult.length === 0) {
        return res.status(500).json({ error: "خطا در دریافت اطلاعات کاربر" });
      }

      const user = userResult[0];
      const newToken = jwt.sign(
        {
          id: user.id,
          phone: user.phone,
          name: user.name,
          password: user.password,
          image:user.image // 🆕 پسورد جدید
        },
        process.env.JWT_SECRET,
        { expiresIn: "1d" }
      );

      res.json({ success: true, token: newToken }); // ⬅️ توکن جدید
    });
  
  })
})
// سشن و کوکی//////////////////////////
// app.post("/api/users/login", (req, res) => {
//   const { phone, password } = req.body;

//   const sql = `SELECT * FROM users WHERE phone=? AND password=?`;
//   productsDB.query(sql, [phone, password], (err, result) => {
//     if (err) return res.status(500).json({ error: "خطای سرور" });

//     if (result.length === 0)
//       return res.status(401).json({ error: "نام کاربری یا رمز اشتباه" });

//     // ایجاد Session
//     req.session.user = {
//       id: result[0].id,
//       name: result[0].name,
//       phone: result[0].phone,
//     };

//     res.json({ message: "ورود موفق", user: req.session.user });
//   });
// });
// app.get("/api/me", (req, res) => {
//   if (req.session.user) {
//     res.json(req.session.user);
//   } else {
//     res.status(401).json({ error: "وارد نشده‌اید" });
//   }
// });
// app.post("/api/logout", (req, res) => {
//   req.session.destroy((err) => {
//     if (err) return res.status(500).json({ error: "خطا در خروج" });
//     res.clearCookie("connect.sid");
//     res.json({ message: "خروج موفق" });
//   });
// });
////////////////////////////

app.listen(3001, () => {
  console.log("Server is running on http://localhost:3001");
});



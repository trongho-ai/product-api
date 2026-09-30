const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Product = require("./models/Product");

dotenv.config();

const app = express();

app.use(express.json());

// Kết nối MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((error) => {
    console.log("MongoDB connection error:", error);
  });

// Trang kiểm tra server
app.get("/", (req, res) => {
  res.json({
    message: "Product API is running"
  });
});

// HEALTHCHECK - kiểm tra cả API và MongoDB
app.get("/health", (req, res) => {
  const dbConnected = mongoose.connection.readyState === 1;

  if (dbConnected) {
    return res.status(200).json({
      status: "OK",
      database: "connected"
    });
  }

  return res.status(503).json({
    status: "DB_DOWN",
    database: "disconnected"
  });
});

// CREATE - thêm sản phẩm
app.post("/products", async (req, res) => {
  try {
    const product = await Product.create(req.body);
    res.status(201).json(product);
  } catch (error) {
    res.status(400).json({
      message: error.message
    });
  }
});

// READ - xem tất cả sản phẩm
app.get("/products", async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
});

// READ - xem 1 sản phẩm theo pid
app.get("/products/:pid", async (req, res) => {
  try {
    const product = await Product.findOne({
      pid: req.params.pid
    });

    if (!product) {
      return res.status(404).json({
        message: "Product not found"
      });
    }

    res.json(product);
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
});

// UPDATE - sửa sản phẩm
app.put("/products/:pid", async (req, res) => {
  try {
    const product = await Product.findOneAndUpdate(
      { pid: req.params.pid },
      req.body,
      {
        returnDocument: "after",
        runValidators: true
      }
    );

    if (!product) {
      return res.status(404).json({
        message: "Product not found"
      });
    }

    res.json(product);
  } catch (error) {
    res.status(400).json({
      message: error.message
    });
  }
});

// DELETE - xóa sản phẩm
app.delete("/products/:pid", async (req, res) => {
  try {
    const product = await Product.findOneAndDelete({
      pid: req.params.pid
    });

    if (!product) {
      return res.status(404).json({
        message: "Product not found"
      });
    }

    res.json({
      message: "Product deleted successfully"
    });
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
});

// Chạy server
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
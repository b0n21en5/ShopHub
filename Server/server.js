import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { connectDB } from "./helpers/db.js";
import categoryRoute from "./routes/categoryRoutes.js";
import productRoute from "./routes/productRoutes.js";
import authRoute from "./routes/authRoutes.js";
import cookieParser from "cookie-parser";
import { fileURLToPath } from "url";
import path from "path";
import compression from "compression";

dotenv.config();

const app = express();

const __pathname = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__pathname);


const cacheHeader = (req, res, next) => {
  if (req.method === "GET") {
    const cacheTime = 604800;
    const expiryDate = new Date(Date.now() + cacheTime * 1000);

    res.setHeader("Cache-Control", `public,max-age=${cacheTime}`);
    res.setHeader("Expires", expiryDate.toUTCString());
  }
  next();
};

// middlewares
app.use(cors());
app.use(express.json());
app.use(cookieParser());
app.use(compression())
app.use(cacheHeader)

// routes
app.use("/api/category", categoryRoute);
app.use("/api/products", productRoute);
app.use("/api/auth", authRoute);

connectDB();

app.use(
  express.static(path.join(__dirname, "../Frontend/dist"), { maxAge: "31d" })
);

app.use("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../Frontend/dist/index.html"));
});

app.listen(process.env.PORT, () => {
  console.log(`listening on port: ${process.env.PORT}`);
});

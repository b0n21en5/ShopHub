import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { connectDB } from "./helpers/db.js";
import categoryRoute from "./routes/categoryRoutes.js";
import productRoute from "./routes/productRoutes.js";
import authRoute from "./routes/authRoutes.js";
import cookieParser from "cookie-parser";

dotenv.config();

const app = express();

// middlewares
app.use(cors());
app.use(express.json());
app.use(cookieParser());

// routes
app.use("/api/category", categoryRoute);
app.use("/api/products", productRoute);
app.use("/api/auth", authRoute);

connectDB();

app.listen(process.env.PORT, () => {
  console.log(`listening on port: ${process.env.PORT}`);
});

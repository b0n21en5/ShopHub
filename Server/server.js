import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./helpers/db.js";
import categoryRoute from "./routes/categoryRoutes.js";
import formidableMiddleware from 'express-formidable'

dotenv.config();


const app = express();

// middlewares
app.use(formidableMiddleware())

// routes
app.use("/api/category", categoryRoute);

connectDB();

app.listen(process.env.PORT, () => {
  console.log(`listening on port: ${process.env.PORT}`);
});

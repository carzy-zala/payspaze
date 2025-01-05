import dotenv from "dotenv";

dotenv.config({
  path: "./.env",
});

import express from "express";
import cors from "cors";
import ApiError from "./utils/ApiError.js";

const app = express();

app.use(
  cors()
  //     {
  //     origin: process.env.CORS_ORIGIN,
  //     credentials: true,
  //   }
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));


import userRoutes from "./routes/user.router.js";

app.use("/api/v1/user", userRoutes);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

// Router

//#region For Error

app.use((err, req, res, next) => {
  if (err instanceof ApiError) {
    return res.status(err.statusCode).json({
      success: err.success,
      statusCode: err.statusCode,
      message: err.message,
      errors: err.errors,
    });
  }

  return res.status(500).json({
    success: false,
    message: "An unexpected error occurred",
  });
});

//#endregion

export default app;

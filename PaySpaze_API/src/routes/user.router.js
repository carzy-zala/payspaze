import { Router } from "express";
import verifyJWT from "../middleware/auth.middleware.js";

import {
  loginUser,
  logout,
  makePayment,
  registerUser,
} from "../controllers/user.controllers.js";

const userRoutes = Router();

userRoutes.route("/register").post(registerUser);
userRoutes.route("/login").post(loginUser);
userRoutes.route("/logout").get(verifyJWT, logout);
userRoutes.route("/makePayment").post(verifyJWT,makePayment);

export default userRoutes;

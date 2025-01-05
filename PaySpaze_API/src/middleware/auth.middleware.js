import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import User from "../models/user.model.js";
import jwt from "jsonwebtoken";

const verifyJWT = asyncHandler(async (req, res, next) => {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      throw new ApiError(400, "ERROR :: Unauthorized request !!");
    }

    const decodeToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    const user = await User.findById(decodeToken?.id).select(
      "-password -refreshtoken"
    );
    if (!user) {
      throw new ApiError(400, "ERROR :: INVALID ACCESS !!");
    }

    req.user = user;

    next();
  } catch (error) {
    throw new ApiError(400, error?.message || "ERROR :: Invalid access !!");
  }
});

export default verifyJWT;

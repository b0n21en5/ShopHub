import jwt from "jsonwebtoken";
import { NotFound } from "./handleError.js";
import userModel from "../models/userModel.js";

export const verifyAuthentication = async (req, res, next) => {
  try {
    const token = req.cookies.user_token;
    const decoded = await jwt.verify(token, process.env.JWT_KEY);

    req.user = decoded;

    next();
  } catch (error) {
    return NotFound(res, "Unauthenticated!");
  }
};

export const verifyAuthorization = async (req, res, next) => {
  try {
    const token = req.cookies.admin_token;
    const decoded = await jwt.verify(token, process.env.JWT_KEY);

    const user = await userModel.findById(decoded._id);

    if (!user.role) throw error();
    next();
  } catch (error) {
    return NotFound(res, "Unauthorized Access!");
  }
};

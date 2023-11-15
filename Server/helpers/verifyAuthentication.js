import jwt from "jsonwebtoken";
import { NotFound } from "./handleError.js";

export const verifyAuthentication =async (req, res, next) => {
  const token = req.cookies.user_token;

  if (!token) {
    return NotFound(res, "Unauthenticated!");
  }

  try {
    const decoded =await jwt.verify(token, process.env.JWT_KEY);

    req.user = decoded;

    next();
  } catch (error) {
    return NotFound(res, "Unauthenticated!");
  }
};

export const verifyAuthorization = async (req, res, next) => {
  try {
    const token = req.cookies.admin_token;
    const decoded =await jwt.verify(token, process.env.JWT_KEY);

    const user = await userModel.findById(req.user._id);

    req.user = decoded;

    if (!user.role) throw error();
    next();
  } catch (error) {
    return NotFound(res, "Unauthorized!");
  }
};

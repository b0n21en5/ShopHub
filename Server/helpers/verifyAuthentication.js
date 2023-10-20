import jwt from "jsonwebtoken";
import { NotFound } from "./handleError.js";

export const verifyAuthentication = (req, res, next) => {
  const token = req.cookies.jwt_token;

  if (!token) {
    return NotFound(res, "Unauthenticated!");
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_KEY);

    req.user = decoded;

    next();
  } catch (error) {
    return NotFound(res, "Unauthenticated!");
  }
};

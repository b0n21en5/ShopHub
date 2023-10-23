import { checkPassword, hashPassword } from "../helpers/authHelper.js";
import { NotFound, serverError } from "../helpers/handleError.js";
import jwt from "jsonwebtoken";
import userModel from "../models/userModel.js";

export const registerController = async (req, res) => {
  try {
    const { username, email, password, phone, address, role, answer } =
      req.body;

    // validation for request body
    switch (true) {
      case !username:
        return NotFound(res, "Username required!");
      case !email:
        return NotFound(res, "Email required!");
      case !password:
        return NotFound(res, "Password required!");
      case !phone:
        return NotFound(res, "Phone required!");
      case !address:
        return NotFound(res, "Address required!");
      case !answer:
        return NotFound(res, "Answer required!");
    }

    const existingUser = await userModel.findOne({ email: email });
    if (existingUser) {
      return NotFound(res, "Email already used! Try another");
    }

    const hashedPassword = await hashPassword(password);

    const user = await new userModel({
      ...req.body,
      password: hashedPassword,
    }).save();

    user.password = "********";

    return res
      .status(200)
      .send({ message: `User ${username} added successfully`, user });
  } catch (error) {
    return serverError(res, error, "Error adding new user!");
  }
};

export const userLoginController = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) return NotFound(res, "Invalid Email or Password!");

    const user = await userModel.findOne({ email });
    if (!user) {
      return NotFound(res, "Email is not registered!");
    }

    const isMatch = await checkPassword(password, user.password);
    if (!isMatch) {
      return NotFound(res, "Invalid Password!");
    }

    user.password = "********";

    const token = await jwt.sign({ _id: user._id }, process.env.JWT_KEY, {
      expiresIn: "7d",
    });

    return res
      .cookie("jwt_token", token, { httpOnly: true })
      .status(200)
      .send({ message: "Login sucessfull", user, token });
  } catch (error) {
    return serverError(res, error, "Error while logging");
  }
};

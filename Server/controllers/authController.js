import { checkPassword, hashPassword } from "../helpers/authHelper.js";
import { NotFound, serverError } from "../helpers/handleError.js";
import jwt from "jsonwebtoken";
import userModel from "../models/userModel.js";
import orderModel from "../models/orderModel.js";

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
    const { email, phone, password } = req.body;

    if (!email && !phone) return NotFound(res, "Invalid Email or Phone!");
    if (!password) return NotFound(res, "Password required!");

    let user = await userModel.findOne({
      $or: [{ email: email }, { phone: phone }],
    });
    if (!user) {
      return NotFound(res, "Email/Phone is not registered!");
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
      .cookie("user_token", token, {
        httpOnly: true,
        expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      })
      .status(200)
      .send(user);
  } catch (error) {
    return serverError(res, error, "Error while logging");
  }
};

export const adminLoginController = async (req, res) => {
  try {
    const { email, phone, password } = req.body;

    if (!email && !phone) return NotFound(res, "Invalid Email or Phone!");
    if (!password) return NotFound(res, "Password required!");

    let user = await userModel.findOne({
      $or: [{ email: email }, { phone: phone }],
    });
    if (!user) {
      return NotFound(res, "Email/Phone is not registered!");
    }

    const isMatch = await checkPassword(password, user.password);
    if (!isMatch) {
      return NotFound(res, "Invalid Password!");
    }

    if (user.role) {
      const token = await jwt.sign({ _id: user._id }, process.env.JWT_KEY, {
        expiresIn: "7d",
      });

      user.password = "******";
      return res
        .cookie("admin_token", token, {
          httpOnly: true,
          expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        })
        .status(200)
        .send(user);
    }

    return NotFound(res, `${email} is not Admin!`);
  } catch (error) {
    return serverError(res, error, "Error in Admin Login!");
  }
};

export const updateUserCredentials = async (req, res) => {
  try {
    const { email, password, phone } = req.body;

    let user = await userModel.findOne({
      $or: [{ email: email }, { phone: phone }],
    });
    if (!user) {
      return NotFound(res, "No User Found with Email/Phone");
    }

    let hashedPassword;
    if (password) hashedPassword = await hashPassword(password);

    const updatedUser = await userModel.findOneAndUpdate(
      { _id: user._id },
      { $set: req.body, password: hashedPassword },
      { new: true }
    );

    updatedUser.password = "********";

    return res.status(200).send(updatedUser);
  } catch (error) {
    return serverError(res, error, "Error occurred while updating user info!");
  }
};

export const getSingleUserOrdersWithFilters = async (req, res) => {
  try {
    let { status, search, time } = req.query;

    const args = { buyer: req.user._id };

    // search orders
    if (search) {
      let orders = await orderModel
        .find(args)
        .populate("products", "-photo")
        .sort({ createdAt: -1 });

      orders = orders.filter((order) =>
        order.products.some((product) =>
          product.name.toLowerCase().includes(search)
        )
      );
      return res.status(200).send(orders);
    }

    // filter orders by status
    if (status && status.length) {
      status = status.split(",");
      args["status"] = { $in: status };
    }

    // filter orders by time
    if (time && time.length) {
      time = time.split(",");
      time.sort((a, b) => b - a);

      if (time[0] > 0) {
        const daysAgo = new Date();
        daysAgo.setDate(daysAgo.getDate() - time[0]);
        args["updatedAt"] = { $gte: daysAgo };
      }
    }

    const orders = await orderModel
      .find(args)
      .populate("products", "-photo")
      .sort({ createdAt: -1 });

    return res.status(200).send(orders);
  } catch (error) {
    return serverError(res, error, "Error Fetching Single User Orders!");
  }
};

export const getAllOrders = async (req, res) => {
  try {
    let allOrders = await orderModel
      .find({})
      .populate("products", "-photo")
      .populate("buyer", "username")
      .sort({ createdAt: "-1" });

    if (!allOrders) {
      return NotFound(res, "No Orders Found!");
    }

    return res.status(200).send(allOrders);
  } catch (error) {
    return serverError(res, error, "Error While Fetching All Orders!");
  }
};

export const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const order = await orderModel.findByIdAndUpdate(
      req.params.orderId,
      { status },
      { new: true }
    );

    if (!order) {
      return NotFound(res, "No Order with this ID!");
    }

    return res
      .status(200)
      .send({ message: "Successfully Updated Order Status", order });
  } catch (error) {
    return serverError(res, error, "Error Updating Order Status!");
  }
};

import { NotFound, serverError } from "../helpers/handleError.js";
import orderModel from "../models/orderModel.js";
import productModel from "../models/productModel.js";
import userModel from "../models/userModel.js";

export const makeNewOrder = async (req, res) => {
  try {
    const { productId, userId } = req.body;
    if (!productId) {
      return NotFound(res, "Product Id required!");
    }
    if (!userId) {
      return NotFound(res, "User Id required!");
    }

    const user = await userModel.findById(userId);
    if (!user) {
      return NotFound(res, "No user found!");
    }

    const product = await productModel.findById(productId);
    if (!product) {
      return NotFound(res, "No product found!");
    }

    const newOrder = await new orderModel({ productId, userId }).save();

    return res
      .status(200)
      .send({ message: "Order made successfully", newOrder });
  } catch (error) {
    return serverError(res, error, "Error while making an order!");
  }
};

export const getOrdersByUser = async (req, res) => {
  try {
    const orders = await orderModel.find({ userId: req.params.userId });

    if (!orders) {
      return NotFound(res, "No order found for the user");
    }

    return res.status(200).send(orders);
  } catch (error) {
    return serverError(res, error, "Error while fetching orders!");
  }
};

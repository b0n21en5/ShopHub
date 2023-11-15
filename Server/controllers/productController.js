import slugify from "slugify";
import fs from "fs";
import productModel from "../models/productModel.js";
import { NotFound, serverError } from "../helpers/handleError.js";
import mongoose from "mongoose";
import dotenv from "dotenv";
import Razorpay from "razorpay";
import orderModel from "../models/orderModel.js";

dotenv.config();

// Instance to connect with razorpay
const razorpayInstance = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

export const addNewProduct = async (req, res) => {
  try {
    const {
      name,
      desc,
      quantity,
      price,
      category,
      subcategory,
      rating,
      discount,
      delivery,
      brand,
    } = req.fields;
    const { photo } = req.files;

    // validation for required fields
    switch (true) {
      case !name:
        return NotFound(res, "Name required!");
      case !desc:
        return NotFound(res, "Description required!");
      case !quantity:
        return NotFound(res, "Quantity required!");
      case !price:
        return NotFound(res, "Price required!");
      case !category:
        return NotFound(res, "Category required!");
      case !rating:
        return NotFound(res, "Rating required!");
      case !discount:
        return NotFound(res, "Discount required!");
      case !delivery:
        return NotFound(res, "Delivery required in days!");
      case !brand:
        return NotFound(res, "Brand required!");
      case !photo || photo.size > 1000000:
        return NotFound(res, "Photo required && size should be less than 1mb!");
    }

    const product = new productModel({
      ...req.fields,
      slug: slugify(name),
      subcategory: subcategory || null,
    });

    product.photo.data = fs.readFileSync(photo.path);
    product.photo.contentType = photo.type;

    await product.save();

    return res
      .status(200)
      .send({ message: "Product Added Successfully!", product });
  } catch (error) {
    return serverError(res, error, "Error while adding new product!");
  }
};

export const getAllProducts = async (req, res) => {
  try {
    const products = await productModel.find().select("-photo");

    return res.status(200).send(products);
  } catch (error) {
    return serverError(res, error, "Error while fetching all products");
  }
};

export const getSingleProduct = async (req, res) => {
  try {
    const product = await productModel
      .findOne({
        _id: req.params.productId,
      })
      .select("-photo");

    if (product) {
      return res.status(200).send(product);
    }

    return NotFound(res, "No Product Found!");
  } catch (error) {
    return serverError(res, error, "Error While Getting a Product!");
  }
};

export const updateProduct = async (req, res) => {
  try {
    const {
      name,
      desc,
      quantity,
      price,
      category,
      subcategory,
      delivery,
      rating,
      discount,
      brand,
    } = req.fields;
    const { photo } = req.files;

    // validation for required fields
    switch (true) {
      case !name:
        return NotFound(res, "Name required!");
      case !desc:
        return NotFound(res, "Description required!");
      case !quantity:
        return NotFound(res, "Quantity required!");
      case !price:
        return NotFound(res, "Price required!");
      case !category:
        return NotFound(res, "Category required!");
      case !delivery:
        return NotFound(res, "Delivery required!");
      case !discount:
        return NotFound(res, "Discount required!");
      case !rating:
        return NotFound(res, "Rating required!");
      case !brand:
        return NotFound(res, "Brand required!");
      case photo && photo.size > 1000000:
        return NotFound(res, "Photo required && size should be less than 1mb!");
    }

    const product = await productModel.findByIdAndUpdate(
      req.params.productId,
      {
        ...req.fields,
        slug: slugify(name),
        subcategory: subcategory || null,
      },
      { new: true }
    );

    if (!product) {
      return NotFound(res, "No Product Found!");
    }

    if (photo) {
      product.photo.data = fs.readFileSync(photo.path);
      product.photo.contentType = photo.type;
    }

    await product.save();

    return res.status(200).send({
      success: true,
      message: "Product Updated Successfully",
      product,
    });
  } catch (error) {
    return serverError(res, error, "Error while updating product");
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const product = await productModel
      .findByIdAndDelete(req.params.productId)
      .select("-photo");

    return res.status(200).send({
      success: true,
      message: "Product deleted successfully",
      product,
    });
  } catch (error) {
    return serverError(res, error, "Error while deleting product!");
  }
};

export const getProductPhoto = async (req, res) => {
  try {
    const product = await productModel.findById(req.params.productId);
    if (!product.photo) {
      return NotFound(res, "No image found!");
    }

    res.contentType(product.photo.contentType);
    return res.status(200).send(product.photo.data);
  } catch (error) {
    return serverError(res, error, "Error getting product photo");
  }
};

export const getProductsByCategory = async (req, res) => {
  try {
    const { currPage, pageLimit } = req.query;

    const skip = (currPage - 1) * pageLimit || 0;
    const limit = pageLimit || 6;

    const products = await productModel
      .find({ category: req.params.cid })
      .skip(skip)
      .limit(limit)
      .select("-photo");
    if (!products.length) {
      return NotFound(res, "No product under this category");
    }

    return res.status(200).send(products);
  } catch (error) {
    return serverError(res, error, "Error in products by category");
  }
};

export const getProductsBySubCategory = async (req, res) => {
  try {
    const products = await productModel.find({
      subcategory: req.params.subcat,
    });
    if (!products.length) {
      return NotFound(
        res,
        `No products under sub-category ${req.params.subcat}`
      );
    }

    return res.status(200).send(products);
  } catch (error) {
    return serverError(res, error, "Error in products by sub-category");
  }
};

export const searchProducts = async (req, res) => {
  try {
    const { searchKey } = req.params;

    const result = [];

    const searchQry = { name: { $regex: searchKey, $options: "i" } };

    const products = await productModel.find(searchQry);
    if (products.length) {
      return res.status(200).send(products);
    }
  } catch (error) {
    return serverError(res, error, "Error while Searching Products!");
  }
};

export const filterProducts = async (req, res) => {
  try {
    let {
      cid,
      sortBy,
      order,
      currPage,
      pageLimit,
      price,
      rating,
      discount,
      brand,
    } = req.query;

    sortBy = sortBy || "price";

    order = order === "desc" ? -1 : 1;

    const sortArg = {};
    sortArg[sortBy] = order;

    const skip = (currPage - 1) * pageLimit || 0;
    const limit = pageLimit || 6;

    let filterArgs = {};
    if (cid) filterArgs.category = cid;

    if (price.length) {
      price = price.split(",");
      filterArgs.price = { $gte: price[0] || 0, $lte: price[1] || 100000 };
    }

    if (rating) filterArgs.rating = { $gte: rating || 1 };

    if (discount && discount.length > 0) {
      filterArgs.discount = {
        $gte: Math.min(...discount.split(",").map(Number)),
      };
    }

    if (brand && brand.length > 0) {
      filterArgs.brand = { $in: brand.split(",") };
    }

    const products = await productModel
      .find(filterArgs)
      .sort(sortArg)
      .select("-photo")
      .skip(skip)
      .limit(limit);

    return res.status(200).send(products);
  } catch (error) {
    return serverError(res, error, "Error while filtering products");
  }
};

export const getAllBrands = async (req, res) => {
  try {
    const { catId } = req.query;

    const categoryId = new mongoose.Types.ObjectId(catId);

    // Using aggregate to group products by brand and get distinct brands
    const brandAggregation = await productModel.aggregate([
      {
        $match: {
          category: categoryId,
          brand: { $exists: true, $ne: null },
        },
      },
      {
        $group: {
          _id: "$brand",
        },
      },
    ]);

    const allBrands = brandAggregation.map((item) => item._id);

    return res.status(200).json(allBrands);
  } catch (error) {
    return serverError(res, error, "Error while fetching brands!");
  }
};

export const getMultipleProducts = async (req, res) => {
  try {
    const { ids } = req.query;

    const productIds = ids.split(",");

    const multipleProducts = await productModel
      .find({
        _id: { $in: productIds },
      })
      .select("-photo");

    if (multipleProducts) {
      return res.status(200).send(multipleProducts);
    }

    return NotFound(res, "No product found!");
  } catch (error) {
    return serverError(res, error, "Error while fetching multiple products!");
  }
};

export const makeOrderPayment = async (req, res) => {
  try {
    const { products } = req.body;

    let total = 0;
    if (products?.length) {
      products.forEach(
        (pr) => (total += parseInt(pr?.price * (100 - pr?.discount)))
      );
    }
    const order = await razorpayInstance.orders.create({
      amount: total,
      currency: "INR",
      receipt: "receipt#1",
    });

    res.status(200).send(order);
  } catch (error) {
    return serverError(res, error, "Error While making payment!");
  }
};

export const handleSuccessfulPayment = async (req, res) => {
  try {
    const { paymentDetails, products } = req.body;

    // Validate payment details (you may want to add more validation)
    if (!paymentDetails || !paymentDetails.razorpayPaymentId) {
      return NotFound(res, "Invalid payment details");
    }

    // Verify the payment status with Razorpay
    const paymentStatus = await razorpayInstance.payments.fetch(
      paymentDetails.razorpayPaymentId
    );

    if (paymentStatus.status === "captured") {
      //saving order to database
      const order = new orderModel({
        products: products,
        buyer: req.user._id,
        payment: paymentStatus,
      }).save();

      return res.status(200).send({ status: "Payment successful" });
    } else {
      return res.status(400).send({ status: "Payment not successful" });
    }
  } catch (error) {
    return serverError(res, error, "Error while payment success API!");
  }
};

export const getSimilarProducts = async (req, res) => {
  try {
    const { catid, pid } = req.params;
    console.log(catid);

    const similarProducts = await productModel
      .find({
        category: catid,
        _id: { $ne: pid },
      })
      .select("-photo");

    if (!similarProducts.length) {
      return NotFound(res, "No Similar Products!");
    }

    return res.status(200).send(similarProducts);
  } catch (error) {
    return serverError(res, error, "Error Fetching Similar Products!");
  }
};

export const getNewlyAddedProduct = async (req, res) => {
  try {
    let { currPage, pageLimit } = req.query;
    const skip = (currPage - 1) * pageLimit || 0;
    const limit = pageLimit || 4;

    const products = await productModel
      .find()
      .select("-photo")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    if (!products) {
      return NotFound(res, "No Products Found!");
    }

    return res.status(200).send(products);
  } catch (error) {
    return serverError(res, error, "Error Fetching Newly Added Products!");
  }
};

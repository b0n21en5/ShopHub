import slugify from "slugify";
import fs from "fs";
import productModel from "../models/productModel.js";
import { NotFound, serverError } from "../helpers/handleError.js";

export const addNewProduct = async (req, res) => {
  try {
    const { name, desc, quantity, price, category, subcategory } = req.fields;
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
    const { name, desc, quantity, price, category, subcategory } = req.fields;
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
    const products = await productModel.find({ category: req.params.cid });
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

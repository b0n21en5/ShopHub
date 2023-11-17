import slugify from "slugify";
import fs from "fs";
import categoryModel from "../models/categoryModel.js";
import { NotFound, serverError } from "../helpers/handleError.js";

export const addNewCategory = async (req, res) => {
  try {
    const { name, subcategories } = req.fields;
    const { photo } = req.files;

    if (!name) return NotFound(res, "Name is Required");
    if (!photo || photo.size > 1000000)
      return NotFound(res, "Photo is Required and should be less than 1mb");

    const category = new categoryModel({
      ...req.fields,
      slug: slugify(name),
      subcategories: subcategories || null,
    });

    category.photo.data = fs.readFileSync(photo.path);
    category.photo.contentType = photo.type;

    await category.save();

    return res.status(200).send({
      success: true,
      message: "Category Added Successfully",
      category,
    });
  } catch (error) {
    return serverError(res, error, "Error adding new category");
  }
};

export const getAllCategory = async (req, res) => {
  try {
    const category = await categoryModel.find().select("-photo").sort({createdAt:-1});
    return res.status(200).send(category);
  } catch (error) {
    return serverError(res, error, "Error while fetching categories");
  }
};

export const getSingleCategory = async (req, res) => {
  try {
    const category = await categoryModel
      .findById(req.params.cid)
      .select("-photo");
    if (!category) {
      return NotFound(res, "No Category Found!");
    }

    return res.status(200).send(category);
  } catch (error) {
    return serverError(res, error, "Error Fetching Single Category!");
  }
};

export const updateCategory = async (req, res) => {
  try {
    const { name, subcategories } = req.fields;
    const { photo } = req.files;

    if (photo && photo.size > 1000000)
      return NotFound(res, "Photo size should be less than 1mb!");

    const category = await categoryModel.findByIdAndUpdate(
      req.params.cid,
      { name, slug: slugify(name), subcategories },
      { new: true }
    );

    if (photo) {
      category.photo.data = fs.readFileSync(photo.path);
      category.photo.contentType = photo.type;
    }

    await category.save();

    return res
      .status(200)
      .send({ message: "Category updated successfully", category });
  } catch (error) {
    return serverError(res, error, "Error while updating category");
  }
};

export const deleteCategory = async (req, res) => {
  try {
    const category = await categoryModel.findByIdAndDelete(req.params.cid);

    if (!category) {
      return NotFound(res, "Category not found!");
    }

    res.status(200).send({ message: "Category Deleted", category });
  } catch (error) {
    return serverError(res, error, "Error while deleting category!");
  }
};

export const getCategoryPhoto = async (req, res) => {
  try {
    const { photo } = await categoryModel.findById(req.params.cid);

    res.contentType(photo.contentType);
    return res.status(200).send(photo.data);
  } catch (error) {
    return serverError(res, error, "Error while fetching category photo");
  }
};

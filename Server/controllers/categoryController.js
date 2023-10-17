import slugify from "slugify";
import fs from "fs";
import categoryModel from "../models/categoryModel.js";

export const addNewCategory = async (req, res) => {
  try {
    const { name } = req.fields;
    const { photo } = req.files;

    switch (true) {
      case !name:
        return res.status(500).send({ error: "Name is Required" });
      case !photo || photo.size > 1000000:
        return res
          .status(500)
          .send({ error: "Photo is Required and should be less than 1mb" });
    }

    const category = new categoryModel({ ...req.fields, slug: slugify(name) });

    if (photo) {
      category.photo.data = fs.readFileSync(photo.path);
      category.photo.contentType = photo.type;
    }

    await category.save();

    res
      .status(200)
      .send({
        success: true,
        message: "Category Added Successfully",
        category,
      });
  } catch (error) {
    console.log(error);
  }
};

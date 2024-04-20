import mongoose from "mongoose";
import { categorySchema } from "../models/category.js";

function createCategoryCollectionForShop(shopId) {
  const collectionName = `category_${shopId}`;
  return mongoose.model(collectionName, categorySchema);
}

const createCategory = async (req, res) => {
  const { name } = req.body;
  const shop = req.shop
  try {
    const Category = createCategoryCollectionForShop(shop.uuid);
    if (!name) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const categoryExist = await Category.findOne({ name });

    if (categoryExist) {
      return res.status(400).json({ message: "Category already exists" });
    }

    const category = await Category.create({
      name,
    });

    if (!category) {
      return res
        .status(400)
        .json({ message: "Category create to failed ,  please try again" });
    }
    await category.save();
    res.status(201).json({
      success: true,
      message: "Cacategory create successfully",
      category,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: error.message || "create category error!!" });
  }
};

const getCategory = async (req, res) => {
  const search = req.query.q; 
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const shop = req.shop
  try {
    const Category = createCategoryCollectionForShop(shop.uuid);
    let query = {};
    if (search) {
      query = {
        $or: [{ name: { $regex: search, $options: "i" } }],
      };
    }
    const skip = (page - 1) * limit;
    const category = await Category.find(query).skip(skip).limit(limit);

    if (category.length === 0) {
      return res.status(404).json({ message: "No matching categories found." });
    }

    res.status(200).json({
      data: category,
      currentPage: page,
      totalPages: Math.ceil(category.length / limit),
      totalItems: category.length,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Find category error!!" });
  }
};

export { createCategory, getCategory };

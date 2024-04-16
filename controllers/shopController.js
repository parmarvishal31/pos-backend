import Shop from "../models/shop.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const createShop = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const oldShop = await Shop.findOne({ email });
    if (oldShop)
      return res.status(404).json({ message: "Shop already exist!" });

    const hashPassword = await bcrypt.hash(password, 12);
    const shop = await Shop.create({
      name,
      email,
      password: hashPassword,
    });

    if (!shop)
      return res
        .status(400)
        .json({ message: "shop registration failed, please try again later" });

    const newShop = await shop.save();
    res.status(201).json({
      success: true,
      message: "Registration successfully..",
      shop: newShop,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Create shop error!!" });
  }
};

const getAllShop = async (req, res) => {
  const search = req.query.q; // Remove leading/trailing whitespace
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;

  try {
    let query = {};
    if (search) {
      query = {
        $or: [
          { name: { $regex: search, $options: "i" } },
          { email: { $regex: search, $options: "i" } },
          { isActive: { $regex: search, $options: "i" } },
        ],
      };
    }
    const skip = (page - 1) * limit;
    const shop = await Shop.find(query)
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    if (shop.length === 0) {
      return res.status(404).json({ message: "No matching shops found." });
    }

    res.status(200).json({
      data: shop,
      currentPage: page,
      totalPages: Math.ceil(shop.length / limit),
      totalItems: shop.length,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Find shop error!!" });
  }
};

const signinShop = async (req, res) => {
  const { email, password } = req.body;

  try {
    const oldShop = await Shop.findOne({ email });
    if (!oldShop)
      return res.status(404).json({ message: "Shop does not  exist!" });

    const matchPasswrod = await bcrypt.compare(password, oldShop.password);
    if (!matchPasswrod)
      return res.status(404).json({ message: "Invalid Shop credential" });

    const token = jwt.sign(
      {
        id: oldShop._id,
        email: oldShop.email,
        isActive: oldShop.isActive,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: process.env.JWT_EXPIRY,
      }
    );

    res.status(201).json({
      success: true,
      message: "Login successfully..",
      shop: oldShop,
      token,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message || "Signin Problem! (:",
    });
  }
};

const updateShop = async (req, res) => {
  const { id } = req.params;
  const updates = req.body;

  try {
    const updatedShop = await Shop.findByIdAndUpdate(id, updates, {
      new: true,
    });

    if (!updatedShop) {
      return res.status(404).json({ message: "Shop not found." });
    }

    res
      .status(200)
      .json({ message: "Shop updated successfully.", shop: updatedShop });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Update shop error." });
  }
};

const deleteShop = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedShop = await Shop.findByIdAndDelete(id);

    if (!deletedShop) {
      return res.status(404).json({ message: "Shop not found." });
    }

    res
      .status(200)
      .json({ message: "Shop deleted successfully.", shop: deletedShop });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Delete shop error." });
  }
};

export { createShop, getAllShop, signinShop, updateShop, deleteShop };

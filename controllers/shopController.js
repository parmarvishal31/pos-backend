import Shop from "../models/shop.js";
import bcrypt from "bcryptjs";

const createShop = async (req, res) => {
  const {name,email,password} = req.body;
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
      user: newShop,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Create shop error!!" });
  }
};

const getAllShop = async (req, res) => {
  const search = req.query.q; // Remove leading/trailing whitespace
  console.log("Search term:", search);
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;

  try {
    let query = {};
    if (search) {
      query = {
        $or: [{ name: { $regex: search, $options: "i" } }],
      };
    }
    const skip = (page - 1) * limit;
    const shop = await Shop.find(query).skip(skip).limit(limit);

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

export { createShop, getAllShop };

import User from "../models/user.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
const signup = async (req, res) => {
  const { username, name, email, password } = req.body;
  try {
    const oldUser = await User.findOne({ email });
    if (oldUser)
      return res.status(404).json({ message: "Email already exist!" });

    const oldUsername = await User.findOne({ username });
    if (oldUsername)
      return res.status(404).json({ message: "Username already exist!" });
    const hashPassword = await bcrypt.hash(password, 12);
    const user = await User.create({
      username,
      name,
      email,
      password: hashPassword,
    });

    if (!user)
      return res
        .status(400)
        .json({ message: "User registration failed, please try again later" });

    const newUser = await user.save();
    const token = jwt.sign(
      {
        id: newUser._id,
        email: newUser.email,
        role: newUser.role,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: process.env.JWT_EXPIRY,
      }
    );

    res.status(201).json({
      success: true,
      message: "Registration successfully..",
      user: newUser,
      token,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message || "Signup Problem! (:",
    });
  }
};

const signin = async (req, res) => {
  const { email, password } = req.body;

  try {
    const oldUser = await User.findOne({ email });
    if (!oldUser)
      return res.status(404).json({ message: "User does not  exist!" });

    const matchPasswrod = await bcrypt.compare(password, oldUser.password);
    if (!matchPasswrod)
      return res.status(404).json({ message: "Invalid User credential" });

    const token = jwt.sign(
      {
        id: oldUser._id,
        email: oldUser.email,
        role: oldUser.role,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: process.env.JWT_EXPIRY,
      }
    );

    res.status(201).json({
      success: true,
      message: "Login successfully..",
      user: oldUser,
      token,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message || "Signin Problem! (:",
    });
  }
};

const profile = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId);

    if (user) {
      return res.status(200).json({
        success: true,
        message: "User profile fetched successfully",
        user,
      });
    } else {
      return res.status(400).json({
        success: false,
        message: "User profile not found",
      });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Somthin went wrong!",
    });
  }
};

export { signup, signin, profile };

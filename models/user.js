import mongoose, { Schema, model } from "mongoose";

const userSchema = new Schema({
  username: { type: String },
  name: { type: String },
  email: { type: String },
  password: { type: String },
  role: { type: String, default: "user" },
});

const User = model("User", userSchema);
export default User;

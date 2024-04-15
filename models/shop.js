import mongoose, { Schema, model } from "mongoose";

const shopSchema = new Schema({
  name: { type: String },
  email: { type: String },
  password: { type: String },
});

const Shop = model("Shop", shopSchema);
export default Shop;

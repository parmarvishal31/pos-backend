import { Schema, model } from "mongoose";

const shopSchema = new Schema(
  {
    name: { type: String },
    email: { type: String },
    password: { type: String },
    isActive: { type: String, default: false },
    address: { type: String },
    phone: { type: String },
    start_date: { type: Date },
    end_date: { type: Date },
    query: { type: Array, default: [] },
    pincode: { type: String },
  },
  { timestamps: true }
);

const Shop = model("Shop", shopSchema);
export default Shop;

import mongoose, { Schema, model } from "mongoose";

export const categorySchema = new Schema({
  name: { type: String },
});

const Category = model("Category", categorySchema);
export default Category;

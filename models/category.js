import mongoose, { Schema, model } from "mongoose";

const categorySchema = new Schema({
  name: { type: String },
  icon: {
    public_id: {
        type: String,
    },
    secure_url: {
        type: String,
    },
},
});

const Category = model("Category", categorySchema);
export default Category;

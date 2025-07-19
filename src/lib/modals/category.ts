import { Schema, model, models, Types } from "mongoose";

const CategorySchema = new Schema(
  {
    title: { type: String, required: true },
    user: { type: Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

const Category = models.Category || model("Category", CategorySchema);

export default Category;

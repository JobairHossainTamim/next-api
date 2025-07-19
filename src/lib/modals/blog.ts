import { Schema, model, models, Types } from "mongoose";

const BlogSchema = new Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  user: { type: Schema.Types.ObjectId, ref: "User" },
  category: { type: Schema.Types.ObjectId, ref: "Category" },
});

const Blog = models.Blog || model("Blog", BlogSchema);
export default Blog;

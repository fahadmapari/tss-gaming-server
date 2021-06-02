import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

const blogScehma = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "title is required"],
    },
    blogContent: {
      type: String,
      required: [true, "blog content is required"],
    },
    category: {
      type: String,
      default: "uncategorized",
      lowercase: true,
    },
    featuredImage: {
      type: String,
    },
    videoLink: {
      type: String,
    },
    keywords: {
      type: [String],
    },
    metaDescription: {
      type: String,
    },
  },
  { timestamps: true }
);

blogScehma.plugin(mongoosePaginate);

const Blog = mongoose.model("Blog", blogScehma);
export default Blog;

import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

const blogScehma = new mongoose.Schema(
  {
    heading: {
      type: String,
      required: [true, "title is required"],
    },
    subHeading: {
      type: String,
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
    conclusion: {
      type: String,
    },
    summary: {
      type: String,
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

blogScehma.plugin(mongoosePaginate);

const Blog = mongoose.model("Blog", blogScehma);
export default Blog;

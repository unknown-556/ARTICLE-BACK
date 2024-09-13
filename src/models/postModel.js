import mongoose from "mongoose";
import { ObjectId } from "mongodb";

const articleSchema = new mongoose.Schema({
    _id: {
      type: ObjectId,
      auto: true, 
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    postedBy: {
        type: String,
        ref: 'User',
        required: true
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      default: '',
    },
    content: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      default: '', 
    },
    category: {
      type: String,
    },
    comments: [
      {
        userId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
        postedBy: {
          type: String,
          ref: "User",
        },
        text: {
          type: String,
          required: true,
        },
        image: {
          type: String,
        },
        createdAt: {
          type: Date,
          default: Date.now,
        }
      }
    ],
    viewCount: { 
        type: Number, 
        default: 0 
    },
    createdAt: { 
        type: Date, 
        default: Date.now 
    },
});

const Post = mongoose.model("Article", articleSchema,)
export default Post
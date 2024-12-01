import mongoose from "mongoose";
import Post from "./postModel.js"

const communitySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      unique: true,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      default: "",
    },
    picture: {
      type: String,
      default: "",
    },
    tags: [String],
    members: [
      {
        userId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
        role: {
          type: String,
          enum: ["member", "communityAdmin"], 
          default: "member",
        },
      },
    ],
    moderators: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    posts: [
      {
        type: mongoose.Schema.Types.ObjectId, 
        ref: "Post",
      },
    ],
    createdAt: {
      type: Date,
      default: Date.now,
    },
    latestActivity: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true, 
  }
);

const Community = mongoose.model("Community", communitySchema);

export default Community;

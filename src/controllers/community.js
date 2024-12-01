import cloudinary from 'cloudinary';
import Post from "../models/postModel.js";
import User from "../models/userModel.js";
import Community from "../models/community.js"; 
import mongoose from "mongoose";


export const createCommunity = async (req, res) => {
    try {
      const { name, description, picture, tags } = req.body;
      const community = new Community({
        name,
        description,
        picture,
        tags,
        members: [{ userId: req.user.id, role: "communityAdmin" }],
      });
      await community.save();
      res.status(201).json({ message: "Community created successfully", community });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  };





  
  export const addPostToCommunity = async (req, res) => {
    try {
      const { communityId, image, title, description, content, categories } = req.body;

      console.log(req.body)
  
      // Validate required fields
      if (!title || !description || !content || !categories) {
        console.log({ error: 'All fields are required' })
        return res.status(400).json({ error: 'All fields are required' });
      }
  
      const user = await User.findById(req.user._id);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      const community = await Community.findById(communityId);
      if (!community) {
        return res.status(404).json({ message: 'Community not found' });
      }
  
      // Handle image upload
      let imageUrl = '';
      if (image) {
        try {
          const uploadResponse = await cloudinary.uploader.upload(image, {
            resource_type: 'auto',
          });
          imageUrl = uploadResponse.secure_url;
        } catch (error) {
          console.error('Image upload failed:', error);
          return res.status(500).json({ error: 'Image upload failed' });
        }
      }
  
      // Create new article (post)
      const article = new Post({
        postedBy: user.username || `${user.firstName} ${user.lastName}`,
        image: imageUrl,
        title,
        description,
        content,
        categories,
      });
  
      await article.save();
  
      // Update community with new post
      community.posts.push(article._id);
      community.latestActivity = new Date();
      await community.save();
  
      // Notify followers
      const notificationPromises = user.following.map(async (followerUsername) => {
        try {
          const follower = await User.findOne({ username: followerUsername });
          if (follower) {
            follower.notifications.push({
              message: `New article posted by ${user.username || `${user.firstName} ${user.lastName}`} in ${community.name}: ${title}`,
              articleId: article._id,
            });
            await follower.save();
          }
        } catch (error) {
          console.error(`Error notifying follower ${followerUsername}:`, error);
        }
      });
  
      await Promise.all(notificationPromises);
  
      res.status(201).json({
        message: 'Article created successfully',
        article,
      });
  
    } catch (error) {
      console.error('Internal server error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  };

  export const getAllCommunity = async (req, res) => {
    try {
        const allCommunity = await Community.find(); 
        if (!allCommunity || allCommunity.length === 0) {
            return res.status(404).json({ message: 'Community does not exist' });
        }
        res.status(200).json({ message: 'Community found successfully', allArticles });
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
        console.error(error);
    }
};

export const getCommunityById = async (req, res) => {
    try {
        const { _id } = req.params;  

        console.log(_id);


        const community = await Community.findById(_id);


        if (!community) {
            return res.status(404).json({ message: 'Community not found' });
        }

        res.status(200).json({ message: 'Community fetched successfully', community });
    } catch (error) {

        console.error('Error fetching community:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};



export const joinCommunity = async (req, res) => {
  try {
    const { communityId } = req.params; // Extract communityId
    const userId = req.user._id; // Extract userId from request

    // Validate user existence
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Validate community existence
    const community = await Community.findById(communityId);
    if (!community) {
      return res.status(404).json({ message: "Community not found" });
    }

    // Check if the user is already a member
    const isMember = community.members.some(
      (member) => member.userId.toString() === userId.toString()
    );
    if (isMember) {
      return res.status(400).json({ message: "You are already a member" });
    }

    // Add user as a member with default role
    community.members.push({
      userId,
      role: "member",
    });

    await community.save();

    res.status(200).json({
      message: "Successfully joined the community",
      members: community.members,
    });
  } catch (error) {
    console.error("Error joining community:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};



export const getAllPostsInCommunity = async (req, res) => {
  try {
    const communityId = req.params._id;

    const community = await Community.findById(communityId).populate("posts");

    if (!community) {
      console.log({ message: "Community not found" });
      return res.status(404).json({ message: "Community not found" });
    }

    console.log(community.posts);
    console.log({ posts: community.posts });

    const postIds = community.posts.map(post => post._id);

    const posts = await Post.find({ _id: { $in: postIds } });

    console.log(posts);

    res.status(200).json({ bookmarks: community.posts, posts });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};





  
  
  
import mongoose from "mongoose";
import User from "../models/userModel.js";
import Post from "../models/postModel.js";
import {v2 as cloudinary} from 'cloudinary'



export const getUserById = async (req, res) => {
    try {
        const userId = req.user._id; 
        const user = await User.findById(userId).select('-password');

        if (!user) {
            return res.status(404).json({ message: `No user with ID ${userId} found` });
        }

        res.status(200).json({ message: 'User found successfully', user });
    } catch (error) {
        console.error('Error while getting user:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};


export const getAuthor = async (req, res) => {
    try {
        const { username } = req.params; 
        const user = await User.findOne({ username: username }).select('-password');

        if (!user) {
            return res.status(404).json({ message: `No user with ID ${userId} found` });
        }

        res.status(200).json({ message: 'User found successfully', user });
    } catch (error) {
        console.error('Error while getting user:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const getUser = async (req, res) => {
    try {
        const userId = req.params._id; 
        const user = await User.findById(userId).select('-password');

        if (!user) {
            return res.status(404).json({ message: `No user with ID ${userId} found` });
        }

        res.status(200).json({ message: 'User found successfully', user });
    } catch (error) {
        console.error('Error while getting user:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};


export const myArticles = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        const author = `${user.username}`
        console.log(author)


        const posts = await Post.find({ postedBy: author }).sort({ createdAt: -1 });

        console.log(posts)

        // if (posts.length === 0) {
        //     return res.status(404).json({ message: 'No posts found for this user' });
        // }

        res.status(200).json({ message: 'Posts fetched successfully', posts });
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
        console.error('Error fetching posts:', error);
    }
};


export const bookmarkArticle = async (req, res) => {
    try {
      const { articleId } = req.params;
      console.log(articleId)
      const userId = req.user._id;
  
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      console.log(user)
  
      if (user.bookMarks.includes(articleId)) {
        console.log({ message: 'Article already bookmarked' })
        return res.status(400).json({ message: 'Article already bookmarked' });
        
      }

      user.bookMarks.push(articleId);
      await user.save();
  
      res.status(200).json({ message: 'Article bookmarked successfully', bookmarks: user.bookMarks });
    } catch (error) {
      console.error('Error bookmarking article:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
};

export const addToLibrary = async (req, res) => {
    try {
      const { articleId } = req.params;
      const userId = req.user._id;
  

      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      if (user.library.includes(articleId)) {
        return res.status(400).json({ message: 'Article already in library' });
      }

      user.library.push(articleId);
      await user.save();
  
      res.status(200).json({ message: 'Article added to library successfully', library: user.library });
    } catch (error) {
      console.error('Error adding article to library:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
};

export const getBookmarks = async (req, res) => {
    try {
        const userId = req.user._id; 
        const user = await User.findById(userId).populate('bookMarks');

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        console.log({ bookmarks: user.bookMarks });

        // Extracting bookmarked IDs from the populated bookMarks
        const bookmarkedIds = user.bookMarks.map(bookmark => bookmark._id);

        // Find articles that are bookmarked
        const articles = await Post.find({ _id: { $in: bookmarkedIds } });

        console.log(articles)

        res.status(200).json({ bookmarks: user.bookMarks, articles });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};


export const getLibrary = async (req, res) => {
    try {
        const userId = req.user._id; 
        const user = await User.findById(userId).populate('library');

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }


        // if (!user.library || user.library.length === 0) {
        //     return res.status(404).json({ message: 'Library is empty' });
        // }

        // Extracting library IDs
        const libraryIds = user.library.map(item => item._id);

        // Find articles based on library IDs
        const articles = await Post.find({ _id: { $in: libraryIds } });


        // const articles = await Post.find({ _id: { $in: libraryIds } }).select('title content'); // Example projection

        res.status(200).json({ library: user.library, articles });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

  
  
export const followAndUnfollow = async (req, res) => {
    try {
        const id = req.params.id;
        const userToModify = await User.findById(id);
        const currentUser = await User.findById(req.user._id);

        if (!userToModify || !currentUser) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (id === req.user._id.toString()) {
            console.log({ message: "You cannot follow/unfollow yourself" });
            return res.status(400).json({ message: "You cannot follow/unfollow yourself" });
        }

        const isFollowing = currentUser.following.includes(id);

        if (isFollowing) {
            await User.findByIdAndUpdate(id, { $pull: { followers: req.user._id } });
            await User.findByIdAndUpdate(req.user._id, { $pull: { following: id } });
            return res.status(200).json({ message: "You have successfully unfollowed this user" });
        } else {
            await User.findByIdAndUpdate(id, { $push: { followers: req.user._id } });
            await User.findByIdAndUpdate(req.user._id, { $push: { following: id } });
            return res.status(200).json({ message: "You have successfully followed this user" });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Server error', error: error.message });
    }
};






export const getFollowingArticles = async (req, res) => {
    try {
        const userId = req.user._id;

        const user = await User.findById(userId).populate('following');

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const followingUserIds = user.following.map(followedUser => followedUser.username);

        const posts = await Post.find({ postedBy: { $in: followingUserIds } })
                                .sort({ createdAt: -1 });

        if (posts.length === 0) {
            return res.status(404).json({ message: 'No articles found from users you follow' });
        }

        res.status(200).json({ message: 'Articles fetched successfully', posts });
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
        console.error('Error fetching following articles:', error);
    }
};




export const getNotifications = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const notifications = user.notifications.sort((a, b) => b.createdAt - a.createdAt) || [];

        console.log({ message: 'Notifications fetched successfully', notifications });
        res.status(200).json({ message: 'Notifications fetched successfully', notifications });
    } catch (error) {
        console.error('Error fetching notifications:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

export const getUnreadNotificationCount = async (req, res) => {
    const userId = req.user._id; // Corrected variable name to userId

    try {
        const user = await User.aggregate([
            { $match: { _id: (userId) } },
            { $unwind: "$notifications" },
            { $match: { "notifications.read": false } },
            { $count: "unreadCount" }
        ]);

        const unreadCount = user.length > 0 ? user[0].unreadCount : 0;
        console.log({ unreadCount });
        return res.status(200).json({ unreadCount });
    } catch (error) {
        console.error("Error fetching unread notification count:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};

export const markNotificationAsRead = async (req, res) => {
    try {
        const userId = req.user._id;
        const { notificationId } = req.params;

        console.log(notificationId)

        if (!notificationId) {
            return res.status(400).json({ message: 'Notification ID is required' });
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const updateResult = await User.updateOne(
            { _id: userId, 'notifications._id': notificationId },
            { $set: { 'notifications.$.read': true } }
        );

        if (updateResult.nModified === 0) {
            return res.status(404).json({ message: 'Notification not found' });
        }

        res.status(200).json({ message: 'Notification marked as read successfully' });
    } catch (error) {
        console.error('Error marking notification as read:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};


export const markAllNotificationsAsRead = async (req, res) => {
    try {
        const userId = req.user._id;

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        await User.updateOne(
            { _id: userId },
            { $set: { 'notifications.$[elem].read': true } },
            { arrayFilters: [{ 'elem.read': false }] } 
        );

        res.status(200).json({ message: 'All notifications marked as read successfully' });
    } catch (error) {
        console.error('Error marking all notifications as read:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};


export const deleteNotification = async (req, res) => {
    try {
        const userId = req.user._id; 
        const notificationId = req.params.id; 

        const updateResult = await User.updateOne(
            { _id: userId },
            { $pull: { notifications: { _id: notificationId } } }
        );

        if (updateResult.modifiedCount === 0) {
            return res.status(404).json({ message: 'Notification not found' });
        }

        console.log({ message: 'Notification deleted successfully', updateResult });

        res.status(200).json({ message: 'Notification deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}; 






export const updateProfilePic = async (req, res) => {
    try {
      const userId = req.user._id;
      const user = await User.findById(userId);
      console.log(user)
      const {profilePic} = req.body
  
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      const oldProfilePicId = user.profilePic && user.profilePic.split('/').pop().split('.')[0];
      
      let newProfilePicUrl = ""
      
      if (profilePic) {
        const uploadResponse = await cloudinary.uploader.upload(profilePic, {
            resource_type: 'auto',
        });
        newProfilePicUrl = uploadResponse.secure_url;
        console.log('Image uploaded successfully:', newProfilePicUrl);
     
  
        if (oldProfilePicId) {
          await cloudinary.uploader.destroy(oldProfilePicId);
        }
  
        user.profilePic = newProfilePicUrl;
        await user.save();
  
        res.status(200).json({ message: 'Profile picture updated successfully', user });
      } else {
        res.status(400).json({ message: 'No file uploaded' });
      }
    } catch (error) {
      res.status(500).json({ message: 'Internal server error' });
      console.error('INTERNAL SERVER ERROR', error.message);
    }
};


export const reportUser = async (req, res) => {
    try {
        const reporterId = req.user._id;
        const reportedUserId = req.params._id
        const {  reason } = req.body;

        const reportedUser = await User.findById(reportedUserId);
        if (!reportedUser) {
            return res.status(404).json({ message: "Reported user not found" });
        }

        const newReport = new Report({
            reporter: reporterId,
            reportedUser: reportedUserId,
            reason
        });

        await newReport.save();
        res.status(200).json({ message: 'User reported successfully', report: newReport });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

  
  
  
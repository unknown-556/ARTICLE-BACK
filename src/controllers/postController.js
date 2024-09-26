import User from "../models/userModel.js";
import Post from "../models/postModel.js";
import dotenv from 'dotenv';
import { v2 as cloudinary } from "cloudinary";

dotenv.config();


export const addArticle = async (req, res) => {
    try {
        const { image, title, description, content, categories } = req.body;
        const user = await User.findById(req.user._id);

        console.log(req.body)

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (!title || !description || !content || !categories) {
            return res.status(400).json({ error: 'All fields are required' });
        }

        let imageUrl = "";

        if (image) {
            try {
                const uploadResponse = await cloudinary.uploader.upload(image, {
                    resource_type: 'auto',
                });
                imageUrl = uploadResponse.secure_url;
                console.log('Image uploaded successfully:', imageUrl);
            } catch (uploadError) {
                console.error('Image upload failed:', uploadError);
                return res.status(500).json({ error: 'Image upload failed' });
            }
        }

        const article = new Post({
            postedBy: user.username || `${user.firstName} ${user.lastName}`,
            image: imageUrl,
            title,
            description,
            content,
            categories
        });

        await article.save();

        const notifications = user.following.map(async (followerUsername) => {
            try {
                const follower = await User.findOne({ username: followerUsername });
                if (follower) {
                    const notification = {
                        message: `New article posted by ${user.username || `${user.firstName} ${user.lastName}`}: ${title}`,
                        articleId: article._id,
                    };
                    follower.notifications.push(notification);
                    await follower.save();
                }
            } catch (error) {
                console.error(`Error notifying follower ${followerUsername}:`, error);
            }
        });

        await Promise.all(notifications);

        res.status(201).json({ message: 'Article created successfully', article });
        console.log('Article created successfully', article);

    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
        console.error('Internal server error:', error);
    }
};


export const addComment = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const { text, image } = req.body; 
        let imageUrl = "";

        if (image) {
            const uploadResponse = await cloudinary.uploader.upload(image, {
                resource_type: 'auto',
            });
            imageUrl = uploadResponse.secure_url;
            console.log('Image uploaded successfully:', imageUrl);
        }

        const comment = {
            image: imageUrl,
            text, 
            postedBy: user.username || `${user.firstName} ${user.lastName}`,
            createdAt: new Date()
        };

        const { articleId } = req.params;

        const article = await Post.findByIdAndUpdate(
            articleId,
            { $push: { comments: comment } },  
            { new: true } 
        );

        if (!article) {
            return res.status(404).json({ message: 'Article not found' });
        }

        const author = await User.findById(article.postedBy);
        if (author) {
            const notification = {
                message: `${user.username || `${user.firstName} ${user.lastName}`} commented on your article: ${article.title}`,
                createdAt: new Date()
            };
            author.notifications.push(notification);
            await author.save();
        }    

        res.status(201).json({ message: 'Comment added successfully', article });
    } catch (error) {
        console.error('Error adding comment:', error);
        res.status(500).send({ error: 'Internal server error' });
    }
};



export const getAllPosts = async (req, res) => {
    try {
        const allArticles = await User.find().sort({ createdAt: -1 }); 
        if (!allArticles || allArticles.length === 0) {
            return res.status(404).json({ message: 'No posts in database' });
        }
        res.status(200).json({ message: 'Articles found successfully', allArticles });
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
        console.error(error);
    }
};

export const getPostsByCategory = async (req, res) => {
    try {
        const { category } = req.params;

        if (!category) {
            return res.status(400).json({ error: 'Category is required' });
        }

        const posts = await Post.find({ category }).sort({ createdAt: -1 });

        if (posts.length === 0) {
            return res.status(404).json({ message: 'No posts found for this category' });
        }

        res.status(200).json({ message: `Articles found for category: ${category}`, posts });
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
        console.error('Error fetching posts by category:', error);
    }
};

export const getPostsByUsername = async (req, res) => {
    try {
        const user = await User.findById(req.params._id);
        const author = `${user.firstName} ${user.lastName}`
        console.log(author)


        const posts = await Post.find({ postedBy: author }).sort({ createdAt: -1 });

        if (posts.length === 0) {
            return res.status(404).json({ message: 'No posts found for this user' });
        }

        res.status(200).json({ message: 'Posts fetched successfully', posts });
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
        console.error('Error fetching posts:', error);
    }
};

export const getRelated = async (req, res) => {
    try {
        // Extract categories from the request parameters
        const { categories } = req.params;

        // Check if categories are provided and are not empty
        if (!categories || !categories.trim()) {
            return res.status(400).json({ error: 'Categories are required' });
        }

        // Convert categories from a comma-separated string to an array, trimming spaces
        const categoryArray = categories.split(',').map(category => category.trim()).filter(Boolean);

        // Log the categories array for debugging purposes
        console.log('Categories Array:', categoryArray);

        // Validate that we have valid categories in the array
        if (categoryArray.length === 0) {
            return res.status(400).json({ error: 'Valid categories are required' });
        }

        // Query the database for posts matching the specified categories
        const posts = await Post.aggregate([
            { $match: { categories: { $in: categories } } }, // Find posts with any matching category
            { $sample: { size: 5 } } // Randomly select 5 posts
        ]);

        // Log the retrieved posts for debugging
        console.log('Retrieved Posts:', posts);

        // Check if any posts were found
        if (posts.length === 0) {
            return res.status(404).json({ message: 'No posts found for these categories' });
        }

        // Send a success response with the found posts
        res.status(200).json({ 
            message: `Random articles found for categories: ${categoryArray.join(', ')}`, 
            posts 
        });
    } catch (error) {
        // Handle errors and send a server error response
        res.status(500).json({ error: 'Internal server error' });
        console.error('Error fetching random posts by categories:', error);
    }
};





export const getArticleById = async (req, res) => {
    try {
        const { _id } = req.params;  

        console.log(_id);


        const article = await Post.findByIdAndUpdate(
            _id, 
            { $inc: { viewCount: 1 } },  
            { new: true }  
        );


        if (!article) {
            return res.status(404).json({ message: 'Article not found' });
        }

        res.status(200).json({ message: 'Article fetched successfully', article });
    } catch (error) {

        console.error('Error fetching article:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};




import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema({
    message: {
        type: String,
        required: true
    },
    articleId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Post',
        required: false
    },
    read: {
        type: Boolean,
        default: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});


const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
    },
    lastName: {
        type: String,
        required: true,
    },
    username: {
        type: String,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    profilePic: {
        type: String,
    },
    bio: {
        type: String,
    },
    bookMarks: [
        {
            type: mongoose.Schema.Types.ObjectId,
              
        }
    ],
    library: [
        {
            type: mongoose.Schema.Types.ObjectId,
            
        }
    ],
    following: {
        type: [String],
        default: []
    },
    followers: {
        type: [String],
        default: []
    },
    notifications: [notificationSchema],
    resetPasswordToken: {
        type: String,
    },
    resetPasswordExpires: {
        type: Date,
    },
    isFrozen: {
        type: Boolean,
        default: false,
    },
}, {
    timestamps: true, 
});

const User = mongoose.model('User', userSchema);
export default User;

import Admin from "../models/admin.js";
import Report from "../models/reportModel.js";
import User from "../models/userModel.js";
import transporter from "../config/email.js";

export const adminSignIn = async (req, res) => {
    const { email, password } = req.body;
  
    try {
      const admin = await Admin.findOne({ email });
      if (!admin) {
        return res.status(404).json({ message: 'Admin not found' });
      }
  
      const hashedPassword = hashValue(password);
      if (hashedPassword !== admin.password) {
        return res.status(401).json({ message: 'Incorrect password' });
      }
  
      res.status(200).json({ message: 'Admin login successful' });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
};

export const getAllUsers = async (req, res) => {
    try {
        const allUsers = await User.find()
        if (!allUsers) {
        res.status(400).json({message: 'No users found in database'})
    }   else {
        res.status(200).json({message: 'Users found successfully', allUsers})
    }
    }   catch (error) {
        console.error('Error while getting all users:',error);
        res.status(500).json({message: error.messaage})
    }
}


export const getUser = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        console.log(`User ID: ${user._id}, User Data: ${JSON.stringify(user)}`);
        return res.json({ user });
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
        console.error('Internal server error:', error);
    }
};


export const getReport = async (req, res) => {
    try {
        const { username } = req.body;
        const report = await Report.findOne({ username }).populate('reporter reportedUser', 'username email');
        if (!report) {
            return res.status(404).json({ message: "Report not found" });
        }
        res.status(200).json(report);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getAllReports = async (req, res) => {
    try {
        const reports = await Report.find().populate('reporter reportedUser', 'username email');
        res.status(200).json(reports);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const freezeAccount = async (req, res) => {
    try {
        const userId = req.params.id;
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        user.isFrozen = true;
        await user.save();

        const notification = {
            message: `Your account has been frozen. If this was a mistake, please contact support.`,
            createdAt: new Date()
        };
        user.notifications.push(notification);
        await user.save();

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: user.email, 
            subject: 'Your account has been frozen.',
            text: `Your account has been frozen. If this was a mistake, please contact support.`
        };
    
        await transporter.sendMail(mailOptions);
        res.status(200).json({ message: 'Account frozen successfully', user });
    } catch (error) {
        console.error('Error while freezing account:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const unfreezeAccount = async (req, res) => {
    try {
        const userId = req.params.id;
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        user.isFrozen = false;
        await user.save();

        const notification = {
            message: `Your account has been unfrozen. You can now access your account.`,
            createdAt: new Date()
        };
        user.notifications.push(notification);
        await user.save();

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: user.email, 
            subject: 'Your account has been unfrozen.',
            text: `Your account has been unfrozen. You can now access your account.`
        };
    
        await transporter.sendMail(mailOptions);
        res.status(200).json({ message: 'Account unfrozen successfully', user });
    } catch (error) {
        console.error('Error while unfreezing account:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const deleteReport = async (req, res) => {
    try {
        const reportId = req.params.id;
        const report = await Report.findById(reportId);
        if (!report) {
            return res.status(404).json({ message: "Report not found" });
        }
        await report.remove();
        res.status(200).json({ message: 'Report deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

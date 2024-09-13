import mongoose from 'mongoose';

const reportSchema = new mongoose.Schema({
    reporter: { type: String, ref: 'User', required: true },
    reportedUser: { type: String, ref: 'User', required: true },
    reason: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
});

const Report = mongoose.model('Report', reportSchema);
export default Report;
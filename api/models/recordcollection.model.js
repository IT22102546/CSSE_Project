import mongoose from 'mongoose';

const CollectionReportSchema = new mongoose.Schema({
  binId: {
    type: String,
    required: true,
  },
  foodBin: {
    type: Number,
    required: true,
    min: 0,
  },
  plasticBin: {
    type: Number,
    required: true,
    min: 0,
  },
  paperBin: {
    type: Number,
    required: true,
    min: 0,
  },
  userName: {
    type: String,
    required: true,
  },
  userEmail: {
    type: String,
    required: true,
  },
  recordedAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model('CollectionReport', CollectionReportSchema);

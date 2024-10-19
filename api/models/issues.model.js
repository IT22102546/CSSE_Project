import mongoose from 'mongoose';

const IssueSchema = new mongoose.Schema({
    userId:{
        type:String
    },
  collectorId: {
    type: String,
    ref: 'Collector',
    required: true,
  },
  binId: {
    type: String,
    ref: 'Bin',
    required: true,
  },
  issueType: {
    type: String,
    enum: ['Damage', 'Overfilled', 'Access Issue', 'Other'],
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  reportedAt: {
    type: Date,
    default: Date.now,
  },
  status: {
    type: String,
    enum: ['Pending', 'Resolved'],
    default: 'Pending',
  },
  solution:{
    type:String
  }
});

export default mongoose.model('Issue', IssueSchema);

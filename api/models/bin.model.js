// models/Bin.js
import mongoose from 'mongoose';

const binSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    unique: true, // Ensure one user has one bin
  },
  userName: {
    type: String,
    required: true,
  },
  userEmail: {
    type: String,
    required: true,
  },
  longitude: {
    type: Number,
    required: true,
  },
  latitude: {
    type: Number,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  binLevels: {
    foodBin: {
      type: Number,
      default: 0,
    },
    plasticBin: {
      type: Number,
      default: 0,
    },
    paperBin: {
      type: Number,
      default: 0,
    },
  },
  overallPercentage: {
    type: Number,
    default: 0,
  },

  isRequested:{
    type:Boolean,
    default:false
  },

});

export default mongoose.model('Bin', binSchema);

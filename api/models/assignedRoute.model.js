import mongoose from 'mongoose';

const AssignRouteSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    ref: 'User',
  },
  userName: {
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
  driverId: {
    type: String,
    ref: 'Driver',
    required: true,
  },
  truckId: {
    type: String,
    ref: 'Truck',
    required: true,
  },
  status: {
    type: String,
    enum: ['Pending', 'In Progress', 'Completed'],
    default: 'Pending',
  },
  assignedAt: {
    type: Date,
    default: Date.now,
  },
  completedAt: {
    type: Date,
  },
});

export default mongoose.model('AssignRoute', AssignRouteSchema);

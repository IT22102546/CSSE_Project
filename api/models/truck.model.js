import mongoose from "mongoose";

const collectionTruckSchema = new mongoose.Schema({
    truckId: {
        type: String,
        required: true,
        unique: true // Each truck should have a unique ID
    },
    driver: {
        type: String,

        required: true
    },
    capacity: {
        type: Number,
        required: true,
        min: 0 // Ensures capacity cannot be negative
    },
    location: {
        type: {
            lat: { type: Number, required: true, default: 0 },
            lng: { type: Number, required: true, default: 0 }
        },
        
    },
    route: {
        type: [String], // Array to store route points or waypoints (can be strings representing locations or GPS coordinates)
        default : "Not assigned yet"
    },
    status:{
        type: Boolean,
        default : false,
    }
}, { timestamps: true });

const CollectionTruck = mongoose.model('CollectionTruck', collectionTruckSchema);
export default CollectionTruck;

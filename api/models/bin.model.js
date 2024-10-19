import mongoose from 'mongoose';

const binSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true,
        unique: true // One user can have only one bin
    },
    userName: {
        type: String,
        required: true
    },
    userEmail: {
        type: String,
        required: true
    },
    longitude: {
        type: Number,
     
    },
    latitude: {
        type: Number,
       
    },
    address: {
        type: String,
       
    },
    binLevels: {
        foodBin: {
            type: Number,
            default: 0
        },
        plasticBin: {
            type: Number,
            default: 0
        },
        paperBin: {
            type: Number,
            default: 0
        }
    },
    overallPercentage: {
        type: Number,
        default: 0
    },
    isRequested: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });

export default mongoose.model('Bin', binSchema);

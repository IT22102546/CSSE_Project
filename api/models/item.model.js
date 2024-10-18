import mongoose from "mongoose";

const itemSchema = new mongoose.Schema({
    petId: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    userId: {
        type: String,
        required: true,
        trim: true
    },
    type: {
        type: String,
        required: true,
        trim: true
    },
    freequency: {
        type: String,
        required: true,
        trim: true
    },
    disposal_method: {
        type: String,
        required: true,
        trim: true
    },
    quentity: {
        type: String,
        required: true,
        trim: true
    },
   
    area: {
        type: String,
        required: true,
        trim: true
    },
    

    profilePicture: {
        type: String,
        default: 'https://media.istockphoto.com/id/1294866141/vector/picture-reload.jpg?s=612x612&w=is&k=20&c=Ei6q4n6VkP3B0R30d1VdZ4i11CFbyaEoAFy6_WEbArE=',
    },
  
}, { timestamps: true });

const Item = mongoose.model("Admin_Details", itemSchema);

export default Item;

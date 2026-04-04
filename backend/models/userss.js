import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { 
    type: String, 
    enum: ['citizen', 'authority', 'admin'], 
    default: 'citizen' 
  },
  // This allows users to "Follow" specific pollution hotspots
  subscribedZones: [{ 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Zone' 
  }]
}, { timestamps: true });

export default mongoose.model("User", userSchema);
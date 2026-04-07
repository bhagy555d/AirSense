import mongoose from 'mongoose';

const zoneSchema = new mongoose.Schema({
  name: { type: String, required: true },
  city: { type: String, required: true },
  location: {
    type: { type: String, default: 'Point' },
    coordinates: { type: [Number], required: true } // [longitude, latitude]
  },
  aqiValue: { type: Number, default: 0 },   
  active: { type: Boolean, default: true }
}, { timestamps: true });

// Check if the model already exists to prevent recompilation errors during development with hot-reloading
const Zone = mongoose.models.Zone || mongoose.model('Zone', zoneSchema);

export default Zone;
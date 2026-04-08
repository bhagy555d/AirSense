import mongoose from "mongoose";

const readingSchema = new mongoose.Schema({
  zoneId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Zone', 
    required: true 
  },
  pm25: { type: Number },
  pm10: { type: Number },
  no2: { type: Number },
  co: { type: Number },
  so2: { type: Number },
  aqi: { type: Number, required: true },
  dominantPollutant: { type: String },
  timestamp: { type: Date, default: Date.now }
});

//  THE PERFORMANCE TRICK: Compound Index
// This makes fetching "last 24 hours of data for Zone X" super fast.
readingSchema.index({ zoneId: 1, timestamp: -1 });

export default mongoose.model("Reading", readingSchema);
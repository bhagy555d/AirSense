import mongoose from "mongoose";

const zoneSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  city: { type: String, required: true },
  // GeoJSON Point for mapping
  location: {
    type: { type: String, default: 'Point' },
    coordinates: { type: [Number], required: true } // [Longitude, Latitude]
  },
  stationId: { type: String }, // To link with CPCB API IDs
  active: { type: Boolean, default: true }
}, { timestamps: true });

// This helps in searching zones by location
zoneSchema.index({ location: "2dsphere" });

export default mongoose.model("Zone", zoneSchema);
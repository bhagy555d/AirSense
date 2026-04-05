import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';

// Import your Models (Ensure these filenames match your folders!)
import Zone from "./models/Zone.js"; 
import Reading from "./models/Reading.js"; 

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Database Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log(" MongoDB Connected"))
  .catch(err => console.error(" MongoDB Error: ", err));

// --- API ROUTES ---

app.get("/add-custom-zone", async (req, res) => {
  const { name, lat, lng } = req.query;
  try {
    const zone = new Zone({
      name: name || "New Station",
      city: "Nagpur",
      location: { type: 'Point', coordinates: [parseFloat(lng), parseFloat(lat)] }
    });
    await zone.save();
    res.send(`Added ${name} at ${lat}, ${lng}`);
  } catch (error) {
    res.status(500).send(error.message);
  }
});
// 1. Route to get all Zones (This is what the Map needs!)
app.get("/api/zones", async (req, res) => {
  try {
    const zones = await Zone.find();
    res.json(zones);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// 2. Start the Server (The "Listening" part)
const PORT = 5000;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`AirSense API is live at http://localhost:${PORT}`);
    console.log(` Map data available at http://localhost:${PORT}/api/zones`);
});
app.get("/sync-india", async (req, res) => {
  const indiaStations = [
    { name: "Anand Vihar, Delhi", city: "Delhi", lat: 28.6476, lng: 77.3158 },
    { name: "Bandra, Mumbai", city: "Mumbai", lat: 19.0522, lng: 72.8258 },
    { name: "City Railway Station, Bangalore", city: "Bangalore", lat: 12.9733, lng: 77.5670 },
    { name: "Manali, Chennai", city: "Chennai", lat: 13.1667, lng: 80.2667 },
    { name: "Victoria, Kolkata", city: "Kolkata", lat: 22.5448, lng: 88.3426 },
    { name: "Sector 25, Chandigarh", city: "Chandigarh", lat: 30.7500, lng: 76.7667 },
    { name: "Bapu Nagar, Jaipur", city: "Jaipur", lat: 26.8900, lng: 75.8100 },
    { name: "Gomti Nagar, Lucknow", city: "Lucknow", lat: 26.8467, lng: 80.9467 }
  ];

  try {
    const ops = indiaStations.map(st => ({
      updateOne: {
        filter: { name: st.name },
        update: {
          name: st.name,
          city: st.city,
          location: { type: 'Point', coordinates: [st.lng, st.lat] },
          active: true
        },
        upsert: true
      }
    }));

    await Zone.bulkWrite(ops);
    res.send("National Data Seeded! Refresh your map and zoom out.");
  } catch (error) {
    res.status(500).send("Database error: " + error.message);
  }
});
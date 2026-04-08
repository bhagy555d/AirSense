import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import axios from 'axios'; // CRITICAL: Added this import

// Import your Models
import Zone from './models/Zone.js';

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Database Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log(" MongoDB Connected"))
  .catch(err => console.error("MongoDB Error: ", err));

// --- API ROUTES ---

// 1. Route to get all Zones for the Map
app.get("/api/zones", async (req, res) => {
  try {
    const zones = await Zone.find();
    res.json(zones);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// 2. Route to Fetch LIVE Data from WAQI (CPCB Source)
app.get("/sync-india", async (req, res) => {
  const TOKEN = "980b9f8a35129bda30f4a9d0c7a7b3f618ea9665";
  const cities = ["Delhi", "Mumbai", "Bangalore", "Chennai", "Kolkata", "Chandigarh", "Jaipur", "Lucknow", "Nagpur", "Pune", "Hyderabad", "Ahmedabad", "Surat", "Patna", "Kochi", "Indore", "Bhopal", "Visakhapatnam"];

  try {
    await Zone.deleteMany({}); // Start fresh

    const ops = [];
    for (const city of cities) {
      try {
        const response = await axios.get(`https://api.waqi.info/feed/${city}/?token=${TOKEN}`);
        const data = response.data.data;

        if (response.data.status === "ok" && data.city) {
          ops.push({
            name: data.city.name,
            city: city, // Use our search term as the city name
            location: {
              type: 'Point',
              coordinates: [data.city.geo[1], data.city.geo[0]]
            },
            aqiValue: data.aqi,
            active: true
          });
          console.log(`Synced: ${city}`);
        } else {
          console.log(`Skipped: ${city} (No data available)`);
        }
      } catch (err) {
        console.log(`Error fetching ${city}: ${err.message}`);
      }
    }

    if (ops.length > 0) await Zone.insertMany(ops);
    res.send(`<h1>Sync Done!</h1><p>Successfully added ${ops.length} cities.</p>`);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// Start the Server
const PORT = 5000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`AirSense API is live at http://localhost:${PORT}`);
  console.log(`Map data available at http://localhost:${PORT}/api/zones`);
});
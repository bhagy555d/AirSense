import axios from 'axios';
import dotenv from 'dotenv';
import mongoose from 'mongoose';

// 1. CRITICAL: Make sure these paths match your folder structure!
import Reading from './models/Reading.js';
import Zone from './models/Zone.js'; 

dotenv.config();

const fetchAQI = async () => {
  const url = `https://api.data.gov.in/resource/${process.env.AQI_RESOURCE_ID}?api-key=${process.env.CPCB_API_KEY}&format=json&limit=2000`;

  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB... ");

    const response = await axios.get(url);
    let allRecords = response.data.records || [];

    if (allRecords.length === 0) {
      console.log(" Govt API empty. Using MOCK DATA...");
      allRecords = [
        { city: "Nagpur", station: "Civil Lines, Nagpur", avg_value: "58" },
        { city: "Nagpur", station: "GPO, Nagpur", avg_value: "72" }
      ];
    }

    const nagpur = allRecords.filter(r => r.city && r.city.toLowerCase().includes("nagpur"));

    for (const s of nagpur) {
      console.log(`🔍 Processing: ${s.station}...`);

      // 2. This finds the Zone or Creates it if missing
      let zone = await Zone.findOne({ name: s.station });
      
      if (!zone) {
        console.log(`Creating new Zone record for ${s.station}...`);
        zone = await Zone.create({
          name: s.station,
          city: "Nagpur",
          location: { type: "Point", coordinates: [79.0882, 21.1458] } 
        });
      }

      // 3. Now we link the Reading to that Zone's ID
      await Reading.create({
        zoneId: zone._id, 
        aqi: parseInt(s.avg_value) || 0,
        timestamp: new Date()
      });
      console.log(`Saved Reading for ${s.station}`);
    }

    console.log("--- Sync Complete! ---");
  } catch (error) {
    console.error("Fetch Failed :", error.message);
  } finally {
    mongoose.connection.close();
    console.log("Database connection closed. ");
  }
};

fetchAQI();
import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";

// CHECK THESE FILENAMES IN YOUR FOLDER! 
// If your file is 'Reading.js', use 'Reading.js' here.
import Zone from "./models/Zone.js"; 
import Reading from "./models/Reading.js"; // Added the 's'
import User from "./models/userss.js";      // Matched the weird spelling

dotenv.config();

const app = express(); // Initialize app BEFORE using it

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected ✅"))
  .catch(err => console.error("MongoDB Error ❌", err));

app.get("/add-zone", async (req, res) => {
  try {
    const zone = new Zone({
      name: "Nagpur Central",
      city: "Nagpur",
      location: { type: 'Point', coordinates: [79.0882, 21.1458] }
    });
    await zone.save();
    res.send("Zone added ✅");
  } catch (error) {
    res.status(500).send(error.message);
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
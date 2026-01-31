const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log(err));

// Schema
const RequirementSchema = new mongoose.Schema({
  eventName: String,
  eventType: String,
  date: Date,
  location: String,
  venue: String,
  hiringType: { type: String, enum: ['Planner', 'Performer', 'Crew'] },
  specificDetails: mongoose.Schema.Types.Mixed // Flexible object for different types
}, { timestamps: true });

const Requirement = mongoose.model('Requirement', RequirementSchema);

// API Route
app.post('/api/requirements', async (req, res) => {
  try {
    const newReq = new Requirement(req.body);
    await newReq.save();
    res.status(201).json({ message: "Requirement saved successfully!", data: newReq });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

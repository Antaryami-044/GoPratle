const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Use CORS to allow your Vercel frontend to talk to this backend
app.use(cors({
  origin: ["http://localhost:3000", "https://gopratle-backend-pyqn.onrender.com"],
  credentials: true
}));

app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.error('DB Error:', err));

const RequirementSchema = new mongoose.Schema({
  eventName: String,
  date: Date,
  location: String,
  category: String,
  categoryDetails: Object
}, { timestamps: true });

const Requirement = mongoose.model('Requirement', RequirementSchema);

app.post('/api/requirements', async (req, res) => {
  try {
    const newReq = new Requirement(req.body);
    await newReq.save();
    res.status(201).json({ success: true, data: newReq });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

// Render requires the app to listen on 0.0.0.0
const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => console.log(`erver on port ${PORT}`));
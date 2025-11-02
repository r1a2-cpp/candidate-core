import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import connectDB from './config/db.js';

dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(express.json());

// === Candidate Schema ===
const CandidateSchema = new mongoose.Schema({
  // Primary Information
  SL: { type: Number, required: true, unique: true },
  fullName: { type: String, required: true, trim: true },
  passportNumber: { type: String, required: true, unique: true, trim: true },
  agentName: { type: String, required: true, trim: true },

  // Progress Information
  medicalInfo: {
    status: { type: String, enum: ['PENDING', 'FIT', 'UNFIT', 'EXP'], default: 'PENDING' },
    date: { type: Date },
  },

  policeClearanceInfo: { type: Boolean, default: false },

  mofaInfo: {
    status: { type: String, enum: ['','PENDING', 'DONE', 'MEDUPDATE'], default: '' },
    date: { type: Date },
    rlNumber: { type: Number },
    applicationNumber: { type: Number },
  },

  fingerInfo: {
    status: { type: String, enum: ['','PENDING', 'DONE'], default: '' },
    date: { type: Date },
  },

  visaInfo: {
    visaNo: { type: Number },
    visaType: { type: String },
    issueDate: { type: Date },
    expiryDate: { type: Date },
    visaStatus: { type: String, enum: ['','PENDING', 'ISSUED', 'SOLD', 'EXPIRED'], default: '' },
  },

  manpowerInfo: {
    bmetTrainingStatus: { type: String, enum: ['','PENDING', 'COMPLETED'], default: '' },
    manpowerStatus: { type: String, enum: ['','PENDING', 'DONE'], default: '' },
  },

  flightInfo: {
    flightDate: { type: Date },
    flightStatus: { type: String, enum: ['','PENDING', 'DONE'], default: '' },
  },

  iqamaInfo: {
    iqamaNumber: { type: Number },
    issueDate: { type: Date },
    iqamaStatus: { type: String, enum: ['','PENDING', 'DONE'], default: '' },
  },

  // Documents
  passportCopy: { type: String, default: '' },
  visaCopy: { type: String, default: '' },

  // Status
  status: {
    type: String,
    enum: ['JUST RECEIVED', 'MEDICAL', 'VISA', 'MANPOWER', 'FLIGHT', 'IQAMAH', 'ON HOLD'],
    default: 'JUST RECEIVED',
  },
  receivedDate: { type: Date },

  overallStatus: {
    type: String,
    enum: ['IN-PROGRESS', 'DONE', 'BACK', 'CANCEL'],
    default: 'IN-PROGRESS',
  },
}, { timestamps: true });

// === Model ===
const Candidate = mongoose.model('Candidate', CandidateSchema);

// === Routes ===

// Create Candidate
app.post('/api/office-data', async (req, res) => {
  try {
    const candidate = new Candidate(req.body);
    await candidate.save();
    res.status(201).json(candidate);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get All Candidates
app.get('/api/office-data', async (req, res) => {
  try {
    const candidates = await Candidate.find();
    res.status(200).json(candidates);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Root Endpoint
app.get('/', (req, res) => {
  res.send('Candidate Core API is running 🚀');
});
//---------------------------------
app.post("/api/upload", async (req, res) => {
  try {
    const data = req.body;

    if (!Array.isArray(data)) {
      return res.status(400).json({ message: "Data must be an array of objects" });
    }

    await Candidate.insertMany(data, { ordered: false });
    res.status(200).json({ message: "Bulk upload successful", count: data.length });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
});
//---------------------------------

// === Server Start ===
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));

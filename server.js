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
    status: { type: String, enum: ['PENDING', 'DONE', 'MEDUPDATE'], default: 'PENDING' },
    date: { type: Date },
    rlNumber: { type: Number },
    applicationNumber: { type: Number },
  },

  fingerInfo: {
    status: { type: String, enum: ['PENDING', 'DONE'], default: 'PENDING' },
    date: { type: Date },
  },

  visaInfo: {
    visaNo: { type: Number },
    visaType: { type: String },
    issueDate: { type: Date },
    expiryDate: { type: Date },
    visaStatus: { type: String, enum: ['PENDING', 'ISSUED', 'SOLD', 'EXPIRED'], default: 'PENDING' },
  },

  manpowerInfo: {
    bmetTrainingStatus: { type: String, enum: ['PENDING', 'COMPLETED'], default: 'PENDING' },
    manpowerStatus: { type: String, enum: ['PENDING', 'DONE'], default: 'PENDING' },
  },

  flightInfo: {
    flightDate: { type: Date },
    flightStatus: { type: String, enum: ['PENDING', 'DONE'], default: 'PENDING' },
  },

  iqamaInfo: {
    iqamaNumber: { type: Number },
    issueDate: { type: Date },
    iqamaStatus: { type: String, enum: ['PENDING', 'DONE'], default: 'PENDING' },
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
  receivedDate: { type: Date, default: Date.now },

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

// === Server Start ===
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));

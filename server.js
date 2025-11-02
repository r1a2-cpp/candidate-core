import express, { application } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import mongoose from 'mongoose';
dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(express.json());

const CandidateSchema = new mongoose.Schema({
    // Primary Information
    SL: { type: Number, required: true, unique: true },
    fullName: { type: String, required: true },
    passportNumber: { type: String, required: true, unique: true },
    agentName: { type: String, required: true },

    
    // Progress Information
    medicalInfo: {
        status: { type: String, enum: ['PENDING', 'FIT','UNFIT','EXP',], default: 'pending' },
        date: { type: Date},

    },
    policeclearanceInfo:{ type:boolean, default:false},
    mofaInf0:{
        status: { type: String, enum: ['PENDING', 'DONE','MEDxUPDATE'], default: '' },
        date: { type: Date},
        rlNumber: { type: Number},
        applicationNumber: { type: Number},
    },
    fingerInfo:{
        status: { type: String, enum: ['PENDING', 'DONE'], default: '' },
        date: { type: Date},
    },
    visaInfo:{
        visaNo: { type: Number},
        visaType: { type: String},
        issueDate: { type: Date},
        expiryDate: { type: Date},
        visaStatus: { type: String, enum: ['PENDING', 'ISSUED','SOLD','EXPAIRED'], default: '' },
    },
    manpowerInfo:{
        bmetTraingeStatus: { type: String, enum: ['PENDING', 'COMPLETED'], default: '' },
        manpowerStatus: { type: String, enum: ['PENDING', 'DONE'], default: '' }
    },
    flightInfo:{
        flightDate: { type: Date},
        flightStatus: { type: String, enum: ['PENDING', 'DONE'], default: '' }
    },
    iqamaInfo:{
        iqamaNumber: { type: Number},
        issueDate: { type: Date},
        iqamaStatus: { type: String, enum: ['PENDING', 'DONE'], default: '' }
    },

    //documents
    passportCopy:{type: String},
    visaCopy:{ type: String},
    
    //status
    status: { type: String, enum: ['JUST REVIVED','MEDICAL', 'VISA', 'MANPOWER','FLIGHT','IQAMAH','ON HOLD'], default: 'processing' },
    recivedDate: { type: Date, default: ''},
    overallStatus: { type: String, enum: ['IN-PROGRESS', 'DONE','BACK','CANCEL'], default: 'in-progress' },

},{ timestamps: true });

const OfficeData = mongoose.model('candidates', CandidateSchema);

app.post('/api/office-data', async (req, res) => {
    try {
        const officeData = new OfficeData(req.body);
        await officeData.save();
        res.status(201).send(officeData);
    } catch (error) {
        res.status(400).send({ error: error.message });
    }
});

app.get('/api/office-data', async (req, res) => {
    try {
        const data = await OfficeData.find();
        res.status(200).send(data);
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
});

app.get('/', (req, res) => {
    res.send('Candidate Core API is running');
});

const PORT = process.env.PORT || 3000;


app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

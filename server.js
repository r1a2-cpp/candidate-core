import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import mongoose from 'mongoose';
dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(express.json());

const officeDataSchema = new mongoose.Schema({
    name:String,
    department:String,
    createAt: { type: Date, default: Date.now }
});

const OfficeData = mongoose.model('OfficeData', officeDataSchema);

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

import express from "express";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import multer from "multer";
import { FormData } from "./models/user.models.js";
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import dotenv from "dotenv";
dotenv.config();
// const upload = multer({ dest : "uploads/"});

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();

app.use(express.static(__dirname + "/public/"));
app.use(express.json()); 
app.use(bodyParser.urlencoded({ extended: false }));

// Set up multer for handling file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './uploads'); // Set the destination folder for storing uploaded files
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()} + '-' + ${file.originalname}`) 
    }
});
const upload = multer({ storage });

mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('Connected to MongoDB Atlas'))
    .catch(err => console.error('Error connecting to MongoDB Atlas:', err));

const port = 3000;

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/form.html");
});

// Use multer middleware to handle file uploads
app.post('/', upload.array('photos', 4), async (req, res) => {
    try {
        // Check if a document with the same instaLink already exists
        const existingFormData = await FormData.findOne({ instaLink: req.body.instaLink });

        if (existingFormData) {
            // Handle the duplicate instaLink appropriately (e.g., send an error response)
            return res.status(400).json({ error: 'Duplicate instaLink found' });
        }

        // Create a new FormData document
        const formData = new FormData({
            ...req.body,
            photos: req.files.map(file => file.filename) // Save the filenames of the uploaded photos in the database
        });
        await formData.save();

        res.status(200).sendFile(__dirname + "/success.html");
    } catch (err) {
        console.error('Error submitting form:', err);
        res.status(500).sendFile(__dirname + "/failure.html");
    }
});


app.listen(port, () => {
    console.log(`App is listening on ${port}`);
});

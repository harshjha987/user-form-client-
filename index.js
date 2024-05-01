import express from "express";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import { FormData } from "./models/user.models.js";
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import dotenv from "dotenv";
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();

app.use(express.static(__dirname + "/public/"));
app.use(express.json()); 

mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('Connected to MongoDB Atlas'))
    .catch(err => console.error('Error connecting to MongoDB Atlas:', err));

const port = 3000;
app.use(bodyParser.urlencoded({ extended: false }));

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/form.html");
});

app.post('/', async (req, res) => {
    
    try {
        
    
    
    const formData = new FormData(req.body);
    console.log(req.body);

       
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

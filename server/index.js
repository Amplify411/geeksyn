import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import helmet from 'helmet';
import cors from "cors";
import morgan from 'morgan';

import User from './models/User.js';

dotenv.config();
const app = express();
app.use(express.json() );
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy( { policy: "cross-origin" } ));
app.use(cors());
app.use(morgan("common"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Mongo Setup ...

const PORT= 4000;

mongoose
.connect("mongodb://127.0.0.1:27017/Users");

app.listen( PORT, () => console.log(`connected to port ${PORT}`));

// Mongo REST API ...

app.post('/register', async (req, res) => {
    User.create(req.body)
    .then((user) => res.json(user))
    .catch((error) => res.json(error))
});

app.post('/login', async (req, res) => {
    const {email, password}=req.body;
    User.findOne({email})
    .then((user) => {
        if(user) {
            if(user.password === password) {
                res.json("Success")
            } else {
                res.json("Incorrect password")
            }
        } else {
            res.json("User not found")
        }
    })
});

app.get('/users', async (req, res) => {
    try {
        const users = await User.find({});
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching users data' });
    }
})


app.put('/users/:id', async (req, res) => {
    try {
        const updatedUser = await User.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        res.json(updatedUser);
    } catch (error) {
        console.error('Error updating user:', error);
        res.status(500).json({ message: 'Error updating user' });
    }
});

app.delete('/users/:id', async (req, res) => {
    try {
      const { id } = req.params;
      await User.findByIdAndDelete(id);
      res.status(200).json({ message: 'Item deleted successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Error deleting item', error });
    }
  });
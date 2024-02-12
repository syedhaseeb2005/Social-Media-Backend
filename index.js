import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import UserRoute from './routes/UserRoute.js'
import AuthRoute from './routes/AuthRoute.js'
import PostRoute from './routes/PostRoute.js'
import cookieParser from "cookie-parser";

const app = express();
app.use(express.json());
const port = 7000;
dotenv.config();
app.use(cookieParser());

const mongooseConnect = async () => {
    try {
        await mongoose.connect(process.env.Mongo_Url);
        console.log("Connected to MongoDB!");
    } catch (error) {
        console.error("Error connecting to MongoDB:", error);
    }
};


app.use('/api/user', UserRoute)
app.use('/api/auth', AuthRoute)
app.use('/api/post', PostRoute)


// app.get("/", (req, res) => {
//     res.send("Hello, world!");
// });

app.listen(port, () => {
    mongooseConnect();
    console.log(`Server is listening on http://localhost:${port}`);
});
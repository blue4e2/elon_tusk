import mongoose from "mongoose";
import * as dotenv from "dotenv";

dotenv.config();

const connectDB = async () => {
    try{
        await mongoose.connect(process.env.MONGODB_URL);
        console.log("MongoDB connected");
    }catch(err){
        console.log("MongoDB connection error: ", err);
        process.exit(1);
    }
};

export default connectDB;
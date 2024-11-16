import mongoose from "mongoose";
import scheduleSchema from "./schedule.model.js";

const Schema = mongoose.Schema;

const userSchema = new mongoose.Schema({
    discordId: { type: String, required: true },
    discordName: { type: String },
    schedule: scheduleSchema
});

const User = mongoose.model('User', userSchema);

export default User;



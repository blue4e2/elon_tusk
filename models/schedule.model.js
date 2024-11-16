import mongoose from "mongoose";

const scheduleSchema = new mongoose.Schema({
    offset: { type: Number, required: true },
    scheduleData: { 
        Monday: [{ type: String }],
        Tuesday: [{ type: String }],
        Wednesday: [{ type: String }],
        Thursday: [{ type: String }],
        Friday: [{ type: String }],
        Saturday: [{ type: String }],
        Sunday: [{ type: String }],
    },
    scheduleDataIST: {
        Monday: [{ type: String }],
        Tuesday: [{ type: String }],
        Wednesday: [{ type: String }],
        Thursday: [{ type: String }],
        Friday: [{ type: String }],
        Saturday: [{ type: String }],
        Sunday: [{ type: String }],
    },
    report: { type: Map, of: Number, default: {} }
});

export default scheduleSchema;


import mongoose from "mongoose";
import Schedule from "./schedule.schema";

const Schema = mongoose.Schema;

const studyGroupSchema = new mongoose.Schema({
    name: { type: String, required: true },
    founder: { type: String, required: true },
    maxSize: { type: Number, required: true },
    currentSize: { type: Number, default: 1 },
    participants: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    schedule: { type: Schema.Types.ObjectId, ref: 'Schedule' }
});

const StudyGroup = mongoose.model('StudyGroup', studyGroupSchema);

export default StudyGroup;



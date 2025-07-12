import mongoose, { Schema, Document, Types } from "mongoose";


interface JobApplication extends Document {
    id: string;
    jobId: Types.ObjectId;
    studentId: Types.ObjectId;
    status: 'pending' | 'accepted' | 'rejected';
    cvUrl?: string;
    coverLetter?: string;
    createdAt: string;
    updatedAt: string;
}

const JobApplicationSchema: Schema<JobApplication> = new Schema({
    jobId: {
        type: Schema.Types.ObjectId,
        ref: 'Job',
        required: [true, 'Job ID is required'],
    },
    studentId: {
        type: Schema.Types.ObjectId,
        ref: 'Student',
        required: [true, 'Student ID is required'],
    },
    status: {
        type: String,
        enum: ['pending', 'accepted', 'rejected'],
        required: [true, 'Status is required'],
    },
    cvUrl: {
        type: String,
        required: false,
    },
    coverLetter: {
        type: String,
        required: false,
    },
}, { timestamps: true });

const JobApplicationModel = mongoose.models.JobApplication || mongoose.model<JobApplication>('JobApplication', JobApplicationSchema);

export default JobApplicationModel;
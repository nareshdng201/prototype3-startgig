import mongoose, { Schema, Document } from "mongoose";
import { EmployerUser } from "@/lib/types/user";

interface Employer extends Document, Omit<EmployerUser, '_id'> { }

const EmployerSchema: Schema<Employer> = new Schema({
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
    },
    role: {
        type: String,
        enum: ['employer'],
        required: [true, 'Role is required'],
        default: 'employer'
    },
    companyName: {
        type: String,
        required: [true, 'Company name is required'],
    },
    location: {
        type: String,
        required: [true, 'Location is required'],
    },
    industry: {
        type: String,
        required: false,
    },
    website: {
        type: String,
    },
    description: {
        type: String,
    },
    image: {
        type: String,
    },
    isApproved: {
        type: String,
        enum: ['pending', 'approved', 'rejected'],
        default: 'pending',
    }
}, { timestamps: true });

const EmployerModel = mongoose.models.Employer || mongoose.model<Employer>('Employer', EmployerSchema);

export default EmployerModel;

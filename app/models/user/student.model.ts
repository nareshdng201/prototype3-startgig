import mongoose, { Schema, Document } from "mongoose";
import { StudentUser } from "@/lib/types/user";

interface Student extends Document, Omit<StudentUser, '_id'> { }

const StudentSchema: Schema<Student> = new Schema({
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
    },
    phoneNumber: {
        type: String,
    },

    location: {
        type: String,
        required: [true, 'Location is required'],
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
    },
    role: {
        type: String,
        enum: ['student'],
        required: [true, 'Role is required'],
        default: 'student'
    },
    firstName: {
        type: String,
        required: [true, 'First name is required'],
    },
    lastName: {
        type: String,
        required: [true, 'Last name is required'],
    },
    education: {
        type: String,
        required: [true, 'Education is required'],
    },
    skills: {
        type: [String],
        required: [true, 'Skills are required'],
    },
    experience: {
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

const StudentModel = mongoose.models.Student || mongoose.model<Student>('Student', StudentSchema);

export default StudentModel;
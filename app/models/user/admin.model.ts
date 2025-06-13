import mongoose, { Schema, Document } from "mongoose";
import { AdminUser } from "@/lib/types/user";

interface Admin extends Document, Omit<AdminUser, '_id'> {}

const AdminSchema: Schema<Admin> = new Schema({
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
        enum: ['admin'],
        required: [true, 'Role is required'],
        default: 'admin'
    },
    name: {
        type: String,
        required: [true, 'Name is required'],
    },
    image: {
        type: String,
    }
}, { timestamps: true });

const AdminModel = mongoose.models.Admin || mongoose.model<Admin>('Admin', AdminSchema);

export default AdminModel;

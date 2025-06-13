import { NextResponse } from "next/server"
import { connectDb } from "@/lib/db/config/db.config"
import mongoose from "mongoose"
import JobApplicationModel from "@/app/models/jobApplication/jobApplication.model"
import JobModel from "@/app/models/job/job.model"
import StudentModel from "@/app/models/user/student.model"

// Ensure models are registered
const Job = mongoose.models.Job || JobModel
const Student = mongoose.models.Student || StudentModel
const JobApplication = mongoose.models.JobApplication || JobApplicationModel

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url)
        const jobId = searchParams.get('jobId')

        if (!jobId) {
            return NextResponse.json(
                { error: 'Job ID is required' },
                { status: 400 }
            )
        }

        await connectDb()

        // Convert jobId to ObjectId
        const jobObjectId = new mongoose.Types.ObjectId(jobId)

        // Get applications for the specific job
        const applications = await JobApplication.find({ jobId: jobObjectId })
            .populate({
                path: 'jobId',
                model: Job,
                select: 'title company'
            })
            .populate({
                path: 'studentId',
                model: Student,
                select: 'firstName lastName email education skills experience'
            })
            .sort({ createdAt: -1 })

        return NextResponse.json(applications)
    } catch (error) {
        console.error('Error fetching employer applications:', error)
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        )
    }
} 
import { NextResponse } from "next/server"
import { connectDb } from "@/lib/db/config/db.config"
import mongoose from "mongoose"
import JobApplicationModel from "@/app/models/jobApplication/jobApplication.model"
import JobModel from "@/app/models/job/job.model"
import StudentModel from "@/app/models/user/student.model"
import { cookies } from 'next/headers'
import { jwtVerify } from 'jose'

// Ensure models are registered
const Job = mongoose.models.Job || JobModel
const Student = mongoose.models.Student || StudentModel
const JobApplication = mongoose.models.JobApplication || JobApplicationModel

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url)
        const jobId = searchParams.get('jobId')
        const skills = searchParams.get('skills') // New parameter for skill search
        
        await connectDb()
        
        // Get employerId from JWT token
        const token = cookies().get('token')?.value
        
        if (!token) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const secret = new TextEncoder().encode(process.env.JWT_SECRET)
        const { payload } = await jwtVerify(token, secret)
        
        if (payload.role !== 'employer') {
            return NextResponse.json(
                { error: 'Only employers can access this endpoint' },
                { status: 403 }
            )
        }

        const employerId = payload.userId

        let applications

        if (jobId) {
            // If jobId is provided, get applications for that specific job
            const jobObjectId = new mongoose.Types.ObjectId(jobId)
            
            applications = await JobApplication.find({ jobId: jobObjectId })
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
        } else {
            // If no jobId, get all applications for jobs owned by this employer
            // First, get all job IDs owned by this employer
            const employerJobs = await Job.find({ employerId: employerId }).select('_id')
            const jobIds = employerJobs.map(job => job._id)
            
            if (jobIds.length === 0) {
                return NextResponse.json([])
            }

            applications = await JobApplication.find({ jobId: { $in: jobIds } })
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
        }

        // Filter by skills if provided (after population)
        if (skills && skills.trim()) {
            const skillArray = skills.split(',').map((skill: string) => skill.trim().toLowerCase())
            applications = applications.filter(application => {
                if (!application.studentId || !application.studentId.skills) return false
                return skillArray.some((searchSkill: string) => 
                    application.studentId.skills.some((skill: string) => 
                        skill.toLowerCase().includes(searchSkill)
                    )
                )
            })
        }

        return NextResponse.json(applications)
    } catch (error) {
        console.error('Error fetching employer applications:', error)
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        )
    }
} 
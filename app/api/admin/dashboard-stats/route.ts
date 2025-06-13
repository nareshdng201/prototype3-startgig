import { NextResponse } from "next/server"
import { connectDb } from "@/lib/db/config/db.config"
import StudentModel from "@/app/models/user/student.model"
import EmployerModel from "@/app/models/user/employer.model"
import JobModel from "@/app/models/job/job.model"

export async function GET(request: Request) {
  try {
    await connectDb()
    
    // Fetch all required statistics in parallel
    const [activeStudents, partnerEmployers, activeJobs, totalJobs] = await Promise.all([
      // Count active students (approved and not deleted)
      StudentModel.countDocuments({ isApproved: 'approved' }),
      // Count approved employers
      EmployerModel.countDocuments({ isApproved: 'approved' }),
      // Count active jobs
      JobModel.countDocuments({ status: 'active' }),
      // Count total jobs
      JobModel.countDocuments({})
    ])

    return NextResponse.json({
      activeStudents,
      partnerEmployers,
      activeJobs,
      totalJobs
    })
  } catch (error) {
    console.error("Error fetching dashboard stats:", error)
    return NextResponse.json({ error: "Failed to fetch dashboard statistics" }, { status: 500 })
  }
} 
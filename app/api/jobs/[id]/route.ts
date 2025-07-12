import { NextResponse } from "next/server"
import { connectDb } from "@/lib/db/config/db.config"
import JobModel from "@/app/models/job/job.model"

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await connectDb()
    
    const job = await JobModel.findById(params.id)
    
    if (!job) {
      return NextResponse.json(
        { error: "Job not found" },
        { status: 404 }
      )
    }

    return NextResponse.json(job, { status: 200 })
  } catch (error) {
    console.error('Error fetching job:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 
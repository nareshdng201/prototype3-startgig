import { NextResponse } from "next/server"
import { connectDb } from "@/lib/db/config/db.config"
import JobApplicationModel from "@/app/models/jobApplication/jobApplication.model"
import JobModel from "@/app/models/job/job.model"
import { z } from 'zod'
import { cookies } from 'next/headers'
import { jwtVerify } from 'jose'

const updateStatusSchema = z.object({
  status: z.enum(['accepted', 'rejected'])
})

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params
    const body = await request.json()
    const { status } = updateStatusSchema.parse(body)

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
        { error: 'Only employers can update application status' },
        { status: 403 }
      )
    }

    const employerId = payload.userId
    
    console.log(id, status, "id")

    // First verify that the application exists and belongs to a job owned by the employer
    const application = await JobApplicationModel.findById({ _id: id })
    console.log(application, "application")
    if (!application) {
      return NextResponse.json(
        { error: 'Application not found' },
        { status: 404 }
      )
    }

    // Verify that the job belongs to this employer
    const job = await JobModel.findOne({
      _id: application.jobId,
      employerId: employerId
    })

    if (!job) {
      return NextResponse.json(
        { error: 'You do not have permission to update this application' },
        { status: 403 }
      )
    }

    // Update the application status
    const updatedApplication = await JobApplicationModel.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    )
      .populate('jobId', 'title company')
      .populate('studentId', 'firstName lastName email education skills experience')

    return NextResponse.json(updatedApplication)
  } catch (error) {
    console.log(error, "error")
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid status value' },
        { status: 400 }
      )
    }
    console.error('Error updating application status:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 
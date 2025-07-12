import { NextResponse } from "next/server"
import { z } from 'zod'
import { cookies } from 'next/headers'
import { jwtVerify } from 'jose'
import { connectDb } from '@/lib/db/config/db.config'
import JobApplicationModel from "@/app/models/jobApplication/jobApplication.model"

const applicationSchema = z.object({
  jobId: z.string(),
  cvUrl: z.string().optional(),
  coverLetter: z.string().optional(),
})

export async function GET(request: Request) {
  try {
    await connectDb()
    const token = cookies().get('token')?.value
    
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const secret = new TextEncoder().encode(process.env.JWT_SECRET)
    const { payload } = await jwtVerify(token, secret)
    const studentId = payload.userId as string

    const applications = await JobApplicationModel.find({ studentId })
      .populate('jobId')
      .sort({ createdAt: -1 })

    return NextResponse.json(applications, { status: 200 })
  } catch (error) {
    console.error('Error fetching applications:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    await connectDb()
    const token = cookies().get('token')?.value
    
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const secret = new TextEncoder().encode(process.env.JWT_SECRET)
    const { payload } = await jwtVerify(token, secret)
    const studentId = payload.userId as string

    const body = await request.json()
    const { jobId, cvUrl, coverLetter } = applicationSchema.parse(body)

    // Check if application already exists
    const existingApplication = await JobApplicationModel.findOne({
      jobId,
      studentId,
    })

    if (existingApplication) {
      return NextResponse.json(
        { error: 'You have already applied for this job' },
        { status: 400 }
      )
    }

    const application = await JobApplicationModel.create({
      jobId,
      studentId,
      status: 'pending',
      cvUrl,
      coverLetter,
    })

    return NextResponse.json(application, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid input data' },
        { status: 400 }
      )
    }
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

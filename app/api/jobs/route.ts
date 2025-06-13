import { NextResponse } from "next/server"
import { z } from 'zod'
import { jwtVerify } from 'jose'
import { connectDb } from '@/lib/db/config/db.config'
import JobModel from "@/app/models/job/job.model"

const jobSchema = z.object({
  title: z.string().min(3),
  description: z.string().min(10),
  company: z.string().min(2),
  location: z.string().min(2),
  type: z.enum(['full-time', 'part-time', 'internship']),
  salary: z.string().optional(),
  requirements: z.array(z.string()),
})

export async function GET(request: Request) {
  try {
    await connectDb()
    const jobs = await JobModel.find({}).sort({ createdAt: -1 })
    return NextResponse.json(jobs, { status: 200 })
  } catch (error) {
    console.error('Error fetching jobs:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    await connectDb()
    const body = await request.json()
    const { title, description, company, location, type, salary, requirements } = body
    
    const jobData = jobSchema.parse({ title, description, company, location, type, salary, requirements })
    const newJob = await JobModel.create(jobData)
    
    return NextResponse.json(newJob, { status: 201 })
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

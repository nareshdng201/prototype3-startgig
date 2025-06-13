import { NextResponse } from "next/server"
import { z } from 'zod'
import { cookies } from 'next/headers'
import { jwtVerify } from 'jose'
import { connectDb } from '@/lib/db/config/db.config'
import mongoose from 'mongoose'

const savedJobSchema = z.object({
  jobId: z.string(),
})

// Create a model for saved jobs
const SavedJobSchema = new mongoose.Schema({
  jobId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Job',
    required: true,
  },
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
}, { timestamps: true })

const SavedJobModel = mongoose.models.SavedJob || mongoose.model('SavedJob', SavedJobSchema)

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

    const savedJobs = await SavedJobModel.find({ studentId })
      .populate('jobId')
      .sort({ createdAt: -1 })

    return NextResponse.json(savedJobs, { status: 200 })
  } catch (error) {
    console.error('Error fetching saved jobs:', error)
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
    const { jobId } = savedJobSchema.parse(body)

    // Check if job is already saved
    const existingSavedJob = await SavedJobModel.findOne({
      jobId,
      studentId,
    })

    if (existingSavedJob) {
      return NextResponse.json(
        { error: 'Job is already saved' },
        { status: 400 }
      )
    }

    const savedJob = await SavedJobModel.create({
      jobId,
      studentId,
    })

    return NextResponse.json(savedJob, { status: 201 })
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

export async function DELETE(request: Request) {
  try {
    await connectDb()
    const token = cookies().get('token')?.value
    
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const secret = new TextEncoder().encode(process.env.JWT_SECRET)
    const { payload } = await jwtVerify(token, secret)
    const studentId = payload.userId as string

    const { searchParams } = new URL(request.url)
    const jobId = searchParams.get('jobId')

    if (!jobId) {
      return NextResponse.json(
        { error: 'Job ID is required' },
        { status: 400 }
      )
    }

    await SavedJobModel.findOneAndDelete({
      jobId,
      studentId,
    })

    return NextResponse.json({ message: 'Job removed from saved list' }, { status: 200 })
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

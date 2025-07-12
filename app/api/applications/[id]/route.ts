import { NextResponse } from "next/server"
import { z } from 'zod'
import { cookies } from 'next/headers'
import { jwtVerify } from 'jose'
import { connectDb } from '@/lib/db/config/db.config'
import JobApplicationModel from "@/app/models/jobApplication/jobApplication.model"

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await connectDb()
    const token = cookies().get('token')?.value
    
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const secret = new TextEncoder().encode(process.env.JWT_SECRET)
    const { payload } = await jwtVerify(token, secret)
    const studentId = payload.userId as string

    const { id } = params

    // Find the application and verify it belongs to the current student
    const application = await JobApplicationModel.findOne({
      _id: id,
      studentId: studentId
    })

    if (!application) {
      return NextResponse.json(
        { error: 'Application not found or you do not have permission to withdraw it' },
        { status: 404 }
      )
    }

    // Delete the application
    await JobApplicationModel.findByIdAndDelete(id)

    return NextResponse.json(
      { message: 'Application withdrawn successfully' },
      { status: 200 }
    )
  } catch (error) {
    console.error('Error withdrawing application:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 
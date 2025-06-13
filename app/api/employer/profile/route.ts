import { NextResponse } from "next/server"
import { cookies } from 'next/headers'
import { jwtVerify } from 'jose'
import { connectDb } from "@/lib/db/config/db.config"
import EmployerModel from "@/app/models/user/employer.model"

export async function GET(request: Request) {
  try {
    await connectDb()
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

    const employer = await EmployerModel.findOne({ _id: payload.userId })
    
    if (!employer) {
      return NextResponse.json(
        { error: 'Employer not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      companyName: employer.companyName,
      location: employer.location,
      industry: employer.industry,
      website: employer.website,
      description: employer.description,
      image: employer.image,
      isApproved: employer.isApproved
    })
  } catch (error) {
    console.error('Error fetching employer profile:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 
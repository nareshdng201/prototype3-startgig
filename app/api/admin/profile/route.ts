import { NextResponse } from "next/server"
import { cookies } from 'next/headers'
import { jwtVerify } from 'jose'
import { connectDb } from "@/lib/db/config/db.config"
import AdminModel from "@/app/models/user/admin.model"

export async function GET(request: Request) {
  try {
    await connectDb()
    const token = cookies().get('token')?.value
    
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const secret = new TextEncoder().encode(process.env.JWT_SECRET)
    const { payload } = await jwtVerify(token, secret)
    
    if (payload.role !== 'admin') {
      return NextResponse.json(
        { error: 'Only admins can access this endpoint' },
        { status: 403 }
      )
    }

    const admin = await AdminModel.findOne({ _id: payload.userId })
    
    if (!admin) {
      return NextResponse.json(
        { error: 'Admin not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      name: admin.name,
      email: admin.email,
      image: admin.image
    })
  } catch (error) {
    console.error('Error fetching admin profile:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 
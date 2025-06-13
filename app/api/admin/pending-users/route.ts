import { NextResponse } from "next/server"
import { connectDb } from "@/lib/db/config/db.config"
import StudentModel from "@/app/models/user/student.model"
import EmployerModel from "@/app/models/user/employer.model"

export async function GET(request: Request) {
  try {
    await connectDb()
    
    const { searchParams } = new URL(request.url)
    const role = searchParams.get('role')

    let pendingUsers = []

    if (role === 'student') {
      pendingUsers = await StudentModel.find({ isApproved: 'pending' })
    } else if (role === 'employer') {
      pendingUsers = await EmployerModel.find({ isApproved: 'pending' })
    } else {
      // If no role specified, fetch both students and employers
      const [pendingStudents, pendingEmployers] = await Promise.all([
        StudentModel.find({ isApproved: 'pending' }),
        EmployerModel.find({ isApproved: 'pending' })
      ])
      pendingUsers = [...pendingStudents, ...pendingEmployers]
    }

    return NextResponse.json(pendingUsers)
  } catch (error) {
    console.error("Error fetching pending users:", error)
    return NextResponse.json({ error: "Failed to fetch pending users" }, { status: 500 })
  }
}

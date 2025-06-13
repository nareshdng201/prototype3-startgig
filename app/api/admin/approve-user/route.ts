import { type NextRequest, NextResponse } from "next/server"
import StudentModel from "@/app/models/user/student.model"
import EmployerModel from "@/app/models/user/employer.model"
import { connectDb } from "@/lib/db/config/db.config"

export async function POST(request: NextRequest) {
  try {
    await connectDb()
    const { userId, approved, notes } = await request.json()

    // Find user in either Student or Employer model
    const student = await StudentModel.findById(userId)
    const employer = await EmployerModel.findById(userId)

    const user = student || employer
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    if (user.role !== 'admin') {
      user.isApproved = approved ? 'approved' : 'rejected'
      await user.save()
    }

    return NextResponse.json({
      user,
      message: `User ${approved ? "approved" : "rejected"} successfully`,

    }, { status: 200 })
  } catch (error) {
    console.error("Error processing user approval:", error)
    return NextResponse.json({ error: "Failed to process user approval" }, { status: 500 })
  }
}


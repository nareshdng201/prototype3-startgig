import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import JobModel from "@/app/models/job/job.model"
import { connectDb } from "@/lib/db/config/db.config"
import { cookies } from 'next/headers'
import { jwtVerify } from 'jose'

export async function DELETE(
    request: Request,
    { params }: { params: { jobId: string } }
) {
    try {
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
                { error: 'Only employers can delete jobs' },
                { status: 403 }
            )
        }

        const employerId = payload.userId
        
        console.log('Params:', params)
        console.log('EmployerId:', employerId)

        const job = await JobModel.findOne({
            _id: params.jobId,
            employerId: employerId
        })

        console.log('Found job:', job)

        if (!job) {
            return NextResponse.json({ error: "Job not found" }, { status: 404 })
        }

        await JobModel.deleteOne({ _id: params.jobId })

        return NextResponse.json({ message: "Job deleted successfully" })
    } catch (error) {
        console.error("Error deleting job:", error)
        return NextResponse.json(
            { error: "Failed to delete job" },
            { status: 500 }
        )
    }
} 
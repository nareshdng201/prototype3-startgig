import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import JobModel from "@/app/models/job/job.model"
import { connectDb } from "@/lib/db/config/db.config"
import session from "redux-persist/es/storage/session"

export async function DELETE(
    request: Request,
    { params }: { params: { jobId: string } }
) {
    try {
        // Get employerId from URL query parameters instead of body
        const { searchParams } = new URL(request.url)
        const employerId = searchParams.get('employerId')
        
        console.log('Params:', params)
        console.log('EmployerId:', employerId)

        if (!employerId) {
            return NextResponse.json(
                { error: "Employer ID is required as a query parameter" },
                { status: 400 }
            )
        }

        await connectDb()

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
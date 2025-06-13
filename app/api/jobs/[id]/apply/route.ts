import { NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

// Mock database - replace with actual database
let applications: App.JobApplication[] = [];

export async function POST(
  request: Request,
  { params }: { params: { id: string, studentId: string } }
) {
  try {


    const jobId = params.id;


    // Check if already applied
    const existingApplication = applications.find(
      app => app.jobId === jobId && app.studentId === params.studentId
    );

    if (existingApplication) {
      return NextResponse.json(
        { error: 'You have already applied to this job' },
        { status: 400 }
      );
    }

    const newApplication: App.JobApplication = {
      id: Math.random().toString(36).substr(2, 9),
      jobId,
      studentId: params.studentId,
      status: 'pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    applications.push(newApplication);

    return NextResponse.json(newApplication, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 
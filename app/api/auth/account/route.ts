import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { jwtVerify } from 'jose';
import { connectDb } from '@/lib/db/config/db.config';
import StudentModel from '@/app/models/user/student.model';
import EmployerModel from '@/app/models/user/employer.model';
import AdminModel from '@/app/models/user/admin.model';

export async function GET(request: Request) {
  try {
    // Get the token from cookies
    const token = cookies().get('token')?.value;
    
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Verify the token
    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    const { payload } = await jwtVerify(token, secret);
    const userId = payload.userId as string;
    const role = payload.role as string;

    // Connect to database
    await connectDb();

    // Find user based on role
    let user;
    switch (role) {
      case 'student':
        user = await StudentModel.findById(userId);
        break;
      case 'employer':
        user = await EmployerModel.findById(userId);
        break;
      case 'admin':
        user = await AdminModel.findById(userId);
        break;
      default:
        return NextResponse.json({ error: 'Invalid role' }, { status: 400 });
    }

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Remove sensitive information
    const userData = user.toObject();
    delete userData.password;

    return NextResponse.json({ user: userData }, { status: 200 });
  } catch (error) {
    console.error('Error fetching account:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

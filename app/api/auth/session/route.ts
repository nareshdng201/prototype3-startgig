import { NextResponse } from 'next/server';
import { jwtVerify } from 'jose';
import UserModel from '@/app/models/user/student.model';
import EmployerModel from '@/app/models/user/employer.model';

export async function GET(request: Request) {
  try {
    // Get token from cookie
    const token = request.headers.get('cookie')?.split('token=')[1]?.split(';')[0];
    
    if (!token) {
      return NextResponse.json({ user: null }, { status: 200 });
    }

    // Verify token
    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    const { payload } = await jwtVerify(token, secret);
    
    // Get user data from database
    const user = await UserModel.findById(payload.userId).select('-password') ?? await EmployerModel.findById(payload.userId).select('-password');
    
    if (!user) {
      return NextResponse.json({ user: null }, { status: 200 });
    }

    return NextResponse.json({
      user: {
        ...user?._doc 
      },
      expires: payload.exp
    }, { status: 200 });
  } catch (error) {
    // If token is invalid or expired, return null session
    return NextResponse.json({ user: null }, { status: 200 });
  }
} 
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import UserModel from '@/app/models/user/student.model';

export async function POST(uid: Request) {
  try {
    const { email } = await uid.json()
    console.log(email)
    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 })
    }
    const user = await UserModel.findOneAndUpdate({ email })
    console.log(user)
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }
    cookies().delete('token');
    return NextResponse.json({ user, message: 'Logged out successfully' }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 
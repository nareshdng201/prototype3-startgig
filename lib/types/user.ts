export type UserRole = 'admin' | 'employer' | 'student';

export interface BaseUser {
  readonly _id: string;
  email: string;
  password: string;
  role: UserRole;
  createdAt: string;
  updatedAt: string;
  image?: string;
  isApproved: 'pending' | 'approved' | 'rejected';
}

export interface AdminUser extends Omit<BaseUser, 'isApproved'> {
  role: 'admin';
  name: string;
}

export interface EmployerUser extends BaseUser {
  role: 'employer';
  companyName: string;
  location: string;
  industry?: string;
  website?: string;
  description?: string;
}

export interface StudentUser extends BaseUser {
  location: string;
  phoneNumber?: string;
  role: 'student';
  firstName: string;
  lastName: string;
  education: string;
  skills: string[];
  experience?: string;
}

export type User = AdminUser | EmployerUser | StudentUser; 
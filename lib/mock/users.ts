import { AdminUser, EmployerUser, StudentUser } from '../types/user';

export const mockAdmin: AdminUser = {
  id: 'admin-1',
  email: 'admin@example.com',
  password: 'admin123', // In production, this should be hashed
  role: 'admin',
  name: 'Admin User',
  permissions: ['manage_users', 'manage_content', 'view_analytics'],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

export const mockEmployer: EmployerUser = {
  id: 'employer-1',
  email: 'employer@company.com',
  password: 'employer123', // In production, this should be hashed
  role: 'employer',
  companyName: 'Tech Solutions Inc',
  industry: 'Technology',
  location: 'New York, NY',
  website: 'https://techsolutions.com',
  description: 'Leading technology solutions provider',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

export const mockStudent: StudentUser = {
  id: 'student-1',
  email: 'student@university.edu',
  password: 'student123', // In production, this should be hashed
  role: 'student',
  firstName: 'John',
  lastName: 'Doe',
  education: 'Bachelor of Computer Science',
  skills: ['JavaScript', 'React', 'Node.js', 'Python'],
  experience: '2 years of web development experience',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

export const mockUsers = [mockAdmin, mockEmployer, mockStudent]; 
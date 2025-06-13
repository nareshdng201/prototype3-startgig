import { User, AdminUser, EmployerUser, StudentUser } from '../types/user';
import { addUser, findUserByEmail } from '../utils/jsonStorage';
import { mockUsers } from '../mock/users';

// Initialize mock users if the JSON file is empty
const initializeMockUsers = () => {
  const users = findUserByEmail(mockUsers[0].email);
  if (!users) {
    mockUsers.forEach(user => addUser(user));
  }
};

// Call this when the application starts
initializeMockUsers();

export const login = async (email: string, password: string): Promise<User | null> => {
  const user = findUserByEmail(email);
  
  if (!user) {
    return null;
  }

  // In production, you should use proper password hashing
  if (user.password !== password) {
    return null;
  }

  return user;
};

type SignupData = 
  | Omit<AdminUser, 'id' | 'createdAt' | 'updatedAt'>
  | Omit<EmployerUser, 'id' | 'createdAt' | 'updatedAt'>
  | Omit<StudentUser, 'id' | 'createdAt' | 'updatedAt'>;

export const signup = async (userData: SignupData): Promise<User | null> => {
  const existingUser = findUserByEmail(userData.email);
  
  if (existingUser) {
    return null;
  }

  const newUser: User = {
    ...userData,
    id: `${userData.role}-${Date.now()}`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  } as User;

  addUser(newUser);
  return newUser;
};

export const validateUser = (user: User | null): boolean => {
  return user !== null;
}; 
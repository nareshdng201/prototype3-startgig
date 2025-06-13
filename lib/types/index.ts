export interface User {
  id: string
  email: string
  name: string
  role: "student" | "employer" | "admin"
  approved: boolean
  createdAt: string
  companyName?: string
  schoolName?: string
}

export interface Job {
  id: string
  title: string
  company: string
  location: string
  type: "Part-time" | "Internship" | "Full-time"
  salary: string
  description: string
  requirements: string[]
  postedAt: string
  deadline: string
  status: "active" | "closed" | "draft"
  applicants: number
  employerId: string
}

export interface Application {
  id: string
  jobId: string
  studentId: string
  status: "pending" | "accepted" | "rejected"
  appliedAt: string
  resume?: string
  coverLetter?: string
}

export interface StudentProfile {
  id: string
  userId: string
  skills: string[]
  education: {
    school: string
    degree: string
    major: string
    graduationYear: number
  }
  experience: {
    title: string
    company: string
    duration: string
    description: string
  }[]
  resume?: string
}

export interface EmployerProfile {
  id: string
  userId: string
  companyName: string
  description: string
  website?: string
  logo?: string
}

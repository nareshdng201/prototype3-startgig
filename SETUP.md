# Setup Guide

## Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```env
# Cloudinary Configuration
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=ml_default

# Database Configuration
MONGODB_URI=your_mongodb_uri

# JWT Configuration
JWT_SECRET=your_jwt_secret

# NextAuth Configuration
NEXTAUTH_SECRET=your_nextauth_secret
NEXTAUTH_URL=http://localhost:3000
```

## Cloudinary Setup

1. Sign up for a free Cloudinary account at https://cloudinary.com/
2. Get your cloud name from the dashboard
3. Create an upload preset:
   - Go to Settings > Upload
   - Scroll down to Upload presets
   - Click "Add upload preset"
   - Set signing mode to "Unsigned"
   - Save the preset name

## Features Implemented

### 1. Fixed Type Filter
- Added proper filtering logic to exclude "all" values
- Type filter now works correctly for Part-time, Internship, and Full-time jobs

### 2. Professional Job Details Page
- Comprehensive job information display
- Professional UI with proper spacing and typography
- Job status indicators (days left to apply, deadline passed)
- Responsive design with sidebar layout

### 3. CV Upload Functionality
- PDF file upload with validation (5MB limit)
- Cloudinary integration for secure file storage
- Upload progress indicator
- Optional cover letter support
- Professional application dialog

### 4. Enhanced User Experience
- Clear navigation between dashboard and job details
- Save/unsave job functionality
- Application status tracking
- Professional loading states and error handling

## API Endpoints

- `GET /api/jobs/[id]` - Fetch individual job details
- `POST /api/applications` - Submit job application with CV
- `GET /api/applications` - Get user's applications
- `POST /api/saved-jobs` - Save a job
- `DELETE /api/saved-jobs` - Remove saved job

## Database Schema Updates

The JobApplication model now includes:
- `cvUrl` - Cloudinary URL for uploaded CV
- `coverLetter` - Optional cover letter text 
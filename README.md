# Start.Gig - Student Job Board Platform

A comprehensive job board platform connecting students with employers, featuring role-based dashboards and school administration capabilities.

## 🚀 Features

### Core Functionality
- **Multi-role Authentication**: Students, Employers, and School Admins
- **Job Board**: Browse, search, and apply to jobs
- **Application Management**: Track applications and manage hiring
- **Admin Panel**: Approve student registrations and customize platform

### User Roles

#### Students
- Browse and search job listings
- Apply to jobs with one-click
- Save jobs for later
- Track application status
- Profile management with resume upload

#### Employers
- Post job listings
- Manage applications
- View analytics dashboard
- Company profile management

#### School Admins
- Approve student registrations (.edu email verification)
- White-label customization (colors, branding)
- Platform analytics and user management

## 🛠 Tech Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **Authentication**: NextAuth.js
- **Database**: Mock data (ready for Firebase/PostgreSQL integration)
- **Deployment**: Vercel

## 📁 Project Structure

\`\`\`
src/
├── app/                    # Next.js App Router pages
│   ├── api/               # API routes
│   ├── auth/              # Authentication pages
│   ├── student/           # Student dashboard
│   ├── employer/          # Employer dashboard
│   ├── admin/             # Admin dashboard
│   └── globals.css        # Global styles
├── lib/                   # Utilities and configurations
│   ├── auth/              # Authentication providers
│   └── types/             # TypeScript type definitions
└── components/            # Reusable UI components
    └── ui/                # shadcn/ui components
\`\`\`

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
\`\`\`bash
git clone <repository-url>
cd start-gig-mvp
\`\`\`

2. Install dependencies:
\`\`\`bash
npm install
\`\`\`

3. Set up environment variables:
\`\`\`bash
cp .env.example .env.local
\`\`\`

Add your environment variables:
\`\`\`env
NEXTAUTH_SECRET=your-secret-key
NEXTAUTH_URL=http://localhost:3000
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
\`\`\`

4. Run the development server:
\`\`\`bash
npm run dev
\`\`\`

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🔐 Authentication Setup

The platform uses NextAuth.js for authentication with support for:
- Email/Password authentication
- Google OAuth
- Role-based access control

### User Roles
- **Students**: Must use .edu email addresses, require admin approval
- **Employers**: Can register directly and post jobs immediately
- **Admins**: Manage platform settings and user approvals

## 📱 Key Pages

- `/` - Landing page with role selection
- `/auth/signin` - Sign in page
- `/auth/signup` - Registration with role selection
- `/student/dashboard` - Student job browsing interface
- `/employer/dashboard` - Employer job management
- `/admin/dashboard` - Admin panel for user management

## 🎨 Customization

### School Branding
Admins can customize:
- School name and logo
- Primary and secondary colors
- Email domain restrictions

### UI Components
Built with shadcn/ui for easy customization:
- Consistent design system
- Accessible components
- Easy theming

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/signup` - User registration
- `POST /api/auth/signin` - User login

### Jobs
- `GET /api/jobs` - Fetch all jobs
- `POST /api/jobs` - Create new job (employers)
- `GET /api/employer/jobs` - Fetch employer's jobs

### Applications
- `POST /api/applications` - Submit job application
- `GET /api/applications` - Fetch user's applications

### Admin
- `GET /api/admin/pending-users` - Fetch pending approvals
- `POST /api/admin/approve-user` - Approve/reject users
- `GET /api/admin/school-settings` - Fetch school settings
- `PUT /api/admin/school-settings` - Update school settings

## 🚀 Deployment

### Vercel Deployment

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Set environment variables in Vercel dashboard
4. Deploy automatically on push

### Environment Variables for Production
\`\`\`env
NEXTAUTH_SECRET=production-secret
NEXTAUTH_URL=https://your-domain.vercel.app
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
\`\`\`

## 🔮 Future Enhancements

### Stretch Goals
- **Tinder-like Job Swiping**: Mobile-first job discovery
- **Real-time Chat**: Direct messaging between employers and students
- **Advanced Analytics**: Detailed insights for employers and admins
- **Video Interviews**: Integrated video calling
- **Skills Assessment**: Built-in coding challenges and tests

### Database Integration
Currently uses mock data. Ready for integration with:
- **Firebase**: Firestore + Authentication
- **PostgreSQL**: With Prisma ORM
- **Supabase**: Full-stack solution

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Contact the development team
- Check the documentation

---

Built with ❤️ using Next.js and modern web technologies.

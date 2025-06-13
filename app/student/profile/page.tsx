'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { FiMail, FiBook, FiBriefcase, FiMapPin } from 'react-icons/fi';

interface StudentProfile {
  firstName: string;
  lastName: string;
  email: string;
  education: string;
  skills: string[];
  experience?: string;
  location?: string;
  profileImage?: string;
  isApproved: 'pending' | 'approved' | 'rejected';
}

export default function Page() {
  const [profileData, setProfileData] = useState<StudentProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch('/api/auth/account');
        if (!response.ok) {
          throw new Error('Failed to fetch profile data');
        }
        const data = await response.json();
        setProfileData(data.user);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen w-full bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen w-full bg-gray-50 flex items-center justify-center">
        <div className="bg-red-50 p-4 rounded-lg">
          <p className="text-red-600">{error}</p>
        </div>
      </div>
    );
  }

  if (!profileData) {
    return (
      <div className="min-h-screen w-full bg-gray-50 flex items-center justify-center">
        <div className="bg-yellow-50 p-4 rounded-lg">
          <p className="text-yellow-600">No profile data found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Profile Header */}
          <div className="relative h-48 bg-gradient-to-r from-blue-600 to-blue-800">
            <div className="absolute -bottom-16 left-8">
              <div className="relative w-32 h-32 rounded-full border-4 border-white overflow-hidden bg-white">
                <Image
                  src={profileData.profileImage || "https://upload.wikimedia.org/wikipedia/commons/a/ac/Default_pfp.jpg"}
                  alt="Profile"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
            {profileData.isApproved === 'pending' && (
              <div className="absolute top-4 right-4">
                <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm font-medium">
                  Pending Approval
                </span>
              </div>
            )}
          </div>

          {/* Profile Content */}
          <div className="pt-20 pb-8 px-8">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  {profileData.firstName} {profileData.lastName}
                </h1>
                <p className="text-gray-600">{profileData.education}</p>
              </div>
              {/* <button className="flex items-center px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors duration-200">
                <FiEdit2 className="mr-2" />
                Edit Profile
              </button> */}
            </div>

            {/* Main Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Contact Information */}
              <div className="space-y-4">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Contact Information</h2>
                <div className="flex items-center text-gray-600">
                  <FiMail className="mr-3 text-blue-600" />
                  <span>{profileData.email}</span>
                </div>
                {profileData?.location && (
                  <div className="flex items-center text-gray-600">
                    <FiMapPin className="mr-3 text-blue-600" />
                    <span>{profileData.location}</span>
                  </div>
                )}
              </div>

              {/* Education & Experience */}
              <div className="space-y-4">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Education & Experience</h2>
                <div className="flex items-start text-gray-600">
                  <FiBook className="mr-3 text-blue-600 mt-1" />
                  <span>{profileData.education}</span>
                </div>
                {profileData.experience && (
                  <div className="flex items-start text-gray-600">
                    <FiBriefcase className="mr-3 text-blue-600 mt-1" />
                    <span>{profileData.experience}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Skills Section */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Skills</h2>
              <div className="flex flex-wrap gap-2">
                {profileData.skills.map((skill, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* Additional Sections */}
            {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Professional Summary</h3>
                <p className="text-gray-600">
                  A passionate student with a strong foundation in computer science and practical experience in web development.
                  Currently pursuing {profileData.education} with a focus on modern web technologies.
                </p>
              </div>

              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Career Goals</h3>
                <div className="space-y-3">
                  <div className="flex items-center text-gray-600">
                    <FiAward className="mr-3 text-blue-600" />
                    <span>Full-stack Development</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <FiAward className="mr-3 text-blue-600" />
                    <span>Cloud Architecture</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <FiAward className="mr-3 text-blue-600" />
                    <span>Software Engineering</span>
                  </div>
                </div>
              </div>
            </div> */}
          </div>
        </div>
      </div>
    </div>
  );
} 
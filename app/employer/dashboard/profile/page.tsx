'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { FiMail, FiMapPin, FiGlobe, FiBriefcase, FiHome, FiArrowLeft } from 'react-icons/fi';
import { useRouter } from 'next/navigation';

interface EmployerProfile {
  companyName: string;
  email: string;
  location: string;
  industry?: string;
  website?: string;
  description?: string;
  image?: string;
  isApproved: 'pending' | 'approved' | 'rejected';
}

export default function Page() {
  const router = useRouter();
  const [profileData, setProfileData] = useState<EmployerProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch('/api/employer/profile');
        if (!response.ok) {
          throw new Error('Failed to fetch profile data');
        }
        const data = await response.json();
        setProfileData(data);
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
        {/* Back Button */}
        <button
          onClick={() => router.back()}
          className="mb-6 flex items-center text-gray-600 hover:text-blue-600 transition-colors duration-200 group"
        >
          <FiArrowLeft className="mr-2 h-5 w-5 group-hover:-translate-x-1 transition-transform duration-200" />
          <span className="font-medium">Back to Dashboard</span>
        </button>

        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Profile Header */}
          <div className="relative h-48 bg-gradient-to-r from-blue-600 to-blue-800">
            <div className="absolute -bottom-16 left-8">
              <div className="relative w-32 h-32 rounded-full border-4 border-white overflow-hidden bg-white">
                <Image
                  src={profileData.image || "https://upload.wikimedia.org/wikipedia/commons/a/ac/Default_pfp.jpg"}
                  alt="Company Logo"
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
                  {profileData.companyName}
                </h1>
                {profileData.industry && (
                  <p className="text-gray-600">{profileData.industry}</p>
                )}
              </div>
            </div>

            {/* Main Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Contact Information */}
              <div className="space-y-4">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Company Information</h2>
                <div className="flex items-center text-gray-600">
                  <FiMail className="mr-3 text-blue-600" />
                  <span>{profileData.email}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <FiMapPin className="mr-3 text-blue-600" />
                  <span>{profileData.location}</span>
                </div>
                {profileData.website && (
                  <div className="flex items-center text-gray-600">
                    <FiGlobe className="mr-3 text-blue-600" />
                    <a 
                      href={profileData.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 transition-colors duration-200"
                    >
                      {profileData.website}
                    </a>
                  </div>
                )}
              </div>

              {/* Company Description */}
              <div className="space-y-4">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">About Us</h2>
                <div className="bg-gray-50 rounded-lg p-6">
                  <p className="text-gray-600">
                    {profileData.description || "No company description available."}
                  </p>
                </div>
              </div>
            </div>

            {/* Additional Sections */}
            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Company Overview</h3>
                <div className="space-y-3">
                  <div className="flex items-center text-gray-600">
                    <FiHome className="mr-3 text-blue-600" />
                    <span>{profileData.companyName}</span>
                  </div>
                  {profileData.industry && (
                    <div className="flex items-center text-gray-600">
                      <FiBriefcase className="mr-3 text-blue-600" />
                      <span>{profileData.industry}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Location</h3>
                <div className="flex items-center text-gray-600">
                  <FiMapPin className="mr-3 text-blue-600" />
                  <span>{profileData.location}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

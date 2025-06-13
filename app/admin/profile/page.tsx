'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { FiMail, FiUser, FiArrowLeft } from 'react-icons/fi';
import { useRouter } from 'next/navigation';

interface AdminProfile {
  name: string;
  email: string;
  image?: string;
}

export default function AdminProfilePage() {
  const router = useRouter();
  const [profileData, setProfileData] = useState<AdminProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch('/api/admin/profile');
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
          <div className="relative h-48 bg-gradient-to-r from-purple-600 to-purple-800">
            <div className="absolute -bottom-16 left-8">
              <div className="relative w-32 h-32 rounded-full border-4 border-white overflow-hidden bg-white">
                <Image
                  src={profileData.image || "https://upload.wikimedia.org/wikipedia/commons/a/ac/Default_pfp.jpg"}
                  alt="Profile"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          </div>

          {/* Profile Content */}
          <div className="pt-20 pb-8 px-8">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  {profileData.name}
                </h1>
                <p className="text-gray-600">Administrator</p>
              </div>
            </div>

            {/* Main Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Contact Information */}
              <div className="space-y-4">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Contact Information</h2>
                <div className="flex items-center text-gray-600">
                  <FiMail className="mr-3 text-purple-600" />
                  <span>{profileData.email}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <FiUser className="mr-3 text-purple-600" />
                  <span>Administrator</span>
                </div>
              </div>

              {/* Role Information */}
              <div className="space-y-4">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Role Information</h2>
                <div className="bg-gray-50 rounded-lg p-6">
                  <p className="text-gray-600">
                    As an administrator, you have full access to manage the platform, including:
                  </p>
                  <ul className="list-disc list-inside mt-2 text-gray-600">
                    <li>User approvals and management</li>
                    <li>School settings configuration</li>
                    <li>Platform analytics and monitoring</li>
                    <li>System maintenance and updates</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

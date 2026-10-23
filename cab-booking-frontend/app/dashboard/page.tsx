'use client';

import React, { useState } from 'react';
import { useUser } from '@clerk/nextjs';
import { User, Phone, Mail, Shield, Clock, MapPin, CheckCircle2 } from 'lucide-react';

export default function DashboardPage() {
  const { user, isLoaded } = useUser();
  const [phone, setPhone] = useState('');
  const [saved, setSaved] = useState(false);

  if (!isLoaded) {
    return <div className="min-h-screen flex items-center justify-center font-medium">Loading dashboard...</div>;
  }

  const handleUpdateProfile = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate updating profile in backend or Clerk
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="min-h-[calc(100vh-73px)] bg-gray-50 p-4 md:p-8">
      <div className="max-w-5xl mx-auto space-y-6">
        
        {/* Dashboard Header */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <img
              src={user?.imageUrl || 'https://via.placeholder.com/150'}
              alt="Profile"
              className="w-16 h-16 rounded-full object-cover border-2 border-black"
            />
            <div>
              <h1 className="text-2xl font-black text-gray-900">Welcome back, {user?.firstName || 'Rider'}!</h1>
              <p className="text-sm text-gray-500">{user?.primaryEmailAddress?.emailAddress}</p>
            </div>
          </div>
          <span className="bg-emerald-50 text-emerald-700 text-xs font-semibold px-4 py-1.5 rounded-full flex items-center gap-1">
            <Shield className="w-4 h-4" /> Verified Rider Account
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Profile Settings Form */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 md:col-span-1">
            <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <User className="w-5 h-5" /> Edit Profile
            </h2>

            {saved && (
              <div className="mb-4 bg-emerald-50 text-emerald-700 text-xs p-3 rounded-xl flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" /> Profile updated successfully!
              </div>
            )}

            <form onSubmit={handleUpdateProfile} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Full Name</label>
                <input
                  type="text"
                  disabled
                  value={`${user?.firstName || ''} ${user?.lastName || ''}`}
                  className="w-full px-3 py-2.5 bg-gray-100 rounded-xl text-sm text-gray-600 border border-gray-200 cursor-not-allowed"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Phone Number</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <Phone className="w-4 h-4 text-gray-400" />
                  </span>
                  <input
                    type="tel"
                    placeholder="Enter phone number"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 bg-gray-50 rounded-xl text-sm border border-gray-200 focus:bg-white focus:ring-2 focus:ring-black outline-none transition"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-black text-white py-2.5 rounded-xl font-bold text-sm hover:bg-gray-800 transition shadow-md"
              >
                Save Changes
              </button>
            </form>
          </div>

          {/* Ride Summary & Recent Activity */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 md:col-span-2 flex flex-col justify-between">
            <div>
              <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Clock className="w-5 h-5" /> Recent Rides
              </h2>

              <div className="space-y-3">
                <div className="p-4 bg-gray-50 rounded-xl border border-gray-100 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-black text-white rounded-full flex items-center justify-center font-bold text-xs">🚗</div>
                    <div>
                      <p className="text-sm font-bold text-gray-900">Downtown to Tech Park</p>
                      <p className="text-xs text-gray-500">Economy • Completed Today</p>
                    </div>
                  </div>
                  <span className="text-sm font-bold text-gray-900">₹349</span>
                </div>

                <div className="p-4 bg-gray-50 rounded-xl border border-gray-100 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-black text-white rounded-full flex items-center justify-center font-bold text-xs">🚗</div>
                    <div>
                      <p className="text-sm font-bold text-gray-900">Central Station to Airport</p>
                      <p className="text-xs text-gray-500">Comfort • 2 days ago</p>
                    </div>
                  </div>
                  <span className="text-sm font-bold text-gray-900">₹799</span>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
              <span>Total Rides: 12</span>
              <span className="font-semibold text-black cursor-pointer hover:underline">View All Ride History →</span>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
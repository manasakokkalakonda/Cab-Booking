'use client';

import React, { useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import { Car, MapPin, Navigation, CheckCircle2, Clock, Shield } from 'lucide-react';

interface Ride {
  _id: string;
  pickupLocation: string;
  dropoffLocation: string;
  rideType: string;
  fare: number;
  status: string;
}

export default function DriverDashboard() {
  const { user } = useUser();
  const [availableRides, setAvailableRides] = useState<Ride[]>([]);
  const [activeRide, setActiveRide] = useState<Ride | null>(null);
  const [loading, setLoading] = useState(false);

  // Fetch requested rides from backend
  const fetchRides = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/rides/requested');
      const data = await res.json();
      if (data.success) {
        setAvailableRides(data.rides);
      }
    } catch (err) {
      console.error('Error fetching rides:', err);
    }
  };

  useEffect(() => {
    fetchRides();
    const interval = setInterval(fetchRides, 5000); // Poll every 5s for MVP
    return () => clearInterval(interval);
  }, []);

  const handleAcceptRide = async (rideId: string) => {
    setLoading(true);
    try {
      const res = await fetch(`http://localhost:5000/api/rides/${rideId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'Accepted', driverId: user?.id || 'driver_123' }),
      });
      const data = await res.json();
      if (data.success) {
        setActiveRide(data.ride);
        setAvailableRides(availableRides.filter((r) => r._id !== rideId));
      }
    } catch (err) {
      console.error('Error accepting ride:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (rideId: string, newStatus: string) => {
    try {
      const res = await fetch(`http://localhost:5000/api/rides/${rideId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      const data = await res.json();
      if (data.success) {
        if (newStatus === 'Completed') {
          setActiveRide(null);
        } else {
          setActiveRide(data.ride);
        }
      }
    } catch (err) {
      console.error('Error updating status:', err);
    }
  };

  return (
    <div className="min-h-[calc(100vh-73px)] bg-gray-50 p-4 md:p-8">
      <div className="max-w-5xl mx-auto space-y-6">
        
        {/* Driver Header */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-black text-white rounded-full flex items-center justify-center font-bold text-xl">
              cab
            </div>
            <div>
              <h1 className="text-2xl font-black text-gray-900">Driver Dashboard</h1>
              <p className="text-sm text-gray-500">Accept ride requests and manage live trips.</p>
            </div>
          </div>
          <span className="bg-emerald-50 text-emerald-700 text-xs font-semibold px-4 py-1.5 rounded-full flex items-center gap-1">
            <Shield className="w-4 h-4" /> Online & Ready
          </span>
        </div>

        {/* Active Trip Section */}
        {activeRide && (
          <div className="bg-black text-white p-6 rounded-2xl shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <span className="bg-emerald-500 text-white text-xs font-bold px-3 py-1 rounded-full uppercase">
                Active Ride: {activeRide.status}
              </span>
              <span className="text-lg font-black">₹{activeRide.fare}</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-emerald-400" /> Pickup: {activeRide.pickupLocation}
              </div>
              <div className="flex items-center gap-2">
                <Navigation className="w-4 h-4 text-emerald-400" /> Drop-off: {activeRide.dropoffLocation}
              </div>
            </div>
            <div className="flex gap-3 pt-2">
              {activeRide.status === 'Accepted' && (
                <button
                  onClick={() => handleUpdateStatus(activeRide._id, 'In Progress')}
                  className="bg-white text-black px-5 py-2.5 rounded-xl font-bold text-xs hover:bg-gray-200 transition"
                >
                  Start Ride
                </button>
              )}
              {activeRide.status === 'In Progress' && (
                <button
                  onClick={() => handleUpdateStatus(activeRide._id, 'Completed')}
                  className="bg-emerald-500 text-white px-5 py-2.5 rounded-xl font-bold text-xs hover:bg-emerald-600 transition"
                >
                  Complete Ride
                </button>
              )}
            </div>
          </div>
        )}

        {/* Available Ride Requests */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Car className="w-5 h-5" /> Incoming Ride Requests
          </h2>

          {availableRides.length === 0 ? (
            <p className="text-sm text-gray-500 py-8 text-center">No ride requests available right now. Scanning for riders...</p>
          ) : (
            <div className="space-y-4">
              {availableRides.map((ride) => (
                <div key={ride._id} className="p-4 bg-gray-50 rounded-xl border border-gray-200 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-sm font-bold text-gray-900">
                      <span>{ride.rideType} Ride</span>
                      <span className="text-xs bg-gray-200 text-gray-700 px-2 py-0.5 rounded">₹{ride.fare}</span>
                    </div>
                    <p className="text-xs text-gray-600 flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-black" /> From: {ride.pickupLocation}
                    </p>
                    <p className="text-xs text-gray-600 flex items-center gap-1">
                      <Navigation className="w-3.5 h-3.5 text-gray-400" /> To: {ride.dropoffLocation}
                    </p>
                  </div>
                  <button
                    disabled={loading || activeRide !== null}
                    onClick={() => handleAcceptRide(ride._id)}
                    className="bg-black text-white px-5 py-2.5 rounded-xl font-bold text-xs hover:bg-gray-800 transition shadow-md disabled:opacity-50"
                  >
                    Accept Ride
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
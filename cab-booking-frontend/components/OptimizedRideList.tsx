'use client';

import React, { useState, useEffect, memo } from 'react';
import { ShieldCheck, Zap, Loader2, MapPin } from 'lucide-react';

interface RideItem {
  _id: string;
  pickupLocation: string;
  dropoffLocation: string;
  fare: number;
  status: string;
}

// Memoized sub-component to optimize frontend render performance
const RideCard = memo(({ ride }: { ride: RideItem }) => (
  <div className="p-4 bg-gray-50 rounded-xl border border-gray-200 flex items-center justify-between">
    <div className="space-y-1">
      <div className="flex items-center gap-2 text-sm font-bold text-gray-900">
        <MapPin className="w-4 h-4 text-black" />
        <span>{ride.pickupLocation} → {ride.dropoffLocation}</span>
      </div>
      <p className="text-xs text-gray-500">Status: {ride.status}</p>
    </div>
    <span className="text-sm font-black text-gray-900">₹{ride.fare}</span>
  </div>
));

RideCard.displayName = 'RideCard';

export default function OptimizedRideList() {
  const [rides, setRides] = useState<RideItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOptimizedRides = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/rides/optimized');
        const data = await res.json();
        if (data.success) {
          setRides(data.rides);
        }
      } catch (err) {
        console.error('Error fetching optimized rides:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchOptimizedRides();
  }, []);

  return (
    <div className="min-h-[calc(100vh-73px)] bg-gray-50 p-4 md:p-8 flex items-center justify-center">
      <div className="max-w-xl w-full bg-white p-8 rounded-2xl shadow-xl border border-gray-100 space-y-6">
        
        <div>
          <span className="bg-emerald-50 text-emerald-700 text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wider">
            Day 12: Security & Performance
          </span>
          <h2 className="text-2xl font-black text-gray-900 mt-3 mb-1">Optimized Dashboard</h2>
          <p className="text-sm text-gray-500">Secured via Helmet/Rate-limiting and optimized via lean database queries[cite: 7].</p>
        </div>

        <div className="flex items-center gap-4 p-4 bg-emerald-50 rounded-xl border border-emerald-200 text-xs text-emerald-800">
          <ShieldCheck className="w-6 h-6 flex-shrink-0" />
          <span>API endpoints secured and frontend render performance optimized[cite: 7].</span>
        </div>

        <div className="space-y-3">
          {loading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
            </div>
          ) : rides.length === 0 ? (
            <p className="text-xs text-gray-500 text-center py-4">No optimized rides found.</p>
          ) : (
            rides.map((ride) => <RideCard key={ride._id} ride={ride} />)
          )}
        </div>

      </div>
    </div>
  );
}
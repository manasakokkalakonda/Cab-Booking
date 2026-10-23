'use client';

import React, { useState } from 'react';
import { useUser } from '@clerk/nextjs';
import { MapPin, Navigation, Shield, CreditCard, Loader2, CheckCircle2 } from 'lucide-react';

export default function RideBookingPage() {
  const { user } = useUser();
  const [pickup, setPickup] = useState('');
  const [dropoff, setDropoff] = useState('');
  const [rideType, setRideType] = useState('Economy');
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const calculateFare = (type: string) => {
    if (type === 'Economy') return 299;
    if (type === 'Comfort') return 499;
    return 899;
  };

  const handleRequestRide = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pickup || !dropoff) {
      alert('Please enter both pickup and drop-off locations.');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('http://localhost:5000/api/rides', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          riderId: user?.id || 'guest_rider',
          pickupLocation: pickup,
          dropoffLocation: dropoff,
          rideType,
          fare: calculateFare(rideType),
        }),
      });

      const data = await response.json();
      if (data.success) {
        setSuccessMessage('Ride requested successfully! Searching for nearby drivers...');
        setTimeout(() => setSuccessMessage(''), 5000);
      } else {
        alert('Failed to request ride');
      }
    } catch (error) {
      console.error('Error requesting ride:', error);
      alert('Error connecting to backend server.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-73px)] bg-gray-50 p-4 md:p-8 flex items-center justify-center">
      <div className="max-w-6xl w-full grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Ride Request Form */}
        <div className="bg-white p-6 rounded-2xl shadow-xl border border-gray-100 flex flex-col justify-between">
          <div>
            <span className="bg-emerald-50 text-emerald-700 text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wider">
              Day 4: Ride Request System
            </span>
            <h2 className="text-2xl font-black text-gray-900 mt-3 mb-1">Where can we take you?</h2>
            <p className="text-sm text-gray-500 mb-6">Enter locations and pick your ride preference.</p>

            {successMessage && (
              <div className="mb-4 bg-emerald-50 text-emerald-700 text-xs p-3 rounded-xl flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 flex-shrink-0" /> {successMessage}
              </div>
            )}

            <form onSubmit={handleRequestRide} className="space-y-4">
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <MapPin className="w-5 h-5 text-black" />
                </span>
                <input
                  type="text"
                  placeholder="Enter pickup location"
                  value={pickup}
                  onChange={(e) => setPickup(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-gray-100 rounded-xl text-sm font-medium focus:bg-white focus:ring-2 focus:ring-black outline-none transition"
                />
              </div>

              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <Navigation className="w-5 h-5 text-gray-400" />
                </span>
                <input
                  type="text"
                  placeholder="Where to? (Drop-off)"
                  value={dropoff}
                  onChange={(e) => setDropoff(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-gray-100 rounded-xl text-sm font-medium focus:bg-white focus:ring-2 focus:ring-black outline-none transition"
                />
              </div>

              {/* Ride Type Selector */}
              <div className="grid grid-cols-3 gap-2 pt-2">
                {['Economy', 'Comfort', 'Luxury'].map((type) => (
                  <button
                    type="button"
                    key={type}
                    onClick={() => setRideType(type)}
                    className={`py-3 px-2 rounded-xl border text-xs font-semibold transition flex flex-col items-center gap-1 ${
                      rideType === type 
                        ? 'border-black bg-black text-white shadow-md' 
                        : 'border-gray-200 bg-gray-50 text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <span>{type}</span>
                    <span className="opacity-75">₹{calculateFare(type)}</span>
                  </button>
                ))}
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full mt-4 bg-black text-white py-3.5 rounded-xl font-bold text-sm hover:bg-gray-800 transition shadow-lg flex items-center justify-center gap-2"
              >
                {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                {loading ? 'Processing...' : 'Request Cab'}
              </button>
            </form>
          </div>

          <div className="mt-6 border-t pt-4 flex items-center justify-between text-xs text-gray-500">
            <span className="flex items-center gap-1"><Shield className="w-4 h-4 text-emerald-600" /> Secure GPS</span>
            <span className="flex items-center gap-1"><CreditCard className="w-4 h-4" /> Instant Matching</span>
          </div>
        </div>

        {/* Map Integration View / Placeholder */}
        <div className="md:col-span-2 bg-gray-200 rounded-2xl shadow-inner relative overflow-hidden flex items-center justify-center min-h-[400px]">
          <div className="absolute inset-0 opacity-40 bg-[radial-gradient(#cbd5e1_1px,transparent_1px)] [background-size:16px_16px]"></div>
          
          <div className="z-10 bg-white/90 backdrop-blur-md px-6 py-4 rounded-2xl shadow-xl flex items-center gap-4 border border-white text-center">
            <div className="w-10 h-10 bg-black text-white rounded-full flex items-center justify-center font-bold">🗺️</div>
            <div className="text-left">
              <p className="text-sm font-bold text-gray-900">Map Integration Ready</p>
              <p className="text-xs text-gray-500">Integrate Google Maps API or Leaflet.js here for live route visualization[cite: 16].</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
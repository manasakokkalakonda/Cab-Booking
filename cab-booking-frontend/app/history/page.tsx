'use client';

import React, { useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import { Clock, MapPin, Download, Mail, CheckCircle2, Loader2 } from 'lucide-react';

interface Ride {
  _id: string;
  pickupLocation: string;
  dropoffLocation: string;
  rideType: string;
  fare: number;
  status: string;
  createdAt: string;
}

export default function RideHistoryPage() {
  const { user } = useUser();
  const [rides, setRides] = useState<Ride[]>([]);
  const [loading, setLoading] = useState(true);
  const [receiptLoading, setReceiptLoading] = useState<string | null>(null);
  const [msg, setMsg] = useState('');

  useEffect(() => {
    const fetchHistory = async () => {
      if (!user) return;
      try {
        const res = await fetch(`http://localhost:5000/api/rides/history/${user.id}`);
        const data = await res.json();
        if (data.success) {
          setRides(data.rides);
        }
      } catch (err) {
        console.error('Error fetching ride history:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, [user]);

  const handleSendReceipt = async (ride: Ride) => {
    setReceiptLoading(ride._id);
    try {
      const res = await fetch('http://localhost:5000/api/rides/send-receipt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: user?.primaryEmailAddress?.emailAddress,
          rideDetails: ride,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setMsg('Receipt successfully sent to your email!');
        setTimeout(() => setMsg(''), 4000);
      }
    } catch (err) {
      console.error('Error sending receipt:', err);
    } finally {
      setReceiptLoading(null);
    }
  };

  return (
    <div className="min-h-[calc(100vh-73px)] bg-gray-50 p-4 md:p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between">
          <div>
            <span className="bg-emerald-50 text-emerald-700 text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wider">
              Day 9: Ride History & Receipts
            </span>
            <h1 className="text-2xl font-black text-gray-900 mt-2">Your Past Rides</h1>
            <p className="text-sm text-gray-500">View previous trips and download or email receipts[cite: 6, 7].</p>
          </div>
        </div>

        {msg && (
          <div className="bg-emerald-50 text-emerald-700 text-xs p-4 rounded-xl flex items-center gap-2 border border-emerald-200">
            <CheckCircle2 className="w-4 h-4 flex-shrink-0" /> {msg}
          </div>
        )}

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
            </div>
          ) : rides.length === 0 ? (
            <p className="text-sm text-gray-500 py-8 text-center">No past rides found in your history.</p>
          ) : (
            <div className="space-y-4">
              {rides.map((ride) => (
                <div key={ride._id} className="p-4 bg-gray-50 rounded-xl border border-gray-200 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-sm font-bold text-gray-900">
                      <span>{ride.rideType} Trip</span>
                      <span className="text-xs bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded">₹{ride.fare}</span>
                      <span className="text-xs text-gray-400">• {new Date(ride.createdAt).toLocaleDateString()}</span>
                    </div>
                    <p className="text-xs text-gray-600 flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-black" /> From: {ride.pickupLocation}
                    </p>
                    <p className="text-xs text-gray-600 flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-gray-400" /> To: {ride.dropoffLocation}
                    </p>
                  </div>
                  <button
                    onClick={() => handleSendReceipt(ride)}
                    disabled={receiptLoading === ride._id}
                    className="bg-black text-white px-4 py-2.5 rounded-xl font-bold text-xs hover:bg-gray-800 transition shadow-md flex items-center gap-2 disabled:opacity-50"
                  >
                    {receiptLoading === ride._id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Mail className="w-3.5 h-3.5" />}
                    Email Receipt
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
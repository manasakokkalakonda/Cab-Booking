'use client';

import React, { useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import { CheckCircle2, AlertCircle, RefreshCw, Server, ShieldCheck } from 'lucide-react';

export default function TestingDashboard() {
  const { user, isLoaded } = useUser();
  const [backendStatus, setBackendStatus] = useState<'checking' | 'online' | 'offline'>('checking');

  const checkBackendHealth = async () => {
    setBackendStatus('checking');
    try {
      const res = await fetch('http://localhost:5000/api/health');
      if (res.ok) {
        setBackendStatus('online');
      } else {
        setBackendStatus('offline');
      }
    } catch {
      setBackendStatus('offline');
    }
  };

  useEffect(() => {
    checkBackendHealth();
  }, []);

  return (
    <div className="min-h-[calc(100vh-73px)] bg-gray-50 p-4 md:p-8 flex items-center justify-center">
      <div className="max-w-xl w-full bg-white p-8 rounded-2xl shadow-xl border border-gray-100 space-y-6">
        
        <div>
          <span className="bg-emerald-50 text-emerald-700 text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wider">
            Day 7: Testing & Buffer Day
          </span>
          <h2 className="text-2xl font-black text-gray-900 mt-3 mb-1">System Diagnostics</h2>
          <p className="text-sm text-gray-500">Verifying core integrations before moving to Week 2 payments and reviews[cite: 6].</p>
        </div>

        <div className="space-y-4">
          {/* Clerk Auth Check */}
          <div className="p-4 bg-gray-50 rounded-xl border border-gray-200 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <ShieldCheck className="w-5 h-5 text-black" />
              <div>
                <p className="text-sm font-bold text-gray-900">Clerk Authentication</p>
                <p className="text-xs text-gray-500">{isLoaded && user ? `Signed in as ${user.fullName}` : 'Not signed in'}</p>
              </div>
            </div>
            <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${isLoaded && user ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}`}>
              {isLoaded && user ? 'Connected' : 'Guest'}
            </span>
          </div>

          {/* Backend Connection Check */}
          <div className="p-4 bg-gray-50 rounded-xl border border-gray-200 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Server className="w-5 h-5 text-black" />
              <div>
                <p className="text-sm font-bold text-gray-900">Backend API Server</p>
                <p className="text-xs text-gray-500">http://localhost:5000</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${backendStatus === 'online' ? 'bg-emerald-100 text-emerald-800' : backendStatus === 'offline' ? 'bg-rose-100 text-rose-800' : 'bg-gray-200 text-gray-700'}`}>
                {backendStatus.toUpperCase()}
              </span>
              <button onClick={checkBackendHealth} className="p-1.5 bg-white rounded-lg border hover:bg-gray-100 transition">
                <RefreshCw className="w-3.5 h-3.5 text-gray-600" />
              </button>
            </div>
          </div>
        </div>

        <div className="pt-4 border-t text-xs text-gray-400 text-center">
          Week 1 completed successfully! Ready for Stripe integration in Week 2[cite: 6].
        </div>

      </div>
    </div>
  );
}
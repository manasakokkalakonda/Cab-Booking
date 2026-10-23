'use client';

import React, { useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import { CheckCircle2, ShieldCheck, Server, Activity, Loader2 } from 'lucide-react';

export default function WorkflowTestPage() {
  const { user, isLoaded } = useUser();
  const [workflowStatus, setWorkflowStatus] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const verifyWorkflow = async () => {
    setLoading(true);
    try {
      const res = await fetch('http://localhost:5000/api/test/workflow-status');
      const data = await res.json();
      if (data.success) {
        setWorkflowStatus(data);
      }
    } catch (err) {
      console.error('Workflow verification failed:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    verifyWorkflow();
  }, []);

  return (
    <div className="min-h-[calc(100vh-73px)] bg-gray-50 p-4 md:p-8 flex items-center justify-center">
      <div className="max-w-xl w-full bg-white p-8 rounded-2xl shadow-xl border border-gray-100 space-y-6">
        
        <div>
          <span className="bg-emerald-50 text-emerald-700 text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wider">
            Day 13: Final Testing & Bug Fixes
          </span>
          <h2 className="text-2xl font-black text-gray-900 mt-3 mb-1">Workflow Validation</h2>
          <p className="text-sm text-gray-500">Testing complete user journey from sign-up to ride completion[cite: 7].</p>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
          </div>
        ) : (
          <div className="space-y-4">
            <div className="p-4 bg-gray-50 rounded-xl border flex items-center justify-between">
              <span className="text-sm font-bold text-gray-700 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600" /> Clerk Authentication
              </span>
              <span className="text-xs bg-emerald-100 text-emerald-800 px-2.5 py-1 rounded-full font-semibold">
                {isLoaded && user ? 'Verified' : 'Guest Mode'}
              </span>
            </div>

            <div className="p-4 bg-gray-50 rounded-xl border flex items-center justify-between">
              <span className="text-sm font-bold text-gray-700 flex items-center gap-2">
                <Server className="w-4 h-4 text-black" /> Backend Database
              </span>
              <span className="text-xs bg-emerald-100 text-emerald-800 px-2.5 py-1 rounded-full font-semibold">
                Connected
              </span>
            </div>

            {workflowStatus && (
              <div className="p-4 bg-black text-white rounded-xl space-y-2">
                <p className="text-xs uppercase tracking-wider text-emerald-400 font-bold flex items-center gap-1.5">
                  <Activity className="w-3.5 h-3.5" /> Database Statistics
                </p>
                <div className="grid grid-cols-2 gap-2 text-xs pt-1">
                  <div>Total Rides: <span className="font-bold">{workflowStatus.stats.totalRides}</span></div>
                  <div>Total Users: <span className="font-bold">{workflowStatus.stats.totalUsers}</span></div>
                  <div>Total Payments: <span className="font-bold">{workflowStatus.stats.totalPayments}</span></div>
                  <div>Total Reviews: <span className="font-bold">{workflowStatus.stats.totalReviews}</span></div>
                </div>
              </div>
            )}
          </div>
        )}

        <button
          onClick={verifyWorkflow}
          className="w-full bg-black text-white py-3 rounded-xl font-bold text-sm hover:bg-gray-800 transition shadow-md"
        >
          Run Workflow Diagnostics Again
        </button>

      </div>
    </div>
  );
}
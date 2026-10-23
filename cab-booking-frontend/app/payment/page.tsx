'use client';

import React, { useState } from 'react';
import { useUser } from '@clerk/nextjs';
import { CreditCard, ShieldCheck, Lock, CheckCircle2, Loader2 } from 'lucide-react';

export default function StripePaymentPage() {
  const { user } = useUser();
  const [loading, setLoading] = useState(false);
  const [paid, setPaid] = useState(false);
  const rideFare = 499; // Example fare in INR

  const handleSimulateStripePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Call backend to create payment intent
      const res = await fetch('http://localhost:5000/api/create-payment-intent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: rideFare,
          rideId: '65f1a2b3c4d5e6f7a8b9c0d1', // Sample Ride ID
          userId: user?.id || 'guest_user',
        }),
      });

      const data = await res.json();
      if (data.success) {
        // In production, load Stripe Elements and confirm payment here using data.clientSecret
        setTimeout(() => {
          setPaid(true);
          setLoading(false);
        }, 1500);
      } else {
        alert('Payment initialization failed.');
        setLoading(false);
      }
    } catch (err) {
      console.error('Payment Error:', err);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-73px)] bg-gray-50 p-4 md:p-8 flex items-center justify-center">
      <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-xl border border-gray-100 space-y-6">
        
        <div>
          <span className="bg-emerald-50 text-emerald-700 text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wider">
            Day 8: Stripe Payments
          </span>
          <h2 className="text-2xl font-black text-gray-900 mt-3 mb-1">Complete Your Payment</h2>
          <p className="text-sm text-gray-500">Secure end-to-end encryption powered by Stripe[cite: 1, 10].</p>
        </div>

        {paid ? (
          <div className="bg-emerald-50 border border-emerald-200 p-6 rounded-2xl text-center space-y-3">
            <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
            <h3 className="font-bold text-gray-900 text-lg">Payment Successful!</h3>
            <p className="text-xs text-gray-600">Your ride receipt has been generated and saved[cite: 10].</p>
          </div>
        ) : (
          <form onSubmit={handleSimulateStripePayment} className="space-y-4">
            <div className="p-4 bg-gray-50 rounded-xl border flex items-center justify-between">
              <span className="text-sm font-medium text-gray-600">Total Ride Fare</span>
              <span className="text-xl font-black text-gray-900">₹{rideFare}</span>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Card Information</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <CreditCard className="w-4 h-4 text-gray-400" />
                </span>
                <input
                  type="text"
                  placeholder="4242 •••• •••• 4242"
                  disabled
                  className="w-full pl-10 pr-4 py-3 bg-gray-100 rounded-xl text-sm font-medium border border-gray-200 text-gray-500 cursor-not-allowed"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-black text-white py-3.5 rounded-xl font-bold text-sm hover:bg-gray-800 transition shadow-lg flex items-center justify-center gap-2"
            >
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              {loading ? 'Processing Payment...' : `Pay ₹${rideFare} with Stripe`}
            </button>
          </form>
        )}

        <div className="pt-4 border-t flex items-center justify-center gap-2 text-xs text-gray-400">
          <ShieldCheck className="w-4 h-4 text-emerald-600" /> PCI-DSS Compliant & Secure
        </div>

      </div>
    </div>
  );
}
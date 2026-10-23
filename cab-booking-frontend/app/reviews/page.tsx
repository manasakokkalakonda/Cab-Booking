'use client';

import React, { useState } from 'react';
import { useUser } from '@clerk/nextjs';
import { Star, CheckCircle2, Loader2, MessageSquare } from 'lucide-react';

export default function RatingsPage() {
  const { user } = useUser();
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch('http://localhost:5000/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          rideId: '65f1a2b3c4d5e6f7a8b9c0d1', // Sample Ride ID
          driverId: 'driver_123',
          riderId: user?.id || 'guest_rider',
          rating,
          comment,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setSuccess(true);
        setTimeout(() => setSuccess(false), 4000);
        setComment('');
      }
    } catch (err) {
      console.error('Error submitting review:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-73px)] bg-gray-50 p-4 md:p-8 flex items-center justify-center">
      <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-xl border border-gray-100 space-y-6">
        
        <div>
          <span className="bg-emerald-50 text-emerald-700 text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wider">
            Day 10: Ratings & Reviews
          </span>
          <h2 className="text-2xl font-black text-gray-900 mt-3 mb-1">Rate Your Driver</h2>
          <p className="text-sm text-gray-500">Your feedback helps improve our community safety[cite: 2, 7].</p>
        </div>

        {success && (
          <div className="bg-emerald-50 text-emerald-700 text-xs p-4 rounded-xl flex items-center gap-2 border border-emerald-200">
            <CheckCircle2 className="w-4 h-4 flex-shrink-0" /> Review submitted successfully! Thank you.
          </div>
        )}

        <form onSubmit={handleSubmitReview} className="space-y-4">
          <div className="flex justify-center gap-2 py-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                type="button"
                key={star}
                onClick={() => setRating(star)}
                className="focus:outline-none transition transform hover:scale-110"
              >
                <Star
                  className={`w-8 h-8 ${
                    star <= rating ? 'text-amber-400 fill-amber-400' : 'text-gray-300'
                  }`}
                />
              </button>
            ))}
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">Optional Feedback</label>
            <div className="relative">
              <span className="absolute top-3 left-3 pointer-events-none">
                <MessageSquare className="w-4 h-4 text-gray-400" />
              </span>
              <textarea
                rows={3}
                placeholder="How was your trip? Write a comment..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 rounded-xl text-sm border border-gray-200 focus:bg-white focus:ring-2 focus:ring-black outline-none transition resize-none"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-black text-white py-3.5 rounded-xl font-bold text-sm hover:bg-gray-800 transition shadow-lg flex items-center justify-center gap-2"
          >
            {loading && <Loader2 className="w-4 h-4 animate-spin" />}
            {loading ? 'Submitting...' : 'Submit Review'}
          </button>
        </form>

        <div className="pt-4 border-t text-center text-xs text-gray-400">
          Driver overall rating: <span className="font-bold text-gray-900">4.8 ⭐ (120+ reviews)</span>[cite: 7]
        </div>

      </div>
    </div>
  );
}
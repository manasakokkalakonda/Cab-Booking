'use client';

import React, { useEffect, useState } from 'react';
import { Bell, CheckCircle2, AlertCircle } from 'lucide-react';

interface Notification {
  message: string;
  status: string;
}

export default function RideNotifier() {
  const [notification, setNotification] = useState<Notification | null>(null);

  useEffect(() => {
    // Establish WebSocket connection for real-time updates
    const ws = new WebSocket('ws://localhost:5000');

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === 'RIDE_NOTIFICATION' || data.type === 'RIDE_ACCEPTED') {
        setNotification({
          message: data.message || 'Your ride status has been updated in real-time!',
          status: data.status || 'Updated'
        });

        // Auto-dismiss notification after 6 seconds
        setTimeout(() => setNotification(null), 6000);
      }
    };

    return () => {
      ws.close();
    };
  }, []);

  if (!notification) return null;

  return (
    <div className="fixed top-5 right-5 z-50 bg-black text-white px-5 py-4 rounded-2xl shadow-2xl border border-gray-800 flex items-center gap-3 animate-slide-in">
      <div className="w-8 h-8 bg-emerald-500 text-white rounded-full flex items-center justify-center font-bold flex-shrink-0">
        <Bell className="w-4 h-4" />
      </div>
      <div>
        <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-400">Live Ride Notification</h4>
        <p className="text-sm font-medium">{notification.message}</p>
      </div>
    </div>
  );
}
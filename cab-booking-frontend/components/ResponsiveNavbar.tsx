'use client';

import React, { useState } from 'react';
import { SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/nextjs';
import { Menu, X, Car, Clock, User, Shield } from 'lucide-react';
import Link from 'next/link';

export default function ResponsiveNavbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-white border-b border-gray-100 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          
          {/* Logo */}
          <div className="flex items-center gap-2">
            <Link href="/" className="text-xl font-black tracking-tight text-black flex items-center gap-1.5">
              Cab<span className="bg-black text-white px-2 py-0.5 rounded text-sm">Go</span>
            </Link>
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center space-x-6 text-sm font-semibold text-gray-600">
            <Link href="/" className="hover:text-black transition">Book Ride</Link>
            <Link href="/dashboard" className="hover:text-black transition">Dashboard</Link>
            <Link href="/history" className="hover:text-black transition">Ride History</Link>
          </div>

          {/* Auth & Mobile Menu Button */}
          <div className="flex items-center gap-4">
            <SignedOut>
              <SignInButton mode="modal">
                <button className="bg-black text-white px-4 py-2 rounded-full font-medium text-xs sm:text-sm hover:bg-gray-800 transition shadow-sm">
                  Sign In
                </button>
              </SignInButton>
            </SignedOut>
            <SignedIn>
              <UserButton afterSignOutUrl="/" />
            </SignedIn>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100 focus:outline-none"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      {isOpen && (
        <div className="md:hidden bg-white border-b border-gray-100 px-4 pt-2 pb-4 space-y-2">
          <Link
            href="/"
            onClick={() => setIsOpen(false)}
            className="block px-3 py-2 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100"
          >
            Book Ride
          </Link>
          <Link
            href="/dashboard"
            onClick={() => setIsOpen(false)}
            className="block px-3 py-2 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100"
          >
            Dashboard
          </Link>
          <Link
            href="/history"
            onClick={() => setIsOpen(false)}
            className="block px-3 py-2 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100"
          >
            Ride History
          </Link>
        </div>
      )}
    </nav>
  );
}
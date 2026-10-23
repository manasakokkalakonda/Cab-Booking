import { ClerkProvider, SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/nextjs';
import './globals.css';

export const metadata = {
  title: 'Cab Booking App - Day 1',
  description: 'Project setup and authentication with Clerk and Tailwind CSS',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body>
          <header className="flex justify-between items-center px-6 py-4 bg-white shadow-sm border-b border-gray-100">
            <h1 className="text-xl font-bold tracking-tight text-black flex items-center gap-2">
              Cab<span className="bg-black text-white px-2 py-0.5 rounded text-sm">Go</span>
            </h1>
            <div>
              <SignedOut>
                <SignInButton mode="modal">
                  <button className="bg-black text-white px-5 py-2 rounded-full font-medium hover:bg-gray-800 transition shadow-sm">
                    Sign In / Sign Up
                  </button>
                </SignInButton>
              </SignedOut>
              <SignedIn>
                <UserButton afterSignOutUrl="/" />
              </SignedIn>
            </div>
          </header>
          <main>{children}</main>
        </body>
      </html>
    </ClerkProvider>
  );
}
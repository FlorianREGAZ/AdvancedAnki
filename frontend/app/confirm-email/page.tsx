'use client';

import Link from 'next/link';

export default function ConfirmEmailPage() {
  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-lg">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900">Check your email</h1>
          <p className="mt-4 text-gray-600">
            We've sent you a confirmation link. Please check your email and click the link to verify your account.
          </p>
          <div className="mt-8">
            <Link
              href="/login"
              className="text-sm font-medium text-blue-600 hover:text-blue-500"
            >
              Return to login
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
} 
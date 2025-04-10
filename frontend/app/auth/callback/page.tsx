'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { supabase } from '../../lib/supabase';

export default function AuthCallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const handleEmailConfirmation = async () => {
      const code = searchParams.get('code');
      const next = searchParams.get('next') || '/project';

      if (code) {
        try {
          // Exchange the code for a session
          const { error } = await supabase.auth.exchangeCodeForSession(code);
          
          if (error) {
            console.error('Error confirming email:', error);
            router.push('/login?error=confirmation_failed');
            return;
          }

          // Force a refresh of the page to ensure the session cookie is properly set
          router.refresh();
          
          // Redirect to the next page or project page
          router.push(next);
        } catch (error) {
          console.error('Error during email confirmation:', error);
          router.push('/login?error=confirmation_failed');
        }
      } else {
        // No code present, redirect to login
        router.push('/login');
      }
    };

    handleEmailConfirmation();
  }, [router, searchParams]);

  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-lg">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900">Confirming your email</h1>
          <p className="mt-4 text-gray-600">
            Please wait while we confirm your email address...
          </p>
          <div className="mt-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
          </div>
        </div>
      </div>
    </main>
  );
}

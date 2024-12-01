// app/verify-email/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { verifyEmail } from '@/lib/api-client';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

export default function VerifyEmail() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('Verifying your email...');

  useEffect(() => {
    const verify = async () => {
      const token = searchParams.get('token');
      
      if (!token) {
        setStatus('error');
        setMessage('Invalid verification link.');
        return;
      }

      try {
        const response = await verifyEmail(token);
        setStatus('success');
        setMessage(response.data.message || 'Your email has been verified successfully!');
      } catch (error: any) {
        setStatus('error');
        const errorMessage = error.response?.data?.detail;
        setMessage(typeof errorMessage === 'string' 
          ? errorMessage 
          : 'Verification failed. Please try again.');
      }
    };

    verify();
  }, [searchParams]);


  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="max-w-md w-full mx-auto p-8 bg-white rounded-lg shadow-lg text-center space-y-6">
        {status === 'loading' && (
          <Loader2 className="animate-spin h-8 w-8 mx-auto text-primary" />
        )}
        
        {status === 'success' && (
          <div className="space-y-6">
            <div className="h-12 w-12 mx-auto bg-green-100 rounded-full flex items-center justify-center">
              <svg
                className="h-6 w-6 text-green-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Email Verified!</h2>
          </div>
        )}

        {status === 'error' && (
          <div className="space-y-6">
            <div className="h-12 w-12 mx-auto bg-red-100 rounded-full flex items-center justify-center">
              <svg
                className="h-6 w-6 text-red-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Verification Failed</h2>
          </div>
        )}

        <p className="text-gray-600">{message}</p>

        <div className="pt-6">
          <Button
            onClick={() => router.push(status === 'success' ? '/auth/login' : '/auth/register')}
            className="w-full"
          >
            {status === 'success' ? 'Go to Login' : 'Back to Registration'}
          </Button>
        </div>
      </div>
    </div>
  );
}
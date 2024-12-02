'use client';

import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import axios, { resendVerification } from '@/lib/api-client';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function UnverifiedEmail() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get('email');
  const [isResending, setIsResending] = useState(false);
  const [message, setMessage] = useState('');
  const { toast } = useToast();

  const handleResendEmail = async () => {
    if (!email) return;
    
    setIsResending(true);
    try {
      console.log('Attempting to resend verification email to:', email);
      const response = await resendVerification(email);
      console.log('Resend response:', response);
      setMessage('Verification email sent! Please check your inbox.');
      toast({
        title: "Email sent",
        description: "Please check your inbox for the verification link.",
      });
    } catch (error: any) {
      console.error('Resend error:', error);
      const errorMessage = error.response?.data?.detail || "Failed to send email";
      setMessage(errorMessage);
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive"
      });
    } finally {
      setIsResending(false);
    }
  };

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <div className="min-h-screen flex items-center justify-center">
        <div className="max-w-md w-full mx-auto p-8 bg-white rounded-lg shadow-lg text-center space-y-6">
          <div className="h-12 w-12 mx-auto bg-yellow-100 rounded-full flex items-center justify-center">
            <svg
              className="h-6 w-6 text-yellow-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>

          <h2 className="text-2xl font-bold text-gray-900">Email Not Verified</h2>
          
          <p className="text-gray-600">
            Please verify your email address ({email}) to continue.
          </p>

          {message && (
            <p className={`text-sm ${message.includes('Failed') ? 'text-red-500' : 'text-green-500'}`}>
              {message}
            </p>
          )}

          <div className="space-y-4">
            <Button
              onClick={handleResendEmail}
              className="w-full"
              disabled={isResending}
            >
              {isResending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Sending...
                </>
              ) : (
                'Resend Verification Email'
              )}
            </Button>

            <Button
              variant="outline"
              onClick={() => router.push('/auth/login')}
              className="w-full"
            >
              Back to Login
            </Button>
          </div>
        </div>
      </div>
    </Suspense>
  );
}

import React, { useState } from 'react';
import { useApiSettings } from '../hooks/useApiSettings';
import { sendPasswordResetEmail } from '../services/emailService';
import { Link } from 'react-router-dom';
import { useSiteSettings } from '../hooks/useSiteSettings';

const ForgotPasswordPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const { apiSettings } = useApiSettings();
  const { siteSettings } = useSiteSettings();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendPasswordResetEmail(email, apiSettings, siteSettings.siteName);
    setSubmitted(true);
  };

  const inputStyles = "mt-1 block w-full rounded-md bg-white border-silver shadow-sm focus:border-dusty-blue focus:ring-dusty-blue sm:text-sm text-deep-navy px-3 py-2";
  const labelStyles = "block text-sm font-medium text-deep-navy/90";

  return (
    <div className="animate-fade-in bg-white p-8 sm:p-12 rounded-lg shadow-sm border border-silver max-w-md mx-auto">
      <h1 className="text-4xl font-serif font-bold text-deep-navy text-center mb-2">Reset Password</h1>
      

      {submitted ? (
        <div className="text-center">
           <p className="text-lg text-soft-gray text-center mb-8">
            Instructions Sent
          </p>
          <div className="bg-pale-sky/50 p-8 rounded-lg border border-silver">
            <p className="text-deep-navy/90">If an account with the email <strong>{email}</strong> exists, a password reset link has been sent. Please check your inbox.</p>
          </div>
        </div>
      ) : (
        <>
        <p className="text-lg text-soft-gray text-center mb-8">
            Enter your email to receive a reset link.
        </p>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className={labelStyles}>Email Address</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className={inputStyles}
              autoComplete="email"
            />
          </div>
          <div>
            <button
              type="submit"
              className="w-full inline-flex justify-center py-2 px-6 border border-transparent shadow-sm text-base font-medium rounded-md text-white bg-dusty-blue hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-dusty-blue"
            >
              Send Reset Link
            </button>
          </div>
        </form>
        </>
      )}
       <p className="mt-6 text-center text-sm text-soft-gray">
        Remember your password?{' '}
        <Link to="/login" className="font-medium text-dusty-blue hover:text-deep-navy">
          Log in
        </Link>
      </p>
    </div>
  );
};

export default ForgotPasswordPage;
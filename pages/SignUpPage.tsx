
import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useGuestMemorial } from '../hooks/useGuestMemorial';
import { useMemorials } from '../hooks/useMemorials';
import { Memorial } from '../types';
import { useApiSettings } from '../hooks/useApiSettings';
import { sendWelcomeEmail } from '../services/emailService';
import { useSiteSettings } from '../hooks/useSiteSettings';

const SignUpPage: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { signup, googleLogin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { guestMemorialData, clearGuestMemorial } = useGuestMemorial();
  const { addMemorial } = useMemorials();
  const { apiSettings } = useApiSettings();
  const { siteSettings } = useSiteSettings();

  const handlePostLogin = (user: any) => {
    if (location.state?.fromCreate && guestMemorialData) {
        // Check if the memorial is complete enough to be published (e.g. has a profile image)
        if (guestMemorialData.profileImage && guestMemorialData.firstName && guestMemorialData.lastName && guestMemorialData.theme) {
            const memorialToCreate: Omit<Memorial, 'id' | 'slug' | 'tributes'> = {
              ...guestMemorialData,
              userId: user.id,
              status: 'draft',
            };
            addMemorial(memorialToCreate);
            clearGuestMemorial();
            navigate('/dashboard');
        } else {
            // Data is incomplete (e.g. user just clicked "Save Progress"), so redirect back to editor to finish
            navigate('/create');
        }
    } else {
      navigate('/dashboard');
    }
  }

  const handleSignup = async (signupFn: () => Promise<any>) => {
    setError('');
    try {
      const newUser = await signupFn();
      
      sendWelcomeEmail(newUser, apiSettings, siteSettings.siteName);
      handlePostLogin(newUser);

    } catch (err: any) {
      setError(err.message || 'Failed to sign up. Please try again.');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSignup(() => signup(name, email, password));
  };
  
  const handleGoogleSubmit = () => {
    handleSignup(googleLogin);
  };
  
  const inputStyles = "mt-1 block w-full rounded-md bg-white border-silver shadow-sm focus:border-dusty-blue focus:ring-dusty-blue sm:text-sm text-deep-navy px-3 py-2";
  const labelStyles = "block text-sm font-medium text-deep-navy/90";

  return (
    <div className="animate-fade-in bg-white p-8 sm:p-12 rounded-lg shadow-sm border border-silver max-w-md mx-auto">
      <h1 className="text-4xl font-serif font-bold text-deep-navy text-center mb-2">Create an Account</h1>
      <p className="text-lg text-soft-gray text-center mb-8">
        Join our community to create and manage memorials.
      </p>
      {error && <p className="text-red-500 text-center mb-4">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="name" className={labelStyles}>Full Name</label>
          <input type="text" id="name" value={name} onChange={(e) => setName(e.target.value)} required className={inputStyles} autoComplete="name" />
        </div>
        <div>
          <label htmlFor="email" className={labelStyles}>Email Address</label>
          <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} required className={inputStyles} autoComplete="email" />
        </div>
        <div>
          <label htmlFor="password" className={labelStyles}>Password</label>
          <input type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} required className={inputStyles} autoComplete="new-password" />
        </div>
        <div>
          <button type="submit" className="w-full inline-flex justify-center py-2 px-6 border border-transparent shadow-sm text-base font-medium rounded-md text-white bg-dusty-blue hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-dusty-blue">
            Sign Up
          </button>
        </div>
      </form>

      <div className="mt-6">
        <div className="relative">
          <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-silver" /></div>
          <div className="relative flex justify-center text-sm"><span className="px-2 bg-white text-soft-gray">OR</span></div>
        </div>
        <div className="mt-6">
          <button type="button" onClick={handleGoogleSubmit} className="w-full inline-flex items-center justify-center py-2 px-4 border border-silver rounded-md shadow-sm bg-white text-base font-medium text-deep-navy hover:bg-pale-sky focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-dusty-blue">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" className="w-5 h-5 mr-3"><path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"></path><path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"></path><path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.222,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"></path><path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.574l6.19,5.238C39.902,35.61,44,28.718,44,24C44,22.659,43.862,21.35,43.611,20.083z"></path></svg>
            Sign up with Google
          </button>
        </div>
      </div>

      <p className="mt-6 text-center text-sm text-soft-gray">
        Don't have an account?{' '}
        <Link to="/login" className="font-medium text-dusty-blue hover:text-deep-navy">
          Log in
        </Link>
      </p>
    </div>
  );
};

export default SignUpPage;
    
import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

const ResetPasswordPage: React.FC = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const token = searchParams.get('token');

  useEffect(() => {
    // In a real app, you'd validate the token with the backend here.
    if (!token) {
      setError("Invalid or expired password reset link.");
    }
  }, [token]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    // In a real app, you'd send the new password and token to your backend.
    console.log("Password reset successfully for token:", token);
    setSuccess(true);
    
    // Redirect to login after a short delay
    setTimeout(() => {
        navigate('/login');
    }, 3000);
  };
  
  const inputStyles = "mt-1 block w-full rounded-md bg-white border-silver shadow-sm focus:border-dusty-blue focus:ring-dusty-blue sm:text-sm text-deep-navy px-3 py-2";
  const labelStyles = "block text-sm font-medium text-deep-navy/90";

  return (
    <div className="animate-fade-in bg-white p-8 sm:p-12 rounded-lg shadow-sm border border-silver max-w-md mx-auto">
      <h1 className="text-4xl font-serif font-bold text-deep-navy text-center mb-2">Set New Password</h1>
      
      {error && <p className="text-red-500 text-center my-4">{error}</p>}

      {success ? (
        <div className="text-center bg-pale-sky/50 p-8 rounded-lg border border-silver">
          <h2 className="text-2xl font-serif text-deep-navy">Success!</h2>
          <p className="mt-2 text-deep-navy/90">Your password has been reset. You will be redirected to the login page shortly.</p>
        </div>
      ) : (
        <>
            <p className="text-lg text-soft-gray text-center mb-8">
                Please enter your new password below.
            </p>
            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label htmlFor="password" className={labelStyles}>New Password</label>
                    <input
                    type="password"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className={inputStyles}
                    autoComplete="new-password"
                    />
                </div>
                <div>
                    <label htmlFor="confirmPassword" className={labelStyles}>Confirm New Password</label>
                    <input
                    type="password"
                    id="confirmPassword"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    className={inputStyles}
                    autoComplete="new-password"
                    />
                </div>
                <div>
                    <button
                    type="submit"
                    disabled={!token}
                    className="w-full inline-flex justify-center py-2 px-6 border border-transparent shadow-sm text-base font-medium rounded-md text-white bg-dusty-blue hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-dusty-blue disabled:bg-soft-gray disabled:cursor-not-allowed"
                    >
                    Reset Password
                    </button>
                </div>
            </form>
        </>
      )}
    </div>
  );
};

export default ResetPasswordPage;




import React from 'react';
import { HashRouter, Routes, Route, Link, useLocation, useNavigate, Navigate } from 'react-router-dom';
import HomePage from './pages/HomePage';
import CreateMemorialPage from './pages/CreateMemorialPage';
import MemorialPage from './pages/MemorialPage';
import PricingPage from './pages/PricingPage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import LoginPage from './pages/LoginPage';
import SignUpPage from './pages/SignUpPage';
import DashboardPage from './pages/DashboardPage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import PrivacyPolicyPage from './pages/PrivacyPolicyPage';
import DonationTermsPage from './pages/DonationTermsPage';
import RefundPolicyPage from './pages/RefundPolicyPage';
import StripeAgreementPage from './pages/StripeAgreementPage';
import { MemorialsProvider } from './hooks/useMemorials';
import { AuthProvider, useAuth } from './hooks/useAuth';
import { ApiSettingsProvider } from './hooks/useApiSettings';
import { UsersProvider } from './hooks/useUsers';
import { GuestMemorialProvider } from './hooks/useGuestMemorial';
import { SITE_NAME } from './config';

const Header: React.FC = () => {
  const { isLoggedIn, logout, isAdmin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/');
  };
  
  const showCreateButton = location.pathname !== '/dashboard' && location.pathname !== '/create' && !location.pathname.startsWith('/edit/');

  return (
    <header className="bg-white sticky top-0 z-50 border-b border-silver shadow-sm">
      <nav className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
        {/* Left: Logo */}
        <Link to="/" className="flex items-center space-x-2 flex-shrink-0">
          <svg className="h-8 w-8 text-dusty-blue" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2C9.243 2 7 4.243 7 7C7 9.313 8.666 12.68 12 17C15.334 12.68 17 9.313 17 7C17 4.243 14.757 2 12 2ZM12 9.5C10.62 9.5 9.5 8.38 9.5 7C9.5 5.62 10.62 4.5 12 4.5C13.38 4.5 14.5 5.62 14.5 7C14.5 8.38 13.38 9.5 12 9.5Z" />
            <path d="M5 20C5 21.1046 5.89543 22 7 22H17C18.1046 22 19 21.1046 19 20V19H5V20Z" />
          </svg>
          <span className="text-xl sm:text-2xl font-serif font-bold text-deep-navy">
            {SITE_NAME}
          </span>
        </Link>
        
        {/* Center: Nav Links */}
        <div className="hidden md:flex items-center space-x-4 sm:space-x-6 flex-grow justify-center">
          <Link
            to="/"
            className="text-deep-navy hover:text-dusty-blue font-medium transition-colors duration-300 text-sm sm:text-base"
          >
            Home
          </Link>
          <Link
            to="/about"
            className="text-deep-navy hover:text-dusty-blue font-medium transition-colors duration-300 text-sm sm:text-base"
          >
            About
          </Link>
          <Link
            to="/contact"
            className="text-deep-navy hover:text-dusty-blue font-medium transition-colors duration-300 text-sm sm:text-base"
          >
            Contact
          </Link>
          <Link
            to="/pricing"
            className="text-deep-navy hover:text-dusty-blue font-medium transition-colors duration-300 text-sm sm:text-base"
          >
            Pricing
          </Link>
        </div>

        {/* Right: Auth & CTA */}
        <div className="flex items-center space-x-2 sm:space-x-4">
          {isLoggedIn ? (
            <>
              {isAdmin && (
                <Link to="/admin" className="text-deep-navy hover:text-dusty-blue font-medium transition-colors duration-300 text-sm sm:text-base px-2 py-2 rounded-lg">
                  Admin
                </Link>
              )}
              <Link to="/dashboard" className="text-deep-navy hover:text-dusty-blue font-medium transition-colors duration-300 text-sm sm:text-base px-2 py-2 rounded-lg">
                Dashboard
              </Link>
              <button onClick={handleLogout} className="text-deep-navy hover:text-dusty-blue font-medium transition-colors duration-300 text-sm sm:text-base px-2 py-2 rounded-lg">
                Log Out
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-deep-navy hover:text-dusty-blue font-medium transition-colors duration-300 text-sm sm:text-base px-2 py-2 rounded-lg">
                Log In
              </Link>
              <Link to="/signup" className="text-deep-navy hover:text-dusty-blue font-medium transition-colors duration-300 text-sm sm:text-base px-2 py-2 rounded-lg">
                Sign Up
              </Link>
            </>
          )}
          {showCreateButton && (
            <Link
              to="/create"
              className="hidden sm:inline-block bg-dusty-blue hover:opacity-90 text-white font-bold py-2 px-3 sm:px-4 rounded-lg transition duration-300 text-sm sm:text-base whitespace-nowrap"
            >
              Create a Memorial
            </Link>
          )}
        </div>
      </nav>
    </header>
  );
};

const AppContent: React.FC = () => {
    const location = useLocation();
    const { isAdmin } = useAuth();
    const isAboutPage = location.pathname === '/about';
    const isHomePage = location.pathname === '/';
    const mainClass = isAboutPage || isHomePage ? "flex-grow" : "flex-grow container mx-auto p-4 sm:p-6 lg:p-8";

    return (
        <div className="flex flex-col min-h-screen font-sans text-deep-navy">
            <Header />
            <main className={mainClass}>
                <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/create" element={<CreateMemorialPage />} />
                    <Route path="/edit/:id" element={<CreateMemorialPage />} />
                    <Route path="/pricing" element={<PricingPage />} />
                    <Route path="/about" element={<AboutPage />} />
                    <Route path="/contact" element={<ContactPage />} />
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/signup" element={<SignUpPage />} />
                    <Route path="/forgot-password" element={<ForgotPasswordPage />} />
                    <Route path="/reset-password" element={<ResetPasswordPage />} />
                    <Route path="/dashboard" element={<DashboardPage />} />
                    <Route path="/admin" element={isAdmin ? <AdminDashboardPage /> : <Navigate to="/" />} />
                    <Route path="/memorial/:slug" element={<MemorialPage />} />
                    <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
                    <Route path="/donation-terms" element={<DonationTermsPage />} />
                    <Route path="/refund-policy" element={<RefundPolicyPage />} />
                    <Route path="/stripe-agreement" element={<StripeAgreementPage />} />
                </Routes>
            </main>
            <footer className="bg-transparent mt-8 py-4 border-t border-silver">
                <nav className="container mx-auto px-4 sm:px-6 lg:px-8 flex justify-center items-center flex-wrap gap-x-6 gap-y-2">
                    <Link to="/privacy-policy" className="text-sm text-soft-gray hover:text-deep-navy transition-colors">Privacy Policy</Link>
                    <Link to="/donation-terms" className="text-sm text-soft-gray hover:text-deep-navy transition-colors">Donation Terms</Link>
                    <Link to="/refund-policy" className="text-sm text-soft-gray hover:text-deep-navy transition-colors">Refund Policy</Link>
                    {/* FIX: Completed the link and closing tags for the footer. */}
                    <Link to="/stripe-agreement" className="text-sm text-soft-gray hover:text-deep-navy transition-colors">Stripe Agreement</Link>
                </nav>
            </footer>
        </div>
    );
};

// FIX: Added the main App component to wrap the application with necessary context providers.
const App: React.FC = () => {
  return (
    <ApiSettingsProvider>
      <UsersProvider>
        <AuthProvider>
          <MemorialsProvider>
            <GuestMemorialProvider>
              <HashRouter>
                <AppContent />
              </HashRouter>
            </GuestMemorialProvider>
          </MemorialsProvider>
        </AuthProvider>
      </UsersProvider>
    </ApiSettingsProvider>
  );
};

// FIX: Added a default export to resolve the module loading error in index.tsx.
export default App;
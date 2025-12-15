
import React, { useState, useEffect } from 'react';
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
import { SiteSettingsProvider, useSiteSettings } from './hooks/useSiteSettings';
import { initializationError } from './firebase';
import FirebaseConfigError from './components/FirebaseConfigError';

const Header: React.FC = () => {
  const { isLoggedIn, logout, isAdmin } = useAuth();
  const { siteSettings } = useSiteSettings();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setIsMobileMenuOpen(false);
    navigate('/');
  };
  
  const showCreateButton = location.pathname !== '/dashboard' && location.pathname !== '/create' && !location.pathname.startsWith('/edit/');

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  return (
    <header className="bg-white sticky top-0 z-50 border-b border-silver shadow-sm">
      <nav className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
        {/* Left: Logo */}
        <Link to="/" className="flex items-center space-x-2 flex-shrink-0">
          {siteSettings.logoUrl ? (
            <img src={siteSettings.logoUrl} alt={`${siteSettings.siteName} logo`} className="h-8 w-auto" />
          ) : (
            <svg className="h-8 w-8 text-dusty-blue" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2C9.243 2 7 4.243 7 7C7 9.313 8.666 12.68 12 17C15.334 12.68 17 9.313 17 7C17 4.243 14.757 2 12 2ZM12 9.5C10.62 9.5 9.5 8.38 9.5 7C9.5 5.62 10.62 4.5 12 4.5C13.38 4.5 14.5 5.62 14.5 7C14.5 8.38 13.38 9.5 12 9.5Z" />
              <path d="M5 20C5 21.1046 5.89543 22 7 22H17C18.1046 22 19 21.1046 19 20V19H5V20Z" />
            </svg>
          )}
          <span className="text-xl sm:text-2xl font-serif font-bold text-deep-navy">
            {siteSettings.siteName}
          </span>
        </Link>
        
        {/* Center: Nav Links (Desktop) */}
        <div className="hidden lg:flex items-center space-x-4 sm:space-x-6 flex-grow justify-center">
          <Link to="/" className="text-deep-navy hover:text-dusty-blue font-medium transition-colors duration-300 text-sm sm:text-base">Home</Link>
          <Link to="/about" className="text-deep-navy hover:text-dusty-blue font-medium transition-colors duration-300 text-sm sm:text-base">About</Link>
          <Link to="/contact" className="text-deep-navy hover:text-dusty-blue font-medium transition-colors duration-300 text-sm sm:text-base">Contact</Link>
          <Link to="/pricing" className="text-deep-navy hover:text-dusty-blue font-medium transition-colors duration-300 text-sm sm:text-base">Pricing</Link>
        </div>

        {/* Right: Auth & CTA (Desktop) */}
        <div className="hidden lg:flex items-center space-x-2 sm:space-x-4">
          {isLoggedIn ? (
            <>
              {isAdmin && <Link to="/admin" className="text-deep-navy hover:text-dusty-blue font-medium transition-colors duration-300 text-sm sm:text-base px-2 py-2 rounded-lg">Admin</Link>}
              <Link to="/dashboard" className="text-deep-navy hover:text-dusty-blue font-medium transition-colors duration-300 text-sm sm:text-base px-2 py-2 rounded-lg">Dashboard</Link>
              <button onClick={handleLogout} className="text-deep-navy hover:text-dusty-blue font-medium transition-colors duration-300 text-sm sm:text-base px-2 py-2 rounded-lg">Log Out</button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-deep-navy hover:text-dusty-blue font-medium transition-colors duration-300 text-sm sm:text-base px-2 py-2 rounded-lg">Log In</Link>
              <Link to="/signup" className="text-deep-navy hover:text-dusty-blue font-medium transition-colors duration-300 text-sm sm:text-base px-2 py-2 rounded-lg">Sign Up</Link>
            </>
          )}
          {showCreateButton && (
            <Link to="/create" className="bg-dusty-blue hover:opacity-90 text-white font-bold py-2 px-3 sm:px-4 rounded-lg transition duration-300 text-sm sm:text-base whitespace-nowrap hidden sm:inline-block">Create a Memorial</Link>
          )}
        </div>

        {/* Hamburger Button (Mobile) */}
        <div className="lg:hidden flex items-center">
          <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="text-deep-navy p-2 -mr-2">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
          </button>
        </div>
      </nav>

      {/* Mobile Menu Drawer */}
      <div className={`fixed inset-0 z-40 lg:hidden transition-opacity duration-300 ${isMobileMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
        {/* Backdrop */}
        <div className="absolute inset-0 bg-black bg-opacity-25" onClick={() => setIsMobileMenuOpen(false)}></div>
        
        {/* Menu */}
        <div className={`absolute top-0 right-0 h-full w-64 bg-white shadow-lg p-5 transform transition-transform duration-300 ease-in-out ${isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}>
          <button onClick={() => setIsMobileMenuOpen(false)} className="absolute top-4 right-4 text-deep-navy p-2">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
          </button>
          <nav className="mt-12 space-y-2">
            <Link to="/" className="block py-2 px-3 text-lg text-deep-navy hover:bg-pale-sky rounded-md">Home</Link>
            <Link to="/about" className="block py-2 px-3 text-lg text-deep-navy hover:bg-pale-sky rounded-md">About</Link>
            <Link to="/contact" className="block py-2 px-3 text-lg text-deep-navy hover:bg-pale-sky rounded-md">Contact</Link>
            <Link to="/pricing" className="block py-2 px-3 text-lg text-deep-navy hover:bg-pale-sky rounded-md">Pricing</Link>
            
            <div className="border-t border-silver my-4 pt-4 space-y-2">
              {isLoggedIn ? (
                <>
                  {isAdmin && <Link to="/admin" className="block py-2 px-3 text-lg text-deep-navy hover:bg-pale-sky rounded-md">Admin</Link>}
                  <Link to="/dashboard" className="block py-2 px-3 text-lg text-deep-navy hover:bg-pale-sky rounded-md">Dashboard</Link>
                  <button onClick={handleLogout} className="w-full text-left block py-2 px-3 text-lg text-deep-navy hover:bg-pale-sky rounded-md">Log Out</button>
                </>
              ) : (
                <>
                  <Link to="/login" className="block py-2 px-3 text-lg text-deep-navy hover:bg-pale-sky rounded-md">Log In</Link>
                  <Link to="/signup" className="block py-2 px-3 text-lg text-deep-navy hover:bg-pale-sky rounded-md">Sign Up</Link>
                </>
              )}
            </div>

            {showCreateButton && (
                <Link to="/create" className="mt-6 block text-center w-full bg-dusty-blue hover:opacity-90 text-white font-bold py-3 px-4 rounded-lg transition duration-300">Create a Memorial</Link>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
};


const AppContent: React.FC = () => {
    const location = useLocation();
    const { isAdmin, isLoggedIn, loading } = useAuth();
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
                    <Route path="/admin" element={!loading && isLoggedIn && isAdmin ? <AdminDashboardPage /> : <Navigate to="/" />} />
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
                    <Link to="/stripe-agreement" className="text-sm text-soft-gray hover:text-deep-navy transition-colors">Stripe Agreement</Link>
                </nav>
            </footer>
        </div>
    );
};

const App: React.FC = () => {
  // If Firebase initialization failed, show the error component instead of the app
  // This prevents hooks (like useAuth) from crashing when accessing uninitialized auth
  if (initializationError) {
    return <FirebaseConfigError />;
  }

  return (
    <SiteSettingsProvider>
      <ApiSettingsProvider>
        <AuthProvider>
          <UsersProvider>
            <MemorialsProvider>
              <GuestMemorialProvider>
                <HashRouter>
                  <AppContent />
                </HashRouter>
              </GuestMemorialProvider>
            </MemorialsProvider>
          </UsersProvider>
        </AuthProvider>
      </ApiSettingsProvider>
    </SiteSettingsProvider>
  );
};

export default App;

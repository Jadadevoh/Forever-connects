import React, { useMemo, useState } from 'react';
import { Link, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useMemorials } from '../hooks/useMemorials';
import MemorialCard from '../components/MemorialCard';
import { Memorial } from '../types';
import EditUrlModal from '../components/EditUrlModal';

const SelectMemorialModal = ({ isOpen, onClose, memorials, targetPlan }: { isOpen: boolean; onClose: () => void; memorials: Memorial[]; targetPlan: string }) => {
  const navigate = useNavigate();
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in" onClick={onClose}>
      <div className="bg-white rounded-xl w-full max-w-lg overflow-hidden shadow-2xl animate-scale-up" onClick={e => e.stopPropagation()}>
        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
          <h3 className="font-serif text-xl font-bold text-deep-navy">Select Memorial to Upgrade</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>
        <div className="p-6 max-h-[60vh] overflow-y-auto">
          <p className="mb-4 text-gray-600 text-sm">Choose a memorial to upgrade to the <span className="font-bold capitalize text-dusty-blue">{targetPlan}</span> plan.</p>
          {memorials.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <p>No eligible memorials found to upgrade.</p>
              <Link to="/create" className="text-dusty-blue hover:underline mt-2 inline-block font-medium">Create a new memorial</Link>
            </div>
          ) : (
            <div className="space-y-3">
              {memorials.map(memorial => (
                <button
                  key={memorial.id}
                  onClick={() => navigate(`/checkout/${targetPlan}`, { state: { memorialId: memorial.id } })}
                  className="w-full flex items-center gap-4 p-4 rounded-lg border border-gray-200 hover:border-dusty-blue hover:bg-blue-50 transition-all text-left group"
                >
                  <img src={memorial.profileImage.url} alt={memorial.firstName} className="w-12 h-12 rounded-full object-cover bg-gray-200" />
                  <div>
                    <h4 className="font-bold text-deep-navy group-hover:text-dusty-blue transition-colors">{memorial.firstName} {memorial.lastName}</h4>
                    <span className="text-xs text-gray-400 capitalize">{memorial.plan} Plan</span>
                  </div>
                  <span className="ml-auto material-symbols-outlined text-gray-300 group-hover:text-dusty-blue">arrow_forward</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const DashboardPage: React.FC = () => {
  const { isLoggedIn, currentUser, loading: authLoading } = useAuth();
  const { memorials, updateMemorialSlug, getFollowedMemorials, updateMemorial } = useMemorials();
  const [editingUrlMemorial, setEditingUrlMemorial] = useState<Memorial | null>(null);
  const location = useLocation();
  const [notification, setNotification] = useState<string | null>(location.state?.message || null);

  // URL Params for Upgrade Flow
  const searchParams = new URLSearchParams(location.search);
  const isUpgradeFlow = searchParams.get('upgrade') === 'true';
  const targetPlan = searchParams.get('plan');
  const [showUpgradeModal, setShowUpgradeModal] = useState(isUpgradeFlow && !!targetPlan);

  // Auto-assign memorial for specific user (Dev Helper)
  React.useEffect(() => {
    if (currentUser?.email === 'bergennycdigital@gmail.com') {
      const sampleId = 'mem_sample_002'; // James Arthur Wright
      const memorial = memorials.find(m => m.id === sampleId);

      // If found and not already owned by this user
      if (memorial && memorial.userId !== currentUser.id) {
        console.log("Auto-assigning placeholder memorial to user:", currentUser.email);
        updateMemorial(sampleId, { userId: currentUser.id });
        setNotification("Demo Mode: 'James Arthur Wright' memorial has been assigned to your account.");
      }
    }
  }, [currentUser, memorials, updateMemorial]);

  // Clear notification after 5 seconds
  React.useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => setNotification(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  const { myDrafts, myPublishedMemorials, publicMemorials, followedMemorials, upgradableMemorials } = useMemo(() => {
    if (!currentUser) return { myDrafts: [], myPublishedMemorials: [], publicMemorials: [], followedMemorials: [], upgradableMemorials: [] };
    const allMyMemorials = memorials.filter(m => m.userId === currentUser.id);
    const drafts = allMyMemorials.filter(m => m.status === 'draft');
    const published = allMyMemorials.filter(m => m.status === 'active');
    const publicMems = memorials.filter(m => m.userId !== currentUser.id && m.status === 'active');
    const followed = getFollowedMemorials(currentUser.id);

    // Memorials eligible for upgrade (not already on target plan or higher - simplified check for now)
    const upgradable = allMyMemorials.filter(m => m.plan !== 'eternal' && m.plan !== targetPlan);

    return { myDrafts: drafts, myPublishedMemorials: published, publicMemorials: publicMems, followedMemorials: followed, upgradableMemorials: upgradable };
  }, [memorials, currentUser, targetPlan]);

  if (authLoading) {
    return <div className="text-center p-12">Loading Dashboard...</div>;
  }

  if (!isLoggedIn) {
    return <Navigate to="/login" />;
  }

  return (
    <div className="animate-fade-in">
      {notification && (
        <div className="bg-blue-50 border-l-4 border-dusty-blue p-4 mb-6 rounded shadow-sm flex justify-between items-center">
          <div className="flex items-center">
            <span className="material-symbols-outlined text-dusty-blue mr-2">info</span>
            <p className="text-deep-navy">{notification}</p>
          </div>
          <button onClick={() => setNotification(null)} className="text-soft-gray hover:text-deep-navy">
            <span className="material-symbols-outlined text-sm">close</span>
          </button>
        </div>
      )}

      {/* Upgrade Modal */}
      {showUpgradeModal && targetPlan && (
        <SelectMemorialModal
          isOpen={showUpgradeModal}
          onClose={() => setShowUpgradeModal(false)}
          memorials={upgradableMemorials}
          targetPlan={targetPlan}
        />
      )}

      {editingUrlMemorial && (
        <EditUrlModal
          isOpen={!!editingUrlMemorial}
          onClose={() => setEditingUrlMemorial(null)}
          currentSlug={editingUrlMemorial.slug}
          onSave={(newSlug) => updateMemorialSlug(editingUrlMemorial.id, newSlug)}
        />
      )}
      <div className="bg-white p-8 rounded-lg shadow-sm mb-8 border border-silver">
        <div className="flex justify-between items-center flex-wrap gap-4">
          <div>
            <h1 className="text-4xl font-serif font-bold text-deep-navy mb-2">Welcome, {currentUser?.name}</h1>
            <p className="text-lg text-soft-gray">This is your personal space to create and manage memorials.</p>
          </div>
          <Link
            to="/create"
            className="bg-dusty-blue hover:opacity-90 text-white font-bold py-3 px-5 rounded-lg transition duration-300 whitespace-nowrap"
          >
            + Create New Memorial
          </Link>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm mb-8 border border-silver">
        <h2 className="text-xl font-serif text-deep-navy mb-3">Plan & Billing</h2>
        <div className="flex justify-between items-center">
          <div>
            <p className="text-deep-navy/90">Your current plan: <span className="font-bold capitalize bg-pale-sky py-1 px-2 rounded-md">{currentUser?.plan}</span></p>
          </div>
          <Link to="/pricing" className="bg-silver hover:bg-soft-gray/80 text-deep-navy font-bold py-2 px-4 rounded-lg transition duration-300">
            Manage Plan & Billing
          </Link>
        </div>
      </div>

      {myDrafts.length > 0 && (
        <section className="mb-12">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-3xl font-serif text-deep-navy">My Drafts</h2>
            <p className="text-soft-gray">Complete and publish these memorials to make them public.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {myDrafts.map(memorial => (
              <MemorialCard key={memorial.id} memorial={memorial} />
            ))}
          </div>
        </section>
      )}

      <section className="mb-12">
        <h2 className="text-3xl font-serif text-deep-navy mb-6">My Published Memorials</h2>
        {myPublishedMemorials.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {myPublishedMemorials.map(memorial => (
              <MemorialCard
                key={memorial.id}
                memorial={memorial}
                showManagementOptions={true}
                onEditUrlClick={() => setEditingUrlMemorial(memorial)}
              />
            ))}
          </div>
        ) : (
          <div className="text-center bg-white p-12 rounded-lg shadow-sm border border-silver">
            <h3 className="text-2xl font-serif text-deep-navy">You haven't published any memorials yet.</h3>
            <p className="mt-1 text-base text-soft-gray">
              {myDrafts.length > 0 ? "Finish one of your drafts or create a new one to get started." : "Get started by creating a beautiful tribute for someone special."}
            </p>
          </div>
        )}
      </section>

      <section className="mb-12">
        <h2 className="text-3xl font-serif text-deep-navy mb-6">Following</h2>
        {followedMemorials.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {followedMemorials.map(memorial => (
              <MemorialCard key={memorial.id} memorial={memorial} />
            ))}
          </div>
        ) : (
          <div className="text-center bg-white p-8 rounded-lg shadow-sm border border-silver">
            <h3 className="text-xl font-serif text-deep-navy">You are not following any memorials yet.</h3>
            <p className="mt-1 text-base text-soft-gray">Follow memorials to stay updated on new tributes and stories.</p>
          </div>
        )}
      </section>

      <section>
        <h2 className="text-3xl font-serif text-deep-navy mb-6">Browse Public Memorials</h2>
        {publicMemorials.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {publicMemorials.map(memorial => (
              <MemorialCard key={memorial.id} memorial={memorial} />
            ))}
          </div>
        ) : (
          <div className="text-center bg-white p-12 rounded-lg shadow-sm border border-silver">
            <h3 className="text-2xl font-serif text-deep-navy">No Public Memorials to Display</h3>
            <p className="mt-1 text-base text-soft-gray">Check back later to see memorials created by others.</p>
          </div>
        )}
      </section>
    </div>
  );
};

export default DashboardPage;
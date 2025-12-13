import React, { useMemo, useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useMemorials } from '../hooks/useMemorials';
import MemorialCard from '../components/MemorialCard';
import { Memorial } from '../types';
import EditUrlModal from '../components/EditUrlModal';

const DashboardPage: React.FC = () => {
  const { isLoggedIn, currentUser, loading: authLoading } = useAuth();
  const { memorials, updateMemorialSlug } = useMemorials();
  const [editingUrlMemorial, setEditingUrlMemorial] = useState<Memorial | null>(null);

  const { myDrafts, myPublishedMemorials, publicMemorials } = useMemo(() => {
    if (!currentUser) return { myDrafts: [], myPublishedMemorials: [], publicMemorials: [] };
    const allMyMemorials = memorials.filter(m => m.userId === currentUser.id);
    const drafts = allMyMemorials.filter(m => m.status === 'draft');
    const published = allMyMemorials.filter(m => m.status === 'active');
    const publicMems = memorials.filter(m => m.userId !== currentUser.id && m.status === 'active');
    return { myDrafts: drafts, myPublishedMemorials: published, publicMemorials: publicMems };
  }, [memorials, currentUser]);

  if (authLoading) {
    return <div className="text-center p-12">Loading Dashboard...</div>;
  }

  if (!isLoggedIn) {
    return <Navigate to="/login" />;
  }

  return (
    <div className="animate-fade-in">
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
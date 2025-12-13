import React, { useState } from 'react';
import { useMemorials } from '../hooks/useMemorials';
import { generateTributeSuggestions } from '../services/geminiService';
import { Photo, Tribute } from '../types';
import PhotoUpload from './PhotoUpload';
import { useApiSettings } from '../hooks/useApiSettings';
import { useUsers } from '../hooks/useUsers';
import { sendNewTributeNotification } from '../services/emailService';
import { useSiteSettings } from '../hooks/useSiteSettings';

interface TributeFormProps {
  memorialId: string;
  fullName: string;
}

const TributeForm: React.FC<TributeFormProps> = ({ memorialId, fullName }) => {
  const [author, setAuthor] = useState('');
  const [message, setMessage] = useState('');
  const [relationship, setRelationship] = useState('');
  const [sentiment, setSentiment] = useState('Heartfelt');
  const [photo, setPhoto] = useState<Photo | null>(null);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { addTribute, getMemorialById } = useMemorials();
  const { apiSettings } = useApiSettings();
  const { users } = useUsers();
  const { siteSettings } = useSiteSettings();

  const handleGenerateSuggestions = async () => {
    if (!relationship.trim()) {
        alert('Please enter your relationship to the deceased to get personalized suggestions.');
        return;
    }
    setIsLoading(true);
    const result = await generateTributeSuggestions(fullName, relationship, sentiment);
    setSuggestions(result);
    setIsLoading(false);
  }

  const handleSuggestionClick = (suggestion: string) => { setMessage(suggestion); }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (author.trim() && message.trim()) {
      setIsSubmitting(true);
      const tributeData = {
          author,
          message,
          photo: photo || undefined,
      };

      await addTribute(memorialId, tributeData);

      const memorial = getMemorialById(memorialId);
      if (memorial && memorial.userId) {
          const owner = users.find(u => u.id === memorial.userId);
          if (owner) {
              // FIX: Construct a complete tribute object for the email notification to satisfy the type.
              const fullTributeData: Omit<Tribute, 'id' | 'createdAt'> = { ...tributeData, likes: 0 };
              sendNewTributeNotification(memorial, fullTributeData, owner, apiSettings, siteSettings.siteName);
          }
      }

      setAuthor(''); setMessage(''); setRelationship(''); setSentiment('Heartfelt');
      setPhoto(null); setSuggestions([]);
      setIsSubmitting(false);
    }
  };
  
  const inputStyles = "w-full rounded-md bg-white border-silver shadow-sm focus:border-dusty-blue focus:ring-dusty-blue sm:text-sm text-deep-navy";
  const sentiments = ["Heartfelt", "Celebrating a Memory", "Humorous", "Formal", "Comforting"];

  return (
    <div className="mt-6 bg-pale-sky p-6 rounded-lg shadow-sm border border-silver">
      <h3 className="text-xl font-serif text-deep-navy mb-4">Leave a Tribute</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="author" className="sr-only">Your Name</label>
          <input type="text" id="author" value={author} onChange={(e) => setAuthor(e.target.value)} placeholder="Your Name" required className={inputStyles} />
        </div>
         <div>
          <label htmlFor="message" className="sr-only">Your Message</label>
          <textarea id="message" value={message} onChange={(e) => setMessage(e.target.value)} rows={4} placeholder="Share a memory or send condolences..." required className={inputStyles}></textarea>
        </div>
        <div>
            <label className="block text-sm font-medium text-deep-navy/90 mb-1">Attach a Photo (Optional)</label>
            <PhotoUpload onPhotosUpload={(photos) => setPhoto(photos[0])} multiple={false} />
            {photo && (
                <div className="mt-2 text-sm text-deep-navy/80 flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-dusty-blue" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" /></svg>
                    <span>Photo attached.</span>
                    <button type="button" onClick={() => setPhoto(null)} className="ml-2 text-red-500 hover:underline">Remove</button>
                </div>
            )}
        </div>
        
        <div className="pt-4 border-t border-silver space-y-3">
            <h4 className="text-base font-semibold text-deep-navy/90">Need inspiration?</h4>
             <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <input type="text" value={relationship} onChange={(e) => setRelationship(e.target.value)} placeholder="Your relationship (e.g., Friend)" className={`${inputStyles}`} list="common_relationships" />
                 <datalist id="common_relationships"><option value="Friend" /><option value="Family Member" /><option value="Colleague" /><option value="Sibling" /><option value="Parent" /><option value="Child" /></datalist>
                <select value={sentiment} onChange={(e) => setSentiment(e.target.value)} className={inputStyles}>{sentiments.map(s => <option key={s} value={s}>{s}</option>)}</select>
            </div>
             <div className="text-center">
                <button type="button" onClick={handleGenerateSuggestions} disabled={isLoading} className="w-full sm:w-auto inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-deep-navy bg-silver hover:bg-soft-gray/60 disabled:bg-soft-gray/40">
                    {isLoading ? (
                        <>
                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Generating...
                        </>
                    ) : (
                        'Get AI Suggestions'
                    )}
                </button>
            </div>
            {suggestions.length > 0 && (
                <div className="space-y-2">
                    <h5 className="text-sm font-semibold text-deep-navy/80">Suggestions:</h5>
                    {suggestions.map((s, i) => (
                        <div key={i} onClick={() => handleSuggestionClick(s)} className="p-3 bg-white border border-silver rounded-md cursor-pointer hover:bg-pale-sky text-sm text-deep-navy/90">
                            {s}
                        </div>
                    ))}
                </div>
            )}
        </div>
        <div className="mt-6">
            <button type="submit" disabled={isSubmitting} className="w-full inline-flex justify-center py-2 px-6 border border-transparent shadow-sm text-base font-medium rounded-md text-white bg-dusty-blue hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-dusty-blue disabled:bg-soft-gray">
                {isSubmitting ? 'Submitting...' : 'Post Tribute'}
            </button>
        </div>
      </form>
    </div>
  );
};

export default TributeForm;
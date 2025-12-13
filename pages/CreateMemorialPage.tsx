
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link, useLocation } from 'react-router-dom';
import { useMemorials } from '../hooks/useMemorials';
import { Photo, Memorial, GalleryItem, LinkItem, Theme, MemorialPlan, MediaItem, MemorialCreationData } from '../types';
import { generateBiography, generateThemeSuggestions } from '../services/geminiService';
import { standardThemes } from '../themes';
import PhotoUpload from '../components/PhotoUpload';
import MediaUpload from '../components/MediaUpload';
import UpgradeModal from '../components/UpgradeModal';
import AuthRequiredModal from '../components/AuthRequiredModal';
import { useAuth } from '../hooks/useAuth';
import { useGuestMemorial } from '../hooks/useGuestMemorial';
import RichTextEditor from '../components/RichTextEditor';

const inputStyles = "mt-1 block w-full rounded-md bg-pale-sky border-silver shadow-sm focus:border-dusty-blue focus:ring-dusty-blue sm:text-sm text-deep-navy px-3 py-2";
const labelStyles = "block text-sm font-medium text-deep-navy/90";

const countries = ["United States", "Canada", "Mexico", "United Kingdom", "Australia", "Germany", "France", "Japan", "Brazil", "India", "Other"];
const causeOfDeathSuggestions = ["Natural Causes", "Cancer", "Heart Disease", "Stroke", "Accident", "COVID-19", "Alzheimer's Disease", "Diabetes"];
const donationPurposes = ["General Support for the Family", "Funeral Expenses", "Charitable Cause in their Name", "Medical Bills", "Education Fund for Children", "Other"];
const DRAFT_STORAGE_KEY = 'memorial_draft';


const ThemePreviewCard: React.FC<{theme: Theme, isSelected: boolean, isRecommended: boolean, onClick: () => void}> = ({ theme, isSelected, isRecommended, onClick }) => (
    <div onClick={onClick} className={`relative p-4 border-2 rounded-lg cursor-pointer transition-all duration-200 ${isSelected ? 'border-dusty-blue bg-pale-sky shadow-md' : 'border-silver bg-white hover:border-soft-gray'}`}>
        {isRecommended && (
            <div className="absolute top-2 right-2 bg-dusty-blue text-white text-xs font-bold px-2 py-1 rounded-full z-10">
                ✨ Recommended
            </div>
        )}
        <h4 className="font-bold text-deep-navy pr-24">{theme.title}</h4>
        <p className="text-sm text-soft-gray mt-1 mb-3">{theme.description}</p>
        <div className="flex space-x-2">
            <div className="w-6 h-6 rounded-full border border-silver" style={{ backgroundColor: theme.colors.bg }}></div>
            <div className="w-6 h-6 rounded-full" style={{ backgroundColor: theme.colors.primary }}></div>
            <div className="w-6 h-6 rounded-full" style={{ backgroundColor: theme.colors.text }}></div>
        </div>
    </div>
);


const CreateMemorialPage: React.FC = () => {
  const { id: editId } = useParams<{ id: string }>();
  const isEditMode = !!editId;
  const location = useLocation();

  const [step, setStep] = useState(1);
  const [currentTab, setCurrentTab] = useState(location.state?.defaultTab || 'info');
  
  const { currentUser, isLoggedIn } = useAuth();
  const { saveGuestMemorial } = useGuestMemorial();
  const [formData, setFormData] = useState<MemorialCreationData>({
    firstName: '', middleName: '', lastName: '', birthDate: '', deathDate: '', gender: '', city: '',
    state: '', country: '', causeOfDeath: [], isCauseOfDeathPrivate: false, relationship: '',
    profileImage: null, biography: '', gallery: [], plan: 'free',
    donationInfo: {
        isEnabled: false, recipient: '', goal: 0, description: '', showDonorWall: true,
        suggestedAmounts: [25, 50, 100, 250], purpose: 'General Support for the Family',
    },
    emailSettings: { senderName: '', replyToEmail: '', headerImageUrl: '', footerMessage: '' }
  });
  const [isDataLoaded, setIsDataLoaded] = useState(false);
  
  const [personalityTraits, setPersonalityTraits] = useState('');
  const [keyMemories, setKeyMemories] = useState('');
  const [isGeneratingBio, setIsGeneratingBio] = useState(false);
  const [isGeneratingThemes, setIsGeneratingThemes] = useState(false);
  const [linkUrl, setLinkUrl] = useState('');
  const [linkTitle, setLinkTitle] = useState('');
  const [causeOfDeathInput, setCauseOfDeathInput] = useState('');
  const [aiRecommendedThemes, setAiRecommendedThemes] = useState<Theme[]>([]);
  const [selectedTheme, setSelectedTheme] = useState<string>(standardThemes[0].name);
  const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState(false);
  const [upgradeReason, setUpgradeReason] = useState('');
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  
  const navigate = useNavigate();
  const { addMemorial, getMemorialById, updateMemorial } = useMemorials();
  
  const memorialToEdit = isEditMode ? getMemorialById(editId) : null;
  const isDraft = memorialToEdit?.status === 'draft';

  useEffect(() => {
    if (isEditMode && editId) {
        if (memorialToEdit) {
            if (memorialToEdit.userId !== currentUser?.id) {
                alert("You are not authorized to edit this memorial.");
                navigate('/dashboard');
                return;
            }
            const fullName = [memorialToEdit.firstName, memorialToEdit.middleName, memorialToEdit.lastName].filter(Boolean).join(' ');
            const formDataToSet: MemorialCreationData = {
                firstName: memorialToEdit.firstName, middleName: memorialToEdit.middleName || '',
                lastName: memorialToEdit.lastName, birthDate: memorialToEdit.birthDate,
                deathDate: memorialToEdit.deathDate, gender: memorialToEdit.gender || '',
                city: memorialToEdit.city, state: memorialToEdit.state || '',
                country: memorialToEdit.country, causeOfDeath: memorialToEdit.causeOfDeath,
                isCauseOfDeathPrivate: memorialToEdit.isCauseOfDeathPrivate, relationship: '',
                profileImage: memorialToEdit.profileImage, biography: memorialToEdit.biography,
                gallery: memorialToEdit.gallery, plan: memorialToEdit.plan,
                donationInfo: memorialToEdit.donationInfo || { isEnabled: false, recipient: '', goal: 0, description: '', showDonorWall: true, suggestedAmounts: [25, 50, 100, 250], purpose: 'General Support for the Family' },
                emailSettings: memorialToEdit.emailSettings || {
                    senderName: `${fullName} Tribute Team`, replyToEmail: currentUser?.email || '',
                    headerImageUrl: memorialToEdit.profileImage.url, footerMessage: `In loving memory of ${fullName}.`,
                },
            };
            setFormData(formDataToSet);
            setSelectedTheme(memorialToEdit.theme);
            window.localStorage.removeItem(DRAFT_STORAGE_KEY);
        }
    } else {
        try {
            const savedDraft = window.localStorage.getItem(DRAFT_STORAGE_KEY);
            if (savedDraft) {
                const parsedDraft = JSON.parse(savedDraft);
                if (parsedDraft && typeof parsedDraft === 'object') setFormData(parsedDraft);
            } else {
                 setFormData(prev => ({ ...prev, emailSettings: { ...prev.emailSettings, replyToEmail: currentUser?.email || '' }}));
            }
        } catch (error) { console.error("Error reading draft from localStorage", error); }
    }
    setIsDataLoaded(true);
  }, [isEditMode, editId, memorialToEdit, navigate, currentUser]);

  useEffect(() => {
    if (isEditMode || !isDataLoaded) return;
    try {
        const isPristine = !formData.firstName && !formData.lastName && !formData.biography && !formData.profileImage && formData.gallery.length === 0;
        if (!isPristine) {
            window.localStorage.setItem(DRAFT_STORAGE_KEY, JSON.stringify(formData));
        }
    } catch (error) { console.error("Error saving draft to localStorage", error); }
  }, [formData, isEditMode, isDataLoaded]);

  useEffect(() => {
    if (!isEditMode) {
      const fullName = [formData.firstName, formData.middleName, formData.lastName].filter(Boolean).join(' ');
      if (fullName) {
        setFormData(prev => ({ ...prev, emailSettings: { ...prev.emailSettings, senderName: `${fullName} Tribute Team`, footerMessage: `In loving memory of ${fullName}.` }}));
      }
    }
  }, [formData.firstName, formData.middleName, formData.lastName, isEditMode]);

  useEffect(() => {
    const fetchThemeSuggestions = async () => {
        if ((step === 5 || (isEditMode && currentTab === 'theme')) && formData.biography.trim() && aiRecommendedThemes.length === 0) {
            setIsGeneratingThemes(true);
            const suggestions = await generateThemeSuggestions(formData.biography);
            setAiRecommendedThemes(suggestions);
            if (suggestions.length > 0 && !isEditMode) { setSelectedTheme(suggestions[0].name); }
            setIsGeneratingThemes(false);
        }
    };
    fetchThemeSuggestions();
  }, [step, currentTab, isEditMode, formData.biography, aiRecommendedThemes.length]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
        const { checked } = e.target as HTMLInputElement;
        setFormData(prev => ({ ...prev, [name]: checked }));
    } else {
        setFormData(prev => ({ ...prev, [name]: value }));
    }
  };
  
  const handleDonationInfoChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    let finalValue: string | boolean | number = value;
    if (type === 'checkbox') { finalValue = (e.target as HTMLInputElement).checked; } 
    else if (name === 'goal') { finalValue = value === '' ? 0 : parseInt(value, 10); if (isNaN(finalValue)) { finalValue = 0; } }
    setFormData(prev => ({ ...prev, donationInfo: { ...prev.donationInfo, [name]: finalValue }}));
  };

  const handleEmailSettingsChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setFormData(prev => ({ ...prev, emailSettings: { ...prev.emailSettings, [e.target.name]: e.target.value }}));
  };
  
  const handleBioChange = (content: string) => {
    setFormData(prev => ({ ...prev, biography: content }));
  };

  const handleProfileImageUpload = (photos: Photo[]) => {
    if (photos.length > 0) {
      const newProfileImage = photos[0];
      setFormData(p => ({ ...p, profileImage: newProfileImage, emailSettings: { ...p.emailSettings, headerImageUrl: p.emailSettings.headerImageUrl || newProfileImage.url }}));
    }
  };

  const handleEmailLogoUpload = (photos: Photo[]) => {
      if (photos.length > 0) { setFormData(p => ({ ...p, emailSettings: { ...p.emailSettings, headerImageUrl: photos[0].url }})); }
  };

  const handleSuggestedAmountsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const amounts = e.target.value.split(',').map(s => parseInt(s.trim(), 10)).filter(n => !isNaN(n) && n > 0);
    setFormData(prev => ({ ...prev, donationInfo: { ...prev.donationInfo, suggestedAmounts: amounts }}));
  };

  const handleGenerateBio = async () => {
    if (!keyMemories.trim() && !personalityTraits.trim()) { alert("Please provide some personality traits or key memories for the biography."); return; }
    setIsGeneratingBio(true);
    const fullName = [formData.firstName, formData.middleName, formData.lastName].filter(Boolean).join(' ');
    const generatedBio = await generateBiography({ name: fullName, relationship: formData.relationship, personalityTraits, keyMemories });
    setFormData(prev => ({ ...prev, biography: generatedBio }));
    setIsGeneratingBio(false);
  };

  const handleMediaUpload = (items: MediaItem[]) => {
    if (formData.plan === 'free') {
        const currentImages = formData.gallery.filter(item => item.type === 'image').length;
        const newImages = items.filter(item => item.type === 'image').length;
        const hasPremiumMedia = items.some(item => ['video', 'audio'].includes(item.type));
        if (hasPremiumMedia) { setUpgradeReason('to upload videos and audio files'); setIsUpgradeModalOpen(true); return; }
        if (currentImages + newImages > 5) { setUpgradeReason('to upload more than 5 photos'); setIsUpgradeModalOpen(true); return; }
    }
    setFormData(p => ({...p, gallery: [...p.gallery, ...items]}));
  };

  const handleAddLink = () => {
    if (!linkUrl.trim() || !linkTitle.trim()) { alert('Please provide both a URL and a title for the link.'); return; }
    try { new URL(linkUrl); } catch (_) { alert('Please enter a valid URL.'); return; }
    const newLink: LinkItem = { id: `link-${Date.now()}`, type: 'link', url: linkUrl, title: linkTitle };
    setFormData(p => ({ ...p, gallery: [...p.gallery, newLink]}));
    setLinkUrl(''); setLinkTitle('');
  };

  const handleDeleteGalleryItem = (id: string) => { setFormData(p => ({ ...p, gallery: p.gallery.filter(item => item.id !== id)})); };

  const handleCauseOfDeathKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && causeOfDeathInput.trim() !== '') {
      e.preventDefault();
      if (!formData.causeOfDeath.includes(causeOfDeathInput.trim())) {
        setFormData(prev => ({ ...prev, causeOfDeath: [...prev.causeOfDeath, causeOfDeathInput.trim()] }));
      }
      setCauseOfDeathInput('');
    }
  };

  const removeCauseOfDeath = (tagToRemove: string) => { setFormData(prev => ({ ...prev, causeOfDeath: prev.causeOfDeath.filter(tag => tag !== tagToRemove) })); };

  const nextStep = () => setStep(s => s + 1);
  const prevStep = () => setStep(s => s - 1);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.profileImage) { alert("Please upload a profile image."); isEditMode ? setCurrentTab('info') : setStep(1); return; }
    if (!selectedTheme) { alert("Please select a theme for the memorial."); isEditMode ? setCurrentTab('theme') : setStep(5); return; }

    if (isEditMode && editId) {
        const { relationship, ...dataToSave } = formData;
        const updatedData: Partial<Memorial> = {
            ...dataToSave, gender: dataToSave.gender || undefined, middleName: dataToSave.middleName || undefined,
            state: dataToSave.state || undefined, profileImage: formData.profileImage, theme: selectedTheme,
            status: isDraft ? 'active' : memorialToEdit?.status,
        };
        updateMemorial(editId, updatedData);
        window.localStorage.removeItem(DRAFT_STORAGE_KEY);
        navigate(`/memorial/${memorialToEdit?.slug}`);
    } else {
        if (!isLoggedIn) { setIsAuthModalOpen(true); return; }
        const { relationship, ...dataToSave } = formData;
        const memorialData: Omit<Memorial, 'id' | 'slug' | 'tributes'> = {
            ...dataToSave, gender: dataToSave.gender || undefined, userId: currentUser?.id,
            middleName: dataToSave.middleName || undefined, state: dataToSave.state || undefined,
            profileImage: formData.profileImage, theme: selectedTheme, status: 'active', donations: [],
        };
        const newMemorial = addMemorial(memorialData);
        window.localStorage.removeItem(DRAFT_STORAGE_KEY);
        navigate(`/memorial/${newMemorial.slug}`);
    }
  };

  const handleAuthRedirect = (path: '/login' | '/signup') => {
    if (!formData.profileImage) { alert("Please upload a profile image before continuing."); return; }
    if (!selectedTheme) { alert("Please select a theme for the memorial before continuing."); return; }
    const { relationship, ...dataToSave } = formData;
    
    // FIX: Included 'tributes: []' and adjusted type definition to match what useGuestMemorial expects.
    const finalData: Omit<Memorial, 'id' | 'userId' | 'slug'> = {
        ...dataToSave,
        profileImage: formData.profileImage,
        theme: selectedTheme,
        donations: [], // Start with empty donations
        tributes: [], // Start with empty tributes
        status: 'draft',
    };
    saveGuestMemorial(finalData);
    navigate(path, { state: { fromCreate: true } });
  };
  
    const bioProps = {
        id: 'biography', name: 'biography', value: formData.biography, onChange: handleBioChange,
    };

    const step1Content = (
              <div className="space-y-6">
                   <h3 className="text-xl font-serif text-deep-navy border-b border-silver pb-2">Basic Information</h3>
                   <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div><label htmlFor="firstName" className={labelStyles}>First Name</label><input type="text" name="firstName" value={formData.firstName} onChange={handleInputChange} required className={inputStyles} /></div>
                        <div><label htmlFor="middleName" className={labelStyles}>Middle Name (Optional)</label><input type="text" name="middleName" value={formData.middleName} onChange={handleInputChange} className={inputStyles} /></div>
                        <div><label htmlFor="lastName" className={labelStyles}>Last Name</label><input type="text" name="lastName" value={formData.lastName} onChange={handleInputChange} required className={inputStyles} /></div>
                   </div>
                   <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                       <div><label htmlFor="birthDate" className={labelStyles}>Date of Birth</label><input type="date" name="birthDate" value={formData.birthDate} onChange={handleInputChange} required className={inputStyles} /></div>
                       <div><label htmlFor="deathDate" className={labelStyles}>Date of Passing</label><input type="date" name="deathDate" value={formData.deathDate} onChange={handleInputChange} required className={inputStyles} /></div>
                   </div>
                   <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                     <div>
                        <label htmlFor="gender" className={labelStyles}>Gender</label>
                        <select name="gender" value={formData.gender} onChange={handleInputChange} className={inputStyles}>
                            <option value="">Select Gender</option>
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                            <option value="Non-binary">Non-binary</option>
                            <option value="Other">Other</option>
                            <option value="Prefer not to say">Prefer not to say</option>
                        </select>
                     </div>
                   </div>
                   <div><label htmlFor="profileImage" className={labelStyles}>Profile Image</label><PhotoUpload onPhotosUpload={handleProfileImageUpload} multiple={false} />{!formData.profileImage && <p className="text-sm text-red-500 mt-1">Profile image is required.</p>}</div>
              </div>
    );

    const step2Content = (
              <div className="space-y-6">
                  <h3 className="text-xl font-serif text-deep-navy border-b border-silver pb-2">Location &amp; Details</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div><label htmlFor="city" className={labelStyles}>City</label><input type="text" name="city" value={formData.city} onChange={handleInputChange} required className={inputStyles} /></div>
                      <div><label htmlFor="state" className={labelStyles}>State / Province</label><input type="text" name="state" value={formData.state} onChange={handleInputChange} className={inputStyles} /></div>
                      <div><label htmlFor="country" className={labelStyles}>Country</label><select name="country" value={formData.country} onChange={handleInputChange} required className={inputStyles}>{countries.map(c => <option key={c} value={c}>{c}</option>)}</select></div>
                  </div>
                  <div>
                      <label htmlFor="causeOfDeathInput" className={labelStyles}>Cause of Death (Optional)</label>
                      <input type="text" id="causeOfDeathInput" value={causeOfDeathInput} onChange={(e) => setCauseOfDeathInput(e.target.value)} onKeyDown={handleCauseOfDeathKeyDown} list="cause_suggestions" placeholder="Type and press Enter to add" className={inputStyles} />
                      <datalist id="cause_suggestions">{causeOfDeathSuggestions.map(s => <option key={s} value={s} />)}</datalist>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {formData.causeOfDeath.map(tag => ( <span key={tag} className="bg-silver text-deep-navy text-sm font-medium px-2.5 py-1 rounded-full flex items-center">{tag}<button type="button" onClick={() => removeCauseOfDeath(tag)} className="ml-1.5 text-soft-gray hover:text-deep-navy">&times;</button></span>))}
                      </div>
                       <div className="mt-2 flex items-center"><input type="checkbox" name="isCauseOfDeathPrivate" checked={formData.isCauseOfDeathPrivate} onChange={handleInputChange} className="h-4 w-4 text-dusty-blue rounded border-soft-gray" /><label htmlFor="isCauseOfDeathPrivate" className="ml-2 text-sm text-deep-navy/90">Don't show on memorial page (Private)</label></div>
                  </div>
              </div>
    );

    const bioSection = (
        <div className="space-y-6">
            <h3 className="text-xl font-serif text-deep-navy border-b border-silver pb-2">The Life Story</h3>
            <div className="bg-pale-sky/60 p-4 rounded-lg border border-silver">
                <h4 className="font-semibold text-deep-navy">AI Biography Assistant</h4>
                <p className="text-sm text-soft-gray mb-2">Struggling for words? Provide a few details and let our AI help you write a beautiful tribute.</p>
                <div className="space-y-3">
                    <div><label htmlFor="relationship" className={labelStyles}>Your Relationship to Deceased</label><input type="text" name="relationship" value={formData.relationship} onChange={handleInputChange} className={inputStyles.replace('bg-pale-sky', 'bg-white')} placeholder="e.g. Daughter, Friend, Sibling" /></div>
                    <div><label htmlFor="personalityTraits" className={labelStyles}>Personality Traits</label><textarea id="personalityTraits" value={personalityTraits} onChange={(e) => setPersonalityTraits(e.target.value)} rows={2} className={inputStyles.replace('bg-pale-sky', 'bg-white')} placeholder="e.g. Kind, adventurous, stubborn but loving"></textarea></div>
                    <div><label htmlFor="keyMemories" className={labelStyles}>Key Memories & Life Highlights</label><textarea id="keyMemories" value={keyMemories} onChange={(e) => setKeyMemories(e.target.value)} rows={3} className={inputStyles.replace('bg-pale-sky', 'bg-white')} placeholder="Mention hobbies, career, favorite sayings, or specific memories..."></textarea></div>
                    <button type="button" onClick={handleGenerateBio} disabled={isGeneratingBio} className="w-full sm:w-auto px-4 py-2 bg-dusty-blue text-white font-semibold rounded-md text-sm hover:opacity-90 disabled:bg-soft-gray">{isGeneratingBio ? 'Generating...' : 'Generate Biography'}</button>
                </div>
            </div>
            <div>
                <label htmlFor="biography" className={labelStyles}>Full Biography</label>
                <RichTextEditor {...bioProps} />
            </div>
        </div>
    );
      
    const gallerySection = (
        <div className="space-y-6">
            <h3 className="text-xl font-serif text-deep-navy border-b border-silver pb-2">Media Gallery</h3>
            <div><label className={labelStyles}>Upload Photos, Videos, Audio & Documents</label><MediaUpload onMediaUpload={handleMediaUpload} multiple /></div>
            <div className="border-t border-silver pt-4"><label className={labelStyles}>Add External Links (e.g., YouTube, Social Media)</label><div className="flex items-center gap-2 mt-1"><input type="text" value={linkTitle} onChange={e => setLinkTitle(e.target.value)} placeholder="Link Title" className={inputStyles} /><input type="url" value={linkUrl} onChange={e => setLinkUrl(e.target.value)} placeholder="https://example.com" className={inputStyles} /><button type="button" onClick={handleAddLink} className="px-4 py-2 bg-silver text-deep-navy font-semibold rounded-md text-sm hover:bg-soft-gray/80 whitespace-nowrap">Add Link</button></div></div>
            {formData.gallery.length > 0 && <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">{formData.gallery.map(item => (<div key={item.id} className="bg-pale-sky p-2 rounded-md text-sm relative"><p className="truncate pr-8">{item.type === 'link' ? item.title : item.fileName}</p><button type="button" onClick={() => handleDeleteGalleryItem(item.id)} className="absolute top-1 right-1 text-red-500 hover:text-red-700 font-bold">&times;</button></div>))}</div>}
        </div>
    );

    const themeSection = (
        <div className="space-y-6">
            <h3 className="text-xl font-serif text-deep-navy border-b border-silver pb-2">Select a Theme</h3>
            {isGeneratingThemes ? <p>Analyzing biography to suggest themes...</p> : <div className="space-y-4">{aiRecommendedThemes.length > 0 && <div className="space-y-2"><h4 className="font-semibold text-deep-navy">Recommended For You</h4>{aiRecommendedThemes.map(t => <ThemePreviewCard key={t.name} theme={t} isSelected={selectedTheme === t.name} isRecommended={true} onClick={() => setSelectedTheme(t.name)} />)}</div>}<div className="space-y-2 pt-4 border-t border-silver"><h4 className="font-semibold text-deep-navy">All Themes</h4>{standardThemes.map(t => <ThemePreviewCard key={t.name} theme={t} isSelected={selectedTheme === t.name} isRecommended={false} onClick={() => setSelectedTheme(t.name)} />)}</div></div>}
        </div>
    );

    const donationSection = (
        <div className="space-y-6">
             <h3 className="text-xl font-serif text-deep-navy border-b border-silver pb-2">Donation Settings</h3>
             <div className="bg-pale-sky/40 p-4 rounded-lg border border-silver">
                <div className="flex items-center mb-4">
                    <input type="checkbox" id="isEnabled" name="isEnabled" checked={formData.donationInfo.isEnabled} onChange={handleDonationInfoChange} className="h-5 w-5 text-dusty-blue rounded border-silver focus:ring-dusty-blue" />
                    <label htmlFor="isEnabled" className="ml-2 block text-sm font-medium text-deep-navy">Enable Donations</label>
                </div>
                {formData.donationInfo.isEnabled && (
                    <div className="space-y-4 animate-fade-in">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div><label htmlFor="recipient" className={labelStyles}>Recipient Name</label><input type="text" name="recipient" value={formData.donationInfo.recipient} onChange={handleDonationInfoChange} className={inputStyles} placeholder="Who will receive the funds?" /></div>
                            <div><label htmlFor="goal" className={labelStyles}>Goal Amount ($)</label><input type="number" name="goal" value={formData.donationInfo.goal} onChange={handleDonationInfoChange} className={inputStyles} placeholder="Optional" /></div>
                        </div>
                        <div><label htmlFor="purpose" className={labelStyles}>Purpose</label><select name="purpose" value={formData.donationInfo.purpose} onChange={handleDonationInfoChange} className={inputStyles}>{donationPurposes.map(p => <option key={p} value={p}>{p}</option>)}</select></div>
                        <div><label htmlFor="description" className={labelStyles}>Description</label><textarea name="description" value={formData.donationInfo.description} onChange={handleDonationInfoChange} rows={3} className={inputStyles} placeholder="Explain what the donations will be used for..." /></div>
                        <div className="flex items-center"><input type="checkbox" name="showDonorWall" checked={formData.donationInfo.showDonorWall} onChange={handleDonationInfoChange} className="h-4 w-4 text-dusty-blue rounded border-silver focus:ring-dusty-blue" /><label htmlFor="showDonorWall" className="ml-2 text-sm text-deep-navy">Show Public Donor Wall</label></div>
                    </div>
                )}
             </div>
        </div>
    );

    const renderTabContent = () => {
        const tabs = [
            { id: 'info', label: 'Details' },
            { id: 'bio', label: 'Biography' },
            { id: 'gallery', label: 'Gallery' },
            { id: 'theme', label: 'Theme' },
            { id: 'donations', label: 'Donations' }
        ];

        return (
            <div className="space-y-6">
                <div className="border-b border-silver overflow-x-auto">
                    <nav className="-mb-px flex space-x-8" aria-label="Tabs">
                        {tabs.map(tab => (
                            <button
                                key={tab.id}
                                type="button"
                                onClick={() => setCurrentTab(tab.id)}
                                className={`${
                                    currentTab === tab.id
                                        ? 'border-dusty-blue text-dusty-blue'
                                        : 'border-transparent text-soft-gray hover:text-deep-navy hover:border-gray-300'
                                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors`}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </nav>
                </div>
                
                <div className="mt-6">
                    {currentTab === 'info' && <div className="space-y-8">{step1Content}{step2Content}</div>}
                    {currentTab === 'bio' && bioSection}
                    {currentTab === 'gallery' && gallerySection}
                    {currentTab === 'theme' && themeSection}
                    {currentTab === 'donations' && donationSection}
                </div>
            </div>
        );
    };

    const renderStepContent = () => {
        switch (step) {
            case 1: return step1Content;
            case 2: return step2Content;
            case 3: return bioSection;
            case 4: return gallerySection;
            case 5: return themeSection;
            default: return null;
        }
    };

    if (!isDataLoaded) return <p>Loading editor...</p>;

    return (
        <div className="max-w-4xl mx-auto animate-fade-in">
          <UpgradeModal isOpen={isUpgradeModalOpen} onClose={() => setIsUpgradeModalOpen(false)} reason={upgradeReason} />
          <AuthRequiredModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} onAuthRedirect={handleAuthRedirect} />
          
          <h1 className="text-3xl sm:text-4xl font-serif font-bold text-deep-navy text-center mb-2">
            {isEditMode ? isDraft ? 'Complete & Publish Memorial' : 'Edit Memorial' : 'Create a Memorial'}
          </h1>
          <p className="text-lg text-soft-gray text-center mb-8">
            {isEditMode ? 'Update the details below and save your changes.' : 'Follow the steps to create a beautiful tribute.'}
          </p>

          <div className="bg-white p-6 sm:p-8 rounded-lg shadow-sm border border-silver">
            <form onSubmit={handleSubmit}>
              {isEditMode ? renderTabContent() : renderStepContent()}
              
               <div className="mt-8 pt-6 border-t border-silver flex justify-between items-center">
                    {!isEditMode && step > 1 ? (
                        <button type="button" onClick={prevStep} className="px-6 py-2 bg-silver hover:bg-soft-gray/80 text-deep-navy font-bold rounded-lg transition-colors">Back</button>
                    ) : <div></div>}
                    
                    {isEditMode ? (
                         <button type="submit" className="px-8 py-2 bg-dusty-blue hover:opacity-90 text-white font-bold rounded-lg transition-colors">
                            {isDraft ? 'Publish Memorial' : 'Save Changes'}
                         </button>
                    ) : (
                        step < 5 ? (
                            <button type="button" onClick={nextStep} className="px-8 py-2 bg-dusty-blue hover:opacity-90 text-white font-bold rounded-lg transition-colors">Next</button>
                        ) : (
                            <button type="submit" className="px-8 py-2 bg-dusty-blue hover:opacity-90 text-white font-bold rounded-lg transition-colors">Create Memorial</button>
                        )
                    )}
                </div>
            </form>
          </div>
        </div>
    );
};

export default CreateMemorialPage;

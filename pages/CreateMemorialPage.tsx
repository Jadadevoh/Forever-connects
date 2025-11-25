

import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link, useLocation } from 'react-router-dom';
import { useMemorials } from '../hooks/useMemorials';
import { Photo, Memorial, GalleryItem, LinkItem, Theme, MemorialPlan, MediaItem, MemorialCreationData, DonationInfo } from '../types';
import { generateBiography, generateThemeSuggestions } from '../services/geminiService';
import { standardThemes } from '../themes';
import PhotoUpload from '../components/PhotoUpload';
import MediaUpload from '../components/MediaUpload';
import UpgradeModal from '../components/UpgradeModal';
import AuthRequiredModal from '../components/AuthRequiredModal';
import { useAuth } from '../hooks/useAuth';
import { useGuestMemorial } from '../hooks/useGuestMemorial';

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
    firstName: '',
    middleName: '',
    lastName: '',
    birthDate: '',
    deathDate: '',
    gender: '',
    city: '',
    state: '',
    country: '',
    causeOfDeath: [],
    isCauseOfDeathPrivate: false,
    relationship: '',
    profileImage: null,
    biography: '',
    gallery: [],
    plan: 'free',
    donationInfo: {
        isEnabled: false,
        recipient: '',
        goal: 0,
        description: '',
        showDonorWall: true,
        suggestedAmounts: [25, 50, 100, 250],
        purpose: 'General Support for the Family',
    },
    emailSettings: {
        senderName: '',
        replyToEmail: '',
        headerImageUrl: '',
        footerMessage: '',
    }
  });
  const [isDataLoaded, setIsDataLoaded] = useState(false);
  
  // State for AI Assistant
  const [personalityTraits, setPersonalityTraits] = useState('');
  const [keyMemories, setKeyMemories] = useState('');
  
  const [isGeneratingBio, setIsGeneratingBio] = useState(false);
  const [isGeneratingThemes, setIsGeneratingThemes] = useState(false);

  // State for link form
  const [linkUrl, setLinkUrl] = useState('');
  const [linkTitle, setLinkTitle] = useState('');

  // State for cause of death input
  const [causeOfDeathInput, setCauseOfDeathInput] = useState('');

  // State for themes
  const [aiRecommendedThemes, setAiRecommendedThemes] = useState<Theme[]>([]);
  const [selectedTheme, setSelectedTheme] = useState<string>(standardThemes[0].name);

  // State for Modals
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
            // Authorization check
            if (memorialToEdit.userId !== currentUser?.id) {
                alert("You are not authorized to edit this memorial.");
                navigate('/dashboard');
                return;
            }
            const fullName = [memorialToEdit.firstName, memorialToEdit.middleName, memorialToEdit.lastName].filter(Boolean).join(' ');
            const formDataToSet: MemorialCreationData = {
                firstName: memorialToEdit.firstName,
                middleName: memorialToEdit.middleName || '',
                lastName: memorialToEdit.lastName,
                birthDate: memorialToEdit.birthDate,
                deathDate: memorialToEdit.deathDate,
                gender: memorialToEdit.gender || '',
                city: memorialToEdit.city,
                state: memorialToEdit.state || '',
                country: memorialToEdit.country,
                causeOfDeath: memorialToEdit.causeOfDeath,
                isCauseOfDeathPrivate: memorialToEdit.isCauseOfDeathPrivate,
                relationship: '', // This is for AI generation, not stored
                profileImage: memorialToEdit.profileImage,
                biography: memorialToEdit.biography,
                gallery: memorialToEdit.gallery,
                plan: memorialToEdit.plan,
                donationInfo: memorialToEdit.donationInfo || { isEnabled: false, recipient: '', goal: 0, description: '', showDonorWall: true, suggestedAmounts: [25, 50, 100, 250], purpose: 'General Support for the Family' },
                emailSettings: memorialToEdit.emailSettings || {
                    senderName: `${fullName} Tribute Team`,
                    replyToEmail: currentUser?.email || '',
                    headerImageUrl: memorialToEdit.profileImage.dataUrl,
                    footerMessage: `In loving memory of ${fullName}.`,
                },
            };
            setFormData(formDataToSet);
            setSelectedTheme(memorialToEdit.theme);
            window.localStorage.removeItem(DRAFT_STORAGE_KEY);
        } else {
            alert("Memorial not found.");
            navigate('/');
        }
    } else {
        try {
            const savedDraft = window.localStorage.getItem(DRAFT_STORAGE_KEY);
            if (savedDraft) {
                const parsedDraft = JSON.parse(savedDraft);
                if (parsedDraft && typeof parsedDraft === 'object') setFormData(parsedDraft);
            } else {
                 // Set initial defaults for new memorials
                 setFormData(prev => ({
                    ...prev,
                    emailSettings: {
                        ...prev.emailSettings,
                        replyToEmail: currentUser?.email || '',
                    }
                }));
            }
        } catch (error) { console.error("Error reading draft from localStorage", error); }
    }
    setIsDataLoaded(true);
  }, [isEditMode, editId, getMemorialById, navigate, currentUser]);

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
    // Auto-update email setting defaults when name changes (for new memorials only)
    if (!isEditMode) {
      const fullName = [formData.firstName, formData.middleName, formData.lastName].filter(Boolean).join(' ');
      if (fullName) {
        setFormData(prev => ({
          ...prev,
          emailSettings: {
            ...prev.emailSettings,
            senderName: `${fullName} Tribute Team`,
            footerMessage: `In loving memory of ${fullName}.`,
          }
        }));
      }
    }
  }, [formData.firstName, formData.middleName, formData.lastName, isEditMode]);


  useEffect(() => {
    const fetchThemeSuggestions = async () => {
        if ((step === 5 || (isEditMode && currentTab === 'theme')) && formData.biography.trim() && aiRecommendedThemes.length === 0) {
            setIsGeneratingThemes(true);
            const suggestions = await generateThemeSuggestions(formData.biography);
            setAiRecommendedThemes(suggestions);
            if (suggestions.length > 0 && !isEditMode) {
                setSelectedTheme(suggestions[0].name);
            }
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

    if (type === 'checkbox') {
        finalValue = (e.target as HTMLInputElement).checked;
    } else if (name === 'goal') { // Check by name for the number input
        finalValue = value === '' ? 0 : parseInt(value, 10);
        if (isNaN(finalValue)) {
            finalValue = 0;
        }
    }

    setFormData(prev => ({
        ...prev,
        donationInfo: {
            ...prev.donationInfo,
            [name]: finalValue,
        }
    }));
  };

  const handleEmailSettingsChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const { name, value } = e.target;
      setFormData(prev => ({
          ...prev,
          emailSettings: { ...prev.emailSettings, [name]: value }
      }));
  };

  const handleProfileImageUpload = (photos: Photo[]) => {
    if (photos.length > 0) {
      const newProfileImage = photos[0];
      setFormData(p => ({
        ...p,
        profileImage: newProfileImage,
        // If the email logo hasn't been customized, default it to the profile photo
        emailSettings: {
          ...p.emailSettings,
          headerImageUrl: p.emailSettings.headerImageUrl || newProfileImage.dataUrl,
        }
      }));
    }
  };

  const handleEmailLogoUpload = (photos: Photo[]) => {
      if (photos.length > 0) {
          setFormData(p => ({
              ...p,
              emailSettings: { ...p.emailSettings, headerImageUrl: photos[0].dataUrl }
          }));
      }
  };

  const handleSuggestedAmountsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const amounts = value.split(',')
      .map(s => parseInt(s.trim(), 10))
      .filter(n => !isNaN(n) && n > 0);

    setFormData(prev => ({
      ...prev,
      donationInfo: {
        ...prev.donationInfo,
        suggestedAmounts: amounts,
      }
    }));
  };

  const handleGenerateBio = async () => {
    if (!keyMemories.trim() && !personalityTraits.trim()) {
      alert("Please provide some personality traits or key memories for the biography.");
      return;
    }
    setIsGeneratingBio(true);
    const fullName = [formData.firstName, formData.middleName, formData.lastName].filter(Boolean).join(' ');
    const generatedBio = await generateBiography({
      name: fullName,
      relationship: formData.relationship,
      personalityTraits,
      keyMemories
    });
    setFormData(prev => ({ ...prev, biography: generatedBio }));
    setIsGeneratingBio(false);
  };

  const handleMediaUpload = (items: MediaItem[]) => {
    if (formData.plan === 'free') {
        const currentImages = formData.gallery.filter(item => item.type === 'image').length;
        const newImages = items.filter(item => item.type === 'image').length;
        const hasPremiumMedia = items.some(item => ['video', 'audio'].includes(item.type));

        if (hasPremiumMedia) {
            setUpgradeReason('to upload videos and audio files');
            setIsUpgradeModalOpen(true);
            return;
        }

        if (currentImages + newImages > 5) {
            setUpgradeReason('to upload more than 5 photos');
            setIsUpgradeModalOpen(true);
            return;
        }
    }
    setFormData(p => ({...p, gallery: [...p.gallery, ...items]}));
  };

  const handleAddLink = () => {
    if (!linkUrl.trim() || !linkTitle.trim()) {
        alert('Please provide both a URL and a title for the link.');
        return;
    }
    try {
      new URL(linkUrl); // Validate URL
    } catch (_) {
      alert('Please enter a valid URL.');
      return;
    }

    const newLink: LinkItem = {
        id: `link-${Date.now()}`,
        type: 'link',
        url: linkUrl,
        title: linkTitle,
    };
    setFormData(p => ({ ...p, gallery: [...p.gallery, newLink]}));
    setLinkUrl('');
    setLinkTitle('');
  };

  const handleDeleteGalleryItem = (id: string) => {
    setFormData(p => ({
        ...p,
        gallery: p.gallery.filter(item => item.id !== id)
    }));
  };

  const handleCauseOfDeathKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && causeOfDeathInput.trim() !== '') {
      e.preventDefault();
      if (!formData.causeOfDeath.includes(causeOfDeathInput.trim())) {
        setFormData(prev => ({
          ...prev,
          causeOfDeath: [...prev.causeOfDeath, causeOfDeathInput.trim()]
        }));
      }
      setCauseOfDeathInput('');
    }
  };

  const removeCauseOfDeath = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      causeOfDeath: prev.causeOfDeath.filter(tag => tag !== tagToRemove)
    }));
  };

  const nextStep = () => setStep(s => s + 1);
  const prevStep = () => setStep(s => s - 1);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.profileImage) {
      alert("Please upload a profile image.");
      isEditMode ? setCurrentTab('info') : setStep(1);
      return;
    }
    if (!selectedTheme) {
        alert("Please select a theme for the memorial.");
        isEditMode ? setCurrentTab('theme') : setStep(5);
        return;
    }

    if (isEditMode && editId) {
        // Handle Update
        const originalMemorial = getMemorialById(editId);
        if (!originalMemorial) {
            alert("Error: Could not find the memorial to update.");
            return;
        }
        const { relationship, ...dataToSave } = formData;
        const updatedMemorial: Memorial = {
            ...originalMemorial,
            ...dataToSave,
            gender: dataToSave.gender || undefined,
            middleName: dataToSave.middleName || undefined,
            state: dataToSave.state || undefined,
            profileImage: formData.profileImage,
            theme: selectedTheme,
            status: isDraft ? 'active' : originalMemorial.status, // Publish the draft
        };
        updateMemorial(editId, updatedMemorial);
        navigate(`/memorial/${updatedMemorial.slug}`);

    } else {
        // Handle Create
        if (!isLoggedIn) {
            setIsAuthModalOpen(true);
            return;
        }

        const { relationship, ...dataToSave } = formData;
        const memorialData: Omit<Memorial, 'id' | 'slug'> = {
            ...dataToSave,
            tributes: [],
            donations: [],
            gender: dataToSave.gender || undefined,
            userId: currentUser?.id,
            middleName: dataToSave.middleName || undefined,
            state: dataToSave.state || undefined,
            profileImage: formData.profileImage,
            theme: selectedTheme,
            status: 'active',
        };
        const newMemorial = addMemorial(memorialData);
        navigate(`/memorial/${newMemorial.slug}`);
    }
  };

  const handleAuthRedirect = (path: '/login' | '/signup') => {
    const { relationship, ...dataToSave } = formData;
    const finalData: Omit<Memorial, 'id' | 'userId' | 'tributes' | 'slug'> = {
        ...dataToSave,
        profileImage: formData.profileImage!,
        theme: selectedTheme,
        status: 'draft',
    };
    saveGuestMemorial(finalData);
    navigate(path, { state: { fromCreate: true } });
};

  const renderGalleryItemIcon = (item: GalleryItem) => {
    switch (item.type) {
        case 'image': return <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-dusty-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14" /></svg>;
        case 'video': return <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-dusty-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>;
        case 'audio': return <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-dusty-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-12c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 6l12 3" /></svg>;
        case 'document': return <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-dusty-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>;
        case 'link': return <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-dusty-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" /></svg>;
        default: return null;
    }
  }

  const exportDonationsToCSV = () => {
    if (!memorialToEdit || memorialToEdit.donations.length === 0) {
      alert("No donations to export.");
      return;
    }
    const headers = ["Date", "Name", "Amount", "Message", "Is Anonymous"];
    const rows = memorialToEdit.donations.map(d => [
      new Date(d.date).toLocaleString(),
      `"${d.name.replace(/"/g, '""')}"`,
      d.amount,
      `"${d.message.replace(/"/g, '""')}"`,
      d.isAnonymous
    ].join(','));
    
    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(','), ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    const memorialName = [memorialToEdit.firstName, memorialToEdit.lastName].join('-');
    link.setAttribute("download", `donations-${memorialName}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const renderStepContent = (stepNum: number) => {
    switch(stepNum) {
      case 1:
        return (
          <div>
            <h2 className="text-2xl font-serif text-deep-navy mb-6">Basic Information</h2>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label htmlFor="firstName" className={labelStyles}>First Name</label>
                    <input type="text" name="firstName" id="firstName" value={formData.firstName} onChange={handleInputChange} required className={inputStyles} />
                  </div>
                  <div>
                    <label htmlFor="middleName" className={labelStyles}>Middle Name (Optional)</label>
                    <input type="text" name="middleName" id="middleName" value={formData.middleName} onChange={handleInputChange} className={inputStyles} />
                  </div>
                  <div>
                    <label htmlFor="lastName" className={labelStyles}>Last Name</label>
                    <input type="text" name="lastName" id="lastName" value={formData.lastName} onChange={handleInputChange} required className={inputStyles} />
                  </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label htmlFor="gender" className={labelStyles}>Gender (Optional)</label>
                    <select name="gender" id="gender" value={formData.gender} onChange={handleInputChange} className={inputStyles}>
                        <option value="">Select Gender</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                        <option value="Prefer not to say">Prefer not to say</option>
                    </select>
                </div>
                <div>
                  <label htmlFor="relationship" className={labelStyles}>Your Relationship to Deceased</label>
                  <input type="text" name="relationship" id="relationship" value={formData.relationship} onChange={handleInputChange} placeholder="e.g. Parent, Sibling, Friend" className={inputStyles} list="relationships" required />
                  <datalist id="relationships">
                      <option value="Parent" />
                      <option value="Sibling" />
                      <option value="Child" />
                      <option value="Spouse" />
                      <option value="Partner" />
                      <option value="Grandparent" />
                      <option value="Grandchild" />
                      <option value="Friend" />
                      <option value="Colleague" />
                      <option value="Aunt" />
                      <option value="Uncle" />
                      <option value="Cousin" />
                      <option value="Niece" />
                      <option value="Nephew" />
                      <option value="Relative" />
                  </datalist>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <div>
                  <label htmlFor="birthDate" className={labelStyles}>Date of Birth</label>
                  <input type="date" name="birthDate" id="birthDate" value={formData.birthDate} onChange={handleInputChange} required className={inputStyles} />
                </div>
                <div>
                  <label htmlFor="deathDate" className={labelStyles}>Date of Passing</label>
                  <input type="date" name="deathDate" id="deathDate" value={formData.deathDate} onChange={handleInputChange} required className={inputStyles} />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label htmlFor="city" className={labelStyles}>City</label>
                  <input type="text" name="city" id="city" value={formData.city} onChange={handleInputChange} required className={inputStyles} />
                </div>
                <div>
                  <label htmlFor="state" className={labelStyles}>State / Province (Optional)</label>
                  <input type="text" name="state" id="state" value={formData.state} onChange={handleInputChange} className={inputStyles} />
                </div>
                <div>
                  <label htmlFor="country" className={labelStyles}>Country</label>
                  <select name="country" id="country" value={formData.country} onChange={handleInputChange} required className={inputStyles}>
                    <option value="" disabled>Select a country</option>
                    {countries.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
              </div>
               <div>
                <label htmlFor="causeOfDeath" className={labelStyles}>Cause of Death (Optional)</label>
                <div className="mt-1">
                    <input 
                        type="text" 
                        id="causeOfDeath" 
                        value={causeOfDeathInput} 
                        onChange={(e) => setCauseOfDeathInput(e.target.value)} 
                        onKeyDown={handleCauseOfDeathKeyDown}
                        placeholder="Type cause and press Enter" 
                        className={inputStyles} 
                        list="causes"
                    />
                    <datalist id="causes">
                        {causeOfDeathSuggestions.map(c => <option key={c} value={c} />)}
                    </datalist>
                </div>
                <div className="mt-2 flex flex-wrap gap-2">
                    {formData.causeOfDeath.map(cause => (
                        <span key={cause} className="inline-flex items-center py-1 pl-3 pr-2 rounded-full text-sm font-medium bg-dusty-blue text-white">
                            {cause}
                            <button type="button" onClick={() => removeCauseOfDeath(cause)} className="ml-1 flex-shrink-0 h-4 w-4 rounded-full inline-flex items-center justify-center text-white/70 hover:bg-white/20 focus:outline-none">
                                <span className="sr-only">Remove</span>
                                <svg className="h-2 w-2" stroke="currentColor" fill="none" viewBox="0 0 8 8"><path strokeLinecap="round" strokeWidth="1.5" d="M1 1l6 6m0-6L1 7" /></svg>
                            </button>
                        </span>
                    ))}
                </div>
                 <div className="mt-2 flex items-center">
                    <input id="isCauseOfDeathPrivate" name="isCauseOfDeathPrivate" type="checkbox" checked={formData.isCauseOfDeathPrivate} onChange={handleInputChange} className="h-4 w-4 rounded bg-pale-sky border-soft-gray text-dusty-blue focus:ring-dusty-blue" />
                    <label htmlFor="isCauseOfDeathPrivate" className="ml-2 block text-sm text-deep-navy/80">Don't show on tribute page (Private)</label>
                </div>
              </div>
               <div>
                <label className={labelStyles}>Profile Image</label>
                <PhotoUpload onPhotosUpload={handleProfileImageUpload} multiple={false} />
              </div>
            </div>
          </div>
        );
      case 2:
        return (
          <div>
            <h2 className="text-2xl font-serif text-deep-navy mb-6">AI Biography Assistant</h2>
            <div className="space-y-4">
               <div>
                <label htmlFor="personalityTraits" className={labelStyles}>Personality Traits</label>
                <input type="text" id="personalityTraits" value={personalityTraits} onChange={(e) => setPersonalityTraits(e.target.value)} placeholder="e.g. Kind, adventurous, stubborn but loving" className={inputStyles} />
              </div>
              <div>
                <label htmlFor="keyMemories" className={labelStyles}>Key Memories & Life Highlights</label>
                <textarea id="keyMemories" value={keyMemories} onChange={(e) => setKeyMemories(e.target.value)} rows={6} className={inputStyles} placeholder="Mention hobbies, career, favorite sayings, or specific memories..."></textarea>
                 <button type="button" onClick={handleGenerateBio} disabled={isGeneratingBio} className="mt-2 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-dusty-blue hover:opacity-90 disabled:bg-soft-gray">
                  {isGeneratingBio ? 'Generating...' : 'Generate Biography'}
                </button>
              </div>
            </div>
            <div className="mt-6">
              <label htmlFor="biography" className={labelStyles}>Full Biography (edit as needed)</label>
              <textarea id="biography" name="biography" value={formData.biography} onChange={handleInputChange} rows={12} required className={inputStyles} />
            </div>
          </div>
        );
      case 3:
        return (
          <div>
            <h2 className="text-2xl font-serif text-deep-navy mb-6">Media Gallery</h2>
            
            <div className="space-y-8">
                {/* File Upload Section */}
                <div>
                    <h3 className="text-lg font-semibold text-deep-navy/90 mb-2">Upload Files</h3>
                    <p className="text-sm text-soft-gray mb-4">Upload photos, videos, audio, and documents to create a gallery of cherished memories.</p>
                    <MediaUpload onMediaUpload={handleMediaUpload} multiple={true} />
                </div>

                {/* Link Section */}
                <div>
                    <h3 className="text-lg font-semibold text-deep-navy/90 mb-2">Add External Links</h3>
                     <p className="text-sm text-soft-gray mb-4">Include links to YouTube videos, social media profiles, or other websites.</p>
                    <div className="space-y-3 p-4 bg-pale-sky border border-silver rounded-lg">
                        <div>
                            <label htmlFor="linkTitle" className={labelStyles}>Link Title</label>
                            <input type="text" id="linkTitle" value={linkTitle} onChange={(e) => setLinkTitle(e.target.value)} placeholder="e.g. John's YouTube Channel" className={inputStyles} />
                        </div>
                        <div>
                            <label htmlFor="linkUrl" className={labelStyles}>URL</label>
                            <input type="url" id="linkUrl" value={linkUrl} onChange={(e) => setLinkUrl(e.target.value)} placeholder="https://youtube.com/..." className={inputStyles} />
                        </div>
                        <div className="text-right">
                             <button type="button" onClick={handleAddLink} className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-dusty-blue hover:opacity-90">
                              Add Link
                            </button>
                        </div>
                    </div>
                </div>

                {/* Gallery Preview Section */}
                {formData.gallery.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold text-deep-navy/90 mb-4">Gallery Preview</h3>
                    <div className="space-y-3">
                      {formData.gallery.map(item => (
                        <div key={item.id} className="flex items-center justify-between p-3 bg-pale-sky rounded-md border border-silver">
                          <div className="flex items-center space-x-3 overflow-hidden">
                            <div className="flex-shrink-0">{renderGalleryItemIcon(item)}</div>
                            <span className="text-sm text-deep-navy font-medium truncate">
                                {item.type === 'link' ? item.title : (item as MediaItem).fileName}
                            </span>
                          </div>
                          <button type="button" onClick={() => handleDeleteGalleryItem(item.id)} className="text-red-500 hover:text-red-700 flex-shrink-0 ml-4">
                             <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" /></svg>
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
            </div>
          </div>
        );
      case 4:
        const totalDonations = memorialToEdit?.donations.reduce((sum, d) => sum + d.amount, 0) || 0;
        const numDonors = memorialToEdit?.donations.length || 0;
        return (
            <div>
                <h2 className="text-2xl font-serif text-deep-navy mb-6">Donation Management</h2>
                <div className="space-y-4 p-4 bg-pale-sky border border-silver rounded-lg">
                    <div className="flex items-center">
                        <input id="isEnabled" name="isEnabled" type="checkbox" checked={formData.donationInfo.isEnabled} onChange={handleDonationInfoChange} className="h-4 w-4 rounded bg-white border-soft-gray text-dusty-blue focus:ring-dusty-blue" />
                        <label htmlFor="isEnabled" className="ml-3 block text-base font-medium text-deep-navy">Enable Donations on this Memorial</label>
                    </div>
                    {formData.donationInfo.isEnabled && (
                        <div className="space-y-4 pl-7 pt-2 border-l-2 border-dusty-blue/30">
                            <div>
                                <label htmlFor="purpose" className={labelStyles}>Purpose of Donations</label>
                                <select 
                                    name="purpose" 
                                    id="purpose" 
                                    value={formData.donationInfo.purpose} 
                                    onChange={handleDonationInfoChange} 
                                    className={inputStyles}
                                >
                                    {donationPurposes.map(p => <option key={p} value={p}>{p}</option>)}
                                </select>
                            </div>
                            <div>
                                <label htmlFor="recipient" className={labelStyles}>Donation Recipient</label>
                                <input type="text" name="recipient" id="recipient" value={formData.donationInfo.recipient} onChange={handleDonationInfoChange} placeholder="e.g. The Doe Family, Cancer Research Fund" className={inputStyles} />
                            </div>
                            <div>
                                <label htmlFor="description" className={labelStyles}>Cause / Description</label>
                                <textarea name="description" id="description" value={formData.donationInfo.description} onChange={handleDonationInfoChange} rows={3} className={inputStyles} placeholder="Describe where the donations will go..."></textarea>
                            </div>
                            <div>
                                <label htmlFor="goal" className={labelStyles}>Fundraising Goal (Optional)</label>
                                <div className="relative mt-1">
                                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                        <span className="text-soft-gray sm:text-sm">$</span>
                                    </div>
                                    <input type="number" name="goal" id="goal" value={formData.donationInfo.goal > 0 ? formData.donationInfo.goal : ''} onChange={handleDonationInfoChange} placeholder="0.00" className={`${inputStyles} pl-7`} />
                                </div>
                            </div>
                            <div>
                                <label htmlFor="suggestedAmounts" className={labelStyles}>Suggested Amounts (comma-separated)</label>
                                <input type="text" name="suggestedAmounts" id="suggestedAmounts" value={formData.donationInfo.suggestedAmounts.join(', ')} onChange={handleSuggestedAmountsChange} placeholder="e.g. 25, 50, 100, 250" className={inputStyles} />
                            </div>
                            <div className="flex items-center">
                                <input id="showDonorWall" name="showDonorWall" type="checkbox" checked={formData.donationInfo.showDonorWall} onChange={handleDonationInfoChange} className="h-4 w-4 rounded bg-white border-soft-gray text-dusty-blue focus:ring-dusty-blue" />
                                <label htmlFor="showDonorWall" className="ml-3 block text-sm text-deep-navy/90">Show a public list of donors on the page</label>
                            </div>
                        </div>
                    )}
                </div>
                {isEditMode && memorialToEdit && (
                    <div className="mt-8 border-t border-silver pt-6">
                        <h3 className="text-xl font-serif text-deep-navy mb-4">Donation Overview</h3>
                        <div className="grid grid-cols-2 gap-4 mb-4">
                            <div className="bg-pale-sky p-4 rounded-lg text-center">
                                <p className="text-sm text-soft-gray">Total Raised</p>
                                <p className="text-2xl font-bold text-deep-navy">${totalDonations.toLocaleString()}</p>
                            </div>
                            <div className="bg-pale-sky p-4 rounded-lg text-center">
                                <p className="text-sm text-soft-gray">Total Donors</p>
                                <p className="text-2xl font-bold text-deep-navy">{numDonors}</p>
                            </div>
                        </div>
                        <div className="flex justify-between items-center mb-4">
                             <h4 className="text-lg text-deep-navy font-semibold">Donor Messages</h4>
                             <div>
                                <button type="button" onClick={exportDonationsToCSV} className="text-sm bg-silver hover:bg-soft-gray/80 text-deep-navy font-medium py-2 px-3 rounded-lg transition-colors mr-2">Export CSV</button>
                                <button type="button" className="text-sm bg-silver hover:bg-soft-gray/80 text-deep-navy font-medium py-2 px-3 rounded-lg transition-colors">Payout Settings</button>
                             </div>
                        </div>
                        <div className="space-y-2 max-h-60 overflow-y-auto pr-2">
                           {memorialToEdit.donations.length > 0 ? memorialToEdit.donations.map(d => (
                                <div key={d.id} className="p-3 bg-white border border-silver rounded-lg text-sm">
                                    <p className="font-semibold text-deep-navy">{d.name} <span className="text-soft-gray font-normal">- ${d.amount.toLocaleString()} on {new Date(d.date).toLocaleDateString()}</span></p>
                                    {d.message && !d.isAnonymous && <p className="text-sm text-deep-navy/80 italic mt-1">"{d.message}"</p>}
                                </div>
                            )) : (
                                <p className="text-sm text-soft-gray text-center py-4">No donations yet.</p>
                            )}
                        </div>
                    </div>
                )}
            </div>
        );
      case 5:
        return (
            <div>
                <h2 className="text-2xl font-serif text-deep-navy mb-2">Select a Theme</h2>
                <p className="text-soft-gray mb-6">Choose a theme that best reflects your loved one's spirit. Our AI has highlighted a few suggestions based on the biography.</p>
                {isGeneratingThemes ? (
                    <div className="flex justify-center items-center h-48">
                        <svg className="animate-spin -ml-1 mr-3 h-10 w-10 text-dusty-blue" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                        <p className="text-soft-gray">Generating theme suggestions...</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {aiRecommendedThemes.length > 0 && (
                            <div>
                                <h3 className="text-lg font-semibold text-deep-navy/90 mb-2">Recommended For You</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {aiRecommendedThemes.map(theme => (
                                        <ThemePreviewCard key={theme.name} theme={theme} isSelected={selectedTheme === theme.name} isRecommended={true} onClick={() => setSelectedTheme(theme.name)} />
                                    ))}
                                </div>
                            </div>
                        )}
                        <div>
                            <h3 className="text-lg font-semibold text-deep-navy/90 mb-2">{aiRecommendedThemes.length > 0 ? 'Other Themes' : 'All Themes'}</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {standardThemes.filter(st => !aiRecommendedThemes.some(ait => ait.name === st.name)).map(theme => (
                                    <ThemePreviewCard key={theme.name} theme={theme} isSelected={selectedTheme === theme.name} isRecommended={false} onClick={() => setSelectedTheme(theme.name)} />
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        );
      case 6: // Email Settings Tab
        return (
            <div>
                <h2 className="text-2xl font-serif text-deep-navy mb-6">Email Notification Settings</h2>
                <div className="space-y-4 p-4 bg-pale-sky border border-silver rounded-lg">
                    <div>
                        <label htmlFor="senderName" className={labelStyles}>Sender Name</label>
                        <p className="text-xs text-soft-gray mb-1">This name will appear in the "From" field of notification emails.</p>
                        <input type="text" name="senderName" id="senderName" value={formData.emailSettings.senderName} onChange={handleEmailSettingsChange} className={inputStyles} />
                    </div>
                    <div>
                        <label htmlFor="replyToEmail" className={labelStyles}>Reply-to Email Address</label>
                         <p className="text-xs text-soft-gray mb-1">When recipients reply, their email will go to this address.</p>
                        <input type="email" name="replyToEmail" id="replyToEmail" value={formData.emailSettings.replyToEmail} onChange={handleEmailSettingsChange} className={inputStyles} />
                    </div>
                    <div>
                        <label className={labelStyles}>Email Header Logo</label>
                        <p className="text-xs text-soft-gray mb-1">Upload a logo to appear at the top of emails. Defaults to the profile photo.</p>
                        <PhotoUpload onPhotosUpload={handleEmailLogoUpload} multiple={false} />
                        {formData.emailSettings.headerImageUrl && (
                            <div className="mt-2 p-2 bg-white border border-silver rounded-md inline-block">
                                <p className="text-xs text-soft-gray mb-1">Logo Preview:</p>
                                <img src={formData.emailSettings.headerImageUrl} alt="Email logo preview" className="max-h-16" />
                            </div>
                        )}
                    </div>
                    <div>
                        <label htmlFor="footerMessage" className={labelStyles}>Email Footer Message</label>
                        <p className="text-xs text-soft-gray mb-1">A custom message to appear at the bottom of all notifications.</p>
                        <textarea name="footerMessage" id="footerMessage" value={formData.emailSettings.footerMessage} onChange={handleEmailSettingsChange} rows={3} className={inputStyles}></textarea>
                    </div>
                </div>
            </div>
        );
      default:
        return null;
    }
  };

  const renderEditContent = (tab: string) => {
      switch(tab) {
          case 'info':
              return renderStepContent(1);
          case 'biography':
              return renderStepContent(2);
          case 'gallery':
              return renderStepContent(3);
          case 'donations':
              return renderStepContent(4);
          case 'email':
              return renderStepContent(6);
          case 'theme':
              return renderStepContent(5);
          default:
              return null;
      }
  };

  if (!isDataLoaded && isEditMode) {
    return (
        <div className="text-center p-12">
            <p className="text-soft-gray">Loading memorial data...</p>
        </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto animate-fade-in">
        <h1 className="text-3xl sm:text-4xl font-serif font-bold text-deep-navy text-center mb-2">{isEditMode ? 'Edit Memorial' : 'Create a Memorial'}</h1>
        <p className="text-lg text-soft-gray text-center mb-8">{isEditMode ? `Update the details for ${memorialToEdit?.firstName || 'your loved one'}.` : 'Follow the steps to build a beautiful tribute.'}</p>
        
        {isEditMode ? (
            <div className="bg-white rounded-lg shadow-sm border border-silver">
                <div className="border-b border-silver flex overflow-x-auto">
                    <button onClick={() => setCurrentTab('info')} className={`flex-1 sm:flex-none whitespace-nowrap px-4 sm:px-6 py-3 font-semibold text-sm sm:text-base transition-colors duration-200 text-center ${currentTab === 'info' ? 'text-deep-navy border-b-2 border-dusty-blue' : 'text-soft-gray hover:text-deep-navy'}`}>Information</button>
                    <button onClick={() => setCurrentTab('biography')} className={`flex-1 sm:flex-none whitespace-nowrap px-4 sm:px-6 py-3 font-semibold text-sm sm:text-base transition-colors duration-200 text-center ${currentTab === 'biography' ? 'text-deep-navy border-b-2 border-dusty-blue' : 'text-soft-gray hover:text-deep-navy'}`}>Biography</button>
                    <button onClick={() => setCurrentTab('gallery')} className={`flex-1 sm:flex-none whitespace-nowrap px-4 sm:px-6 py-3 font-semibold text-sm sm:text-base transition-colors duration-200 text-center ${currentTab === 'gallery' ? 'text-deep-navy border-b-2 border-dusty-blue' : 'text-soft-gray hover:text-deep-navy'}`}>Gallery</button>
                    <button onClick={() => setCurrentTab('donations')} className={`flex-1 sm:flex-none whitespace-nowrap px-4 sm:px-6 py-3 font-semibold text-sm sm:text-base transition-colors duration-200 text-center ${currentTab === 'donations' ? 'text-deep-navy border-b-2 border-dusty-blue' : 'text-soft-gray hover:text-deep-navy'}`}>Donations</button>
                    <button onClick={() => setCurrentTab('email')} className={`flex-1 sm:flex-none whitespace-nowrap px-4 sm:px-6 py-3 font-semibold text-sm sm:text-base transition-colors duration-200 text-center ${currentTab === 'email' ? 'text-deep-navy border-b-2 border-dusty-blue' : 'text-soft-gray hover:text-deep-navy'}`}>Email Settings</button>
                    <button onClick={() => setCurrentTab('theme')} className={`flex-1 sm:flex-none whitespace-nowrap px-4 sm:px-6 py-3 font-semibold text-sm sm:text-base transition-colors duration-200 text-center ${currentTab === 'theme' ? 'text-deep-navy border-b-2 border-dusty-blue' : 'text-soft-gray hover:text-deep-navy'}`}>Theme</button>
                </div>
                <div className="p-6 sm:p-8">
                    {renderEditContent(currentTab)}
                    <div className="mt-8 pt-6 border-t border-silver flex justify-end items-center">
                         <Link to={memorialToEdit ? `/memorial/${memorialToEdit.slug}` : '/dashboard'} className="text-soft-gray hover:text-deep-navy font-medium mr-4">Cancel</Link>
                        <button onClick={handleSubmit} className="bg-dusty-blue hover:opacity-90 text-white font-bold py-2 px-6 rounded-lg transition duration-300">
                            {isDraft ? 'Publish Memorial' : 'Save Changes'}
                        </button>
                    </div>
                </div>
            </div>
        ) : (
            <div className="bg-white p-6 sm:p-8 rounded-lg shadow-sm border border-silver">
                {/* Progress Bar */}
                <div className="mb-8">
                    <div className="flex justify-between mb-1">
                        <span className="text-base font-medium text-dusty-blue">Step {step} of 5</span>
                    </div>
                    <div className="w-full bg-pale-sky rounded-full h-2.5">
                        <div className="bg-dusty-blue h-2.5 rounded-full" style={{ width: `${(step / 5) * 100}%` }}></div>
                    </div>
                </div>
                
                {renderStepContent(step)}

                {/* Navigation */}
                <div className="mt-8 pt-6 border-t border-silver flex justify-between items-center">
                    <button 
                        onClick={prevStep} 
                        disabled={step === 1}
                        className="px-6 py-2 bg-silver hover:bg-soft-gray/80 text-deep-navy font-bold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Back
                    </button>
                    {step < 5 ? (
                        <button 
                            onClick={nextStep} 
                            className="px-6 py-2 bg-dusty-blue hover:opacity-90 text-white font-bold rounded-lg transition-colors"
                        >
                            Next
                        </button>
                    ) : (
                         <button 
                            onClick={handleSubmit}
                            className="px-6 py-2 bg-dusty-blue hover:opacity-90 text-white font-bold rounded-lg transition-colors"
                        >
                           {isLoggedIn ? 'Publish Memorial' : 'Continue'}
                        </button>
                    )}
                </div>
            </div>
        )}
        <UpgradeModal isOpen={isUpgradeModalOpen} onClose={() => setIsUpgradeModalOpen(false)} reason={upgradeReason} />
        <AuthRequiredModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} onAuthRedirect={handleAuthRedirect} />
    </div>
  );
};

export default CreateMemorialPage;

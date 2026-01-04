
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link, useLocation } from 'react-router-dom';
import { useMemorials } from '../hooks/useMemorials';
import { Photo, Memorial, GalleryItem, LinkItem, MemorialPlan, MediaItem, MemorialCreationData } from '../types';
import { generateBiography, generateTributeHighlights } from '../services/geminiService';
import { standardThemes } from '../themes';
import { COLOR_PALETTES, LAYOUTS, ColorPalette, LayoutOption } from '../constants/themeOptions';
import PhotoUpload from '../components/PhotoUpload';
import MediaUpload from '../components/MediaUpload';
import UpgradeModal from '../components/UpgradeModal';
import AuthRequiredModal from '../components/AuthRequiredModal';
import ThemePreviewModal from '../components/ThemePreviewModal';
import { useAuth } from '../hooks/useAuth';
import { useGuestMemorial } from '../hooks/useGuestMemorial';
import RichTextEditor from '../components/RichTextEditor';

import { countries } from '../data/countries';

const inputStyles = "mt-1 block w-full rounded-md bg-pale-sky border-silver shadow-sm focus:border-dusty-blue focus:ring-dusty-blue sm:text-sm text-deep-navy px-3 py-2";
const labelStyles = "block text-sm font-medium text-deep-navy/90";

const causeOfDeathSuggestions = ["Natural Causes", "Cancer", "Heart Disease", "Stroke", "Accident", "COVID-19", "Alzheimer's Disease", "Diabetes"];
const donationPurposes = ["General Support for the Family", "Funeral Expenses", "Charitable Cause in their Name", "Medical Bills", "Education Fund for Children", "Other"];
const relationshipOptions = [
    "Spouse", "Partner", "Husband", "Wife",
    "Son", "Daughter", "Child",
    "Father", "Mother", "Parent",
    "Brother", "Sister", "Sibling",
    "Grandson", "Granddaughter", "Grandchild",
    "Grandfather", "Grandmother", "Grandparent",
    "Friend", "Family Member", "Colleague", "Other"
];
const DRAFT_STORAGE_KEY = 'memorial_draft';

const DEFAULT_PROFILE_IMAGE: Photo = {
    id: 'default_placeholder',
    url: 'https://placehold.co/400x400/e2e8f0/1e293b?text=In+Loving+Memory',
    caption: 'Default Profile Image'
};


const ColorSwatch: React.FC<{ palette: ColorPalette, isSelected: boolean, onClick: () => void }> = ({ palette, isSelected, onClick }) => (
    <div onClick={onClick} title={palette.description} className={`cursor-pointer group flex flex-col items-center gap-2 p-3 rounded-lg border-2 transition-all ${isSelected ? 'border-dusty-blue bg-pale-sky/30' : 'border-transparent hover:bg-gray-50'}`}>
        <div className={`w-16 h-16 rounded-full shadow-sm flex items-center justify-center overflow-hidden border ${isSelected ? 'ring-2 ring-offset-2 ring-dusty-blue' : 'ring-1 ring-black/5'}`} style={{ background: `linear-gradient(135deg, ${palette.colors.bg} 0%, ${palette.colors.bg} 50%, ${palette.colors.primary} 50%, ${palette.colors.primary} 100%)` }}>
            <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm"></div>
        </div>
        <span className={`text-xs font-semibold ${isSelected ? 'text-deep-navy' : 'text-gray-500 group-hover:text-gray-700'}`}>{palette.name}</span>
    </div>
);

const LayoutCard: React.FC<{ layout: LayoutOption, isSelected: boolean, colorPalette: ColorPalette, onClick: () => void, onPreview: () => void }> = ({ layout, isSelected, colorPalette, onClick, onPreview }) => (
    <div onClick={onClick} className={`relative p-5 border-2 rounded-xl cursor-pointer transition-all duration-200 flex flex-col h-full ${isSelected ? 'border-dusty-blue bg-white shadow-md ring-1 ring-dusty-blue/20' : 'border-silver bg-white hover:border-gray-300 hover:shadow-sm'}`}>
        {layout.recommended && (
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-dusty-blue to-deep-navy text-white text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full shadow-sm z-10">
                Recommended
            </div>
        )}
        <div className="mb-4 aspect-video rounded-lg bg-gray-50 overflow-hidden border border-gray-100 flex items-center justify-center relative">
            {/* Abstract representation of layout structure */}
            <div className="w-full h-full p-2 opacity-50 flex gap-2">
                {layout.id === 'serenity' ? (
                    <>
                        <div className="w-1/4 h-full rounded-md" style={{ backgroundColor: colorPalette.colors.bg }}></div>
                        <div className="w-3/4 h-full flex flex-col gap-2">
                            <div className="w-full h-1/4 rounded-md" style={{ backgroundColor: colorPalette.colors.primary }}></div>
                            <div className="w-full h-3/4 rounded-md border-2 border-dashed border-gray-200"></div>
                        </div>
                    </>
                ) : layout.id === 'modern-minimal' ? (
                    <div className="w-full h-full flex">
                        <div className="w-1/2 h-full rounded-l-md" style={{ backgroundColor: colorPalette.colors.bg }}></div>
                        <div className="w-1/2 h-full rounded-r-md bg-white border border-l-0 border-gray-200"></div>
                    </div>
                ) : (
                    // Timeless / Classic centered
                    <div className="w-full h-full flex flex-col items-center pt-2">
                        <div className="w-12 h-12 rounded-full mb-2" style={{ backgroundColor: colorPalette.colors.primary }}></div>
                        <div className="w-3/4 h-2 rounded-full bg-gray-200 mb-1"></div>
                        <div className="w-1/2 h-2 rounded-full bg-gray-200"></div>
                    </div>
                )}
            </div>
            <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-white/90 to-transparent"></div>
        </div>

        <div className="flex-1">
            <h4 className="font-bold text-deep-navy">{layout.name}</h4>
            <p className="text-xs text-gray-500 mt-1 leading-relaxed">{layout.description}</p>
        </div>

        <div className="mt-4 pt-4 border-t border-gray-50 flex justify-between items-center">
            <div className="flex gap-1">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: colorPalette.colors.primary }}></div>
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: colorPalette.colors.text }}></div>
            </div>
            <button
                type="button"
                onClick={(e) => { e.stopPropagation(); onPreview(); }}
                className="text-[10px] font-bold uppercase tracking-wider px-3 py-1.5 bg-gray-50 border border-gray-200 rounded-md text-gray-600 hover:bg-white hover:text-deep-navy transition-colors flex items-center gap-1.5"
            >
                <span className="material-symbols-outlined text-[12px]">visibility</span> Preview
            </button>
        </div>
    </div>
);


const CreateMemorialPage: React.FC = () => {
    const { id: editId } = useParams<{ id: string }>();
    const isEditMode = !!editId;
    const location = useLocation();

    const [step, setStep] = useState(1);
    const [currentTab, setCurrentTab] = useState(location.state?.defaultTab || 'info');

    const { currentUser, isLoggedIn, isAdmin, loading: authLoading } = useAuth();
    const { saveGuestMemorial, guestMemorialData, clearGuestMemorial } = useGuestMemorial();
    const [formData, setFormData] = useState<MemorialCreationData>({
        firstName: '', middleName: '', lastName: '', birthDate: '', deathDate: '', gender: '', city: '',
        state: '', country: '', restingPlace: '', causeOfDeath: [], isCauseOfDeathPrivate: false, relationship: '',
        profileImage: null, biography: '', gallery: [], plan: 'free',
        donationInfo: { isEnabled: true, recipient: '', goal: 0, description: '', showDonorWall: true, suggestedAmounts: [50, 100, 250], purpose: 'Funeral Expenses' },
        donations: [],
        emailSettings: { senderName: '', replyToEmail: '', headerImageUrl: '', footerMessage: '' },

        theme: 'timeless', // Legacy/Fallback
        layout: 'timeless',
        colorPalette: 'timeless-blue'
    });

    const [isPreviewOpen, setIsPreviewOpen] = useState(false);
    const [isDataLoaded, setIsDataLoaded] = useState(false);

    const [personalityTraits, setPersonalityTraits] = useState('');
    const [keyMemories, setKeyMemories] = useState('');
    const [isGeneratingBio, setIsGeneratingBio] = useState(false);
    const [isGeneratingHighlights, setIsGeneratingHighlights] = useState(false);

    const [linkUrl, setLinkUrl] = useState('');
    const [linkTitle, setLinkTitle] = useState('');
    const [causeOfDeathInput, setCauseOfDeathInput] = useState('');

    const [selectedTheme, setSelectedTheme] = useState<string>(standardThemes[0].name);
    const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState(false);
    const [upgradeReason, setUpgradeReason] = useState('');
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
    const [isCustomCauseMode, setIsCustomCauseMode] = useState(false);
    // const [showDonationForm, setShowDonationForm] = useState(false); // Removed as form is now always shown
    const [customSlug, setCustomSlug] = useState('');
    const [isSlugManuallyEdited, setIsSlugManuallyEdited] = useState(false);
    const [slugError, setSlugError] = useState('');

    const navigate = useNavigate();
    const { addMemorial, getMemorialById, updateMemorial, updateMemorialSlug, memorials } = useMemorials();

    const memorialToEdit = isEditMode ? getMemorialById(editId) : null;
    const isDraft = memorialToEdit?.status === 'draft';

    // Helper to generate slug preview from name fields
    const generateSlugPreview = (firstName: string, lastName: string, deathDate: string): string => {
        const deathYear = deathDate ? new Date(deathDate).getFullYear() : '';
        let slug = `${firstName.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${lastName.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`;
        if (deathYear && !isNaN(deathYear as number)) {
            slug += `-${deathYear}`;
        }
        return slug || 'memorial-slug';
    };

    useEffect(() => {
        // Wait for auth to initialize before checking permissions
        if (authLoading) return;

        if (isEditMode && editId) {
            if (memorialToEdit) {
                // Allow owner OR admin
                if (memorialToEdit.userId !== currentUser?.id && !isAdmin) {
                    // Only redirect if we are SURE they are not authorized
                    console.warn("Unauthorized edit attempt", { userId: currentUser?.id, ownerId: memorialToEdit.userId, isAdmin });
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
                    country: memorialToEdit.country, restingPlace: memorialToEdit.restingPlace || '',
                    causeOfDeath: memorialToEdit.causeOfDeath,
                    isCauseOfDeathPrivate: memorialToEdit.isCauseOfDeathPrivate, relationship: '',
                    donations: memorialToEdit.donations || [],
                    profileImage: memorialToEdit.profileImage, biography: memorialToEdit.biography,
                    gallery: memorialToEdit.gallery, plan: memorialToEdit.plan || 'free',
                    donationInfo: memorialToEdit.donationInfo || { isEnabled: false, recipient: '', goal: 0, description: '', showDonorWall: true, suggestedAmounts: [25, 50, 100, 250], purpose: 'General Support for the Family' },
                    emailSettings: memorialToEdit.emailSettings || {
                        senderName: `${fullName} Tribute Team`, replyToEmail: currentUser?.email || '',
                        headerImageUrl: memorialToEdit.profileImage?.url || '', footerMessage: `In loving memory of ${fullName}.`,
                    },
                    theme: memorialToEdit.theme,
                    layout: memorialToEdit.layout || 'timeless',
                    colorPalette: memorialToEdit.colorPalette || 'timeless-blue'
                };
                setFormData(formDataToSet);
                setSelectedTheme(memorialToEdit.theme);
                setCustomSlug(memorialToEdit.slug);
                setIsSlugManuallyEdited(true);
                window.localStorage.removeItem(DRAFT_STORAGE_KEY);
                setIsDataLoaded(true);
            } else {
                // Memorial ID passed but not found in context
                console.error("Memorial not found for editing", editId);
                // Don't hang on loading, show error or redirect
                alert(`Memorial not found with ID: ${editId}`);
                navigate('/dashboard');
            }
        } else {
            // Prioritize data passed via GuestMemorialContext (e.g. from Signup redirect)
            if (guestMemorialData && Object.keys(guestMemorialData).length > 0) {
                setFormData(prev => ({ ...prev, ...guestMemorialData }));
                if (guestMemorialData.theme) setSelectedTheme(guestMemorialData.theme);
            } else {
                try {
                    const savedDraft = window.localStorage.getItem(DRAFT_STORAGE_KEY);
                    if (savedDraft) {
                        const parsedDraft = JSON.parse(savedDraft);
                        if (parsedDraft && typeof parsedDraft === 'object') setFormData(parsedDraft);
                    } else {
                        setFormData(prev => ({ ...prev, emailSettings: { ...prev.emailSettings, replyToEmail: currentUser?.email || '' } }));
                    }
                } catch (error) { console.error("Error reading draft from localStorage", error); }
            }
        }
        setIsDataLoaded(true);
    }, [isEditMode, editId, memorialToEdit, navigate, currentUser, guestMemorialData]);

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
                setFormData(prev => ({ ...prev, emailSettings: { ...prev.emailSettings, senderName: `${fullName} Tribute Team`, footerMessage: `In loving memory of ${fullName}.` } }));
            }
        }
    }, [formData.firstName, formData.middleName, formData.lastName, isEditMode]);

    // Auto-update slug preview when name/date changes (unless user manually edited it)
    useEffect(() => {
        if (!isSlugManuallyEdited && formData.firstName && formData.lastName) {
            const preview = generateSlugPreview(formData.firstName, formData.lastName, formData.deathDate);
            setCustomSlug(preview);
        }
    }, [formData.firstName, formData.lastName, formData.deathDate, isSlugManuallyEdited]);

    // AI recommendation hook simplified for now, or just kept for compatibility
    // For now we skip auto-selecting themes via AI to respect the new rigorous separation unless requested.
    // We can re-enable later by mapping "Modern", "Classic" keywords to layouts. 
    useEffect(() => {
        // Placeholder for future AI Layout suggestions
    }, [step, currentTab, isEditMode, formData.biography]);

    // Handle "Other" selection for Cause of Death
    const handleCauseSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const val = e.target.value;
        if (val === 'Other') {
            setIsCustomCauseMode(true);
        } else if (val) {
            if (!formData.causeOfDeath.includes(val)) {
                setFormData(prev => ({ ...prev, causeOfDeath: [...prev.causeOfDeath, val] }));
            }
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        if (type === 'checkbox') {
            const { checked } = e.target as HTMLInputElement;
            setFormData(prev => ({ ...prev, [name]: checked }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleSlugChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const formatted = e.target.value.toLowerCase().replace(/[^a-z0-9-]+/g, '');
        setCustomSlug(formatted);
        setIsSlugManuallyEdited(true);
        setSlugError('');

        // Check if slug is already taken
        if (formatted && memorials.some(m => m.slug === formatted && (!isEditMode || m.id !== editId))) {
            setSlugError('This web address is already in use. Please choose another.');
        }
    };

    const handleDonationInfoChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        let finalValue: string | boolean | number = value;
        if (type === 'checkbox') { finalValue = (e.target as HTMLInputElement).checked; }
        else if (name === 'goal') { finalValue = value === '' ? 0 : parseInt(value, 10); if (isNaN(finalValue)) { finalValue = 0; } }
        setFormData(prev => ({ ...prev, donationInfo: { ...prev.donationInfo, [name]: finalValue } }));
    };

    const handleEmailSettingsChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData(prev => ({ ...prev, emailSettings: { ...prev.emailSettings, [e.target.name]: e.target.value } }));
    };

    const handleBioChange = (content: string) => {
        setFormData(prev => ({ ...prev, biography: content }));
    };

    const handleProfileImageUpload = (photos: Photo[]) => {
        if (photos.length > 0) {
            const newProfileImage = photos[0];
            setFormData(p => ({ ...p, profileImage: newProfileImage, emailSettings: { ...p.emailSettings, headerImageUrl: p.emailSettings.headerImageUrl || newProfileImage.url } }));
        }
    };

    const handleEmailLogoUpload = (photos: Photo[]) => {
        if (photos.length > 0) { setFormData(p => ({ ...p, emailSettings: { ...p.emailSettings, headerImageUrl: photos[0].url } })); }
    };

    const handleSuggestedAmountsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const amounts = e.target.value.split(',').map(s => parseInt(s.trim(), 10)).filter(n => !isNaN(n) && n > 0);
        setFormData(prev => ({ ...prev, donationInfo: { ...prev.donationInfo, suggestedAmounts: amounts } }));
    };

    const handleGenerateBio = async () => {
        if (!keyMemories.trim() && !personalityTraits.trim()) { alert("Please provide some personality traits or key memories for the biography."); return; }
        setIsGeneratingBio(true);
        const fullName = [formData.firstName, formData.middleName, formData.lastName].filter(Boolean).join(' ');
        const generatedBio = await generateBiography({ name: fullName, relationship: formData.relationship, personalityTraits, keyMemories });
        setFormData(prev => ({ ...prev, biography: generatedBio }));
        setIsGeneratingBio(false);
    };

    const handleGenerateHighlights = async () => {
        if (!formData.biography.trim()) {
            alert("Please provide a biography before generating highlights.");
            return;
        }

        if (formData.aiHighlights && formData.aiHighlights.length > 0) {
            if (!window.confirm("This will regenerate the highlights and replace the current ones. Do you want to continue?")) {
                return;
            }
        }

        setIsGeneratingHighlights(true);
        try {
            // Use biography as the primary source for now if tributes are empty in creation flow
            // In edit mode we might have tributes, but formData might not have them fully loaded in 'tributes' prop unless we fetch them.
            // However, formData gets 'tributes' from memorialToEdit in useEffect.
            // But wait, 'tributes' is omitted from MemorialCreationData in the original type definition, so formData doesn't have it directly editable usually.
            // BUT we added it to formData state initialization.
            // Let's check formData initialization. It relies on memorialToEdit.
            // memorialToEdit has tributes.
            // But MemorialCreationData was just modified to include aiHighlights, but it still omits tributes.
            // So formData won't have 'tributes' unless we forced it?
            // Actually, in the useEffect (line 198), we spread memorialToEdit properties, but tributes are NOT in the mapped formDataToSet object explicitly unless we add them.
            // Line 186: `donations: memorialToEdit.donations || [],`
            // Tributes were NOT there.
            // So we should rely on biography for now, or fetch tributes if needed.
            // Simpler: Use biography.

            const contextText = [formData.biography].filter(Boolean);
            if (contextText.length === 0) {
                alert("Please write a biography first so the AI has context to generate highlights.");
                setIsGeneratingHighlights(false);
                return;
            }

            // We are using generateTributeHighlights which expects an array of strings (tributes).
            // We can pass the biography sentences or paragraphs as "tributes" to extract highlights.
            const highlights = await generateTributeHighlights(contextText);
            setFormData(prev => ({ ...prev, aiHighlights: highlights }));
        } catch (error) {
            console.error("Failed to generate highlights", error);
            alert("Failed to generate highlights. Please try again.");
        } finally {
            setIsGeneratingHighlights(false);
        }
    };

    const handleUpdateHighlight = (index: number, newValue: string) => {
        setFormData(prev => {
            const newHighlights = [...(prev.aiHighlights || [])];
            newHighlights[index] = newValue;
            return { ...prev, aiHighlights: newHighlights };
        });
    };

    const handleDeleteHighlight = (index: number) => {
        setFormData(prev => {
            const newHighlights = [...(prev.aiHighlights || [])];
            newHighlights.splice(index, 1);
            return { ...prev, aiHighlights: newHighlights };
        });
    };

    const handleAddHighlight = () => {
        setFormData(prev => ({ ...prev, aiHighlights: [...(prev.aiHighlights || []), "New highlight"] }));
    };

    const handleMediaUpload = (items: MediaItem[]) => {
        if (formData.plan === 'free') {
            const currentImages = formData.gallery.filter(item => item.type === 'image').length;
            const newImages = items.filter(item => item.type === 'image').length;
            const hasPremiumMedia = items.some(item => ['video', 'audio'].includes(item.type));
            if (hasPremiumMedia) { setUpgradeReason('to upload videos and audio files'); setIsUpgradeModalOpen(true); return; }
            if (currentImages + newImages > 5) { setUpgradeReason('to upload more than 5 photos'); setIsUpgradeModalOpen(true); return; }
        }
        setFormData(p => ({ ...p, gallery: [...p.gallery, ...items] }));
    };

    const handleAddLink = () => {
        if (!linkUrl.trim() || !linkTitle.trim()) { alert('Please provide both a URL and a title for the link.'); return; }
        try { new URL(linkUrl); } catch (_) { alert('Please enter a valid URL.'); return; }
        const newLink: LinkItem = { id: `link-${Date.now()}`, type: 'link', url: linkUrl, title: linkTitle };
        setFormData(p => ({ ...p, gallery: [...p.gallery, newLink] }));
        setLinkUrl(''); setLinkTitle('');
    };

    const handleDeleteGalleryItem = (id: string) => { setFormData(p => ({ ...p, gallery: p.gallery.filter(item => item.id !== id) })); };

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

    const prevStep = () => setStep(s => s - 1);

    const handleNextStep = () => {
        // Step 5 is Donations
        if (step === 5 && formData.donationInfo.isEnabled) {
            if (!formData.donationInfo.recipient.trim()) {
                alert("Please enter a recipient name for the donations.");
                return;
            }
            if (!formData.donationInfo.purpose) {
                alert("Please select a purpose for the donations.");
                return;
            }
        }
        setStep(s => s + 1);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // Validation for Edit Mode (Single Page / Tabs)
        if (isEditMode && formData.donationInfo.isEnabled) {
            if (!formData.donationInfo.recipient.trim() || !formData.donationInfo.purpose) {
                alert("Please complete the required donation fields (Recipient and Purpose).");
                setCurrentTab('donations');
                return;
            }
        }

        // Prevent premature submission if hitting 'Enter' on earlier steps
        if (!isEditMode && step < 6) {
            // Optional: You could call handleNextStep() here to make Enter go to next step
            // But for safety, just return.
            return;
        }

        // If creating a new memorial and not logged in, prompt to create account FIRST.
        // We allow saving the draft without strict validation (like profile image) here.
        if (!isEditMode && !isLoggedIn) {
            setIsAuthModalOpen(true);
            return;
        }

        // Determine the profile image to use (user uploaded OR default)
        const profileImageToUse = formData.profileImage || DEFAULT_PROFILE_IMAGE;

        // Layout defaults to timeless if not set, handled in data preparation below

        // Validate custom slug
        if (!customSlug || slugError) {
            alert("Please provide a valid web address.");
            isEditMode ? setCurrentTab('info') : setStep(1);
            return;
        }



        if (isEditMode && editId) {
            const { relationship, ...dataToSave } = formData;

            // Update slug if changed
            if (customSlug !== memorialToEdit?.slug) {
                const slugResult = updateMemorialSlug(editId, customSlug);
                if (!slugResult.success) {
                    alert(slugResult.message);
                    return;
                }
            }

            const updatedData: Partial<Memorial> = {
                ...dataToSave, gender: dataToSave.gender || undefined, middleName: dataToSave.middleName || undefined,
                state: dataToSave.state || undefined, profileImage: profileImageToUse,
                theme: selectedTheme || 'timeless', // Legacy fallback
                layout: formData.layout || 'timeless',
                colorPalette: formData.colorPalette || 'timeless-blue',
                status: isDraft ? 'active' : memorialToEdit?.status,
            };
            updateMemorial(editId, updatedData);
            window.localStorage.removeItem(DRAFT_STORAGE_KEY);
            clearGuestMemorial();
            navigate(`/memorial/${customSlug}`);
        } else {
            // Logged in user creating new active memorial
            const { relationship, ...dataToSave } = formData;
            const memorialData: Omit<Memorial, 'id' | 'slug' | 'tributes' | 'followers'> = {
                ...dataToSave, gender: dataToSave.gender || undefined, userId: currentUser!.id,
                middleName: dataToSave.middleName || undefined, state: dataToSave.state || undefined,
                createdAt: Date.now(),

                profileImage: profileImageToUse,
                theme: selectedTheme || 'timeless',
                layout: formData.layout || 'timeless',
                colorPalette: formData.colorPalette || 'timeless-blue',
                status: 'active',
            };
            const newMemorial = addMemorial(memorialData, customSlug);
            console.log("Memorial created successfully:", newMemorial);
            window.localStorage.removeItem(DRAFT_STORAGE_KEY);
            clearGuestMemorial();
            navigate(`/memorial/${newMemorial.slug}`);
        }
    };

    const handleUpgradeConfirm = () => {
        setIsUpgradeModalOpen(false);
        // If editing, go straight to checkout with memorial ID
        if (isEditMode && editId) {
            navigate(`/checkout/premium`, { state: { memorialId: editId } });
            return;
        }

        // If creating new, we need to save first to get an ID
        if (!isLoggedIn) {
            setIsAuthModalOpen(true);
            return;
        }

        // Save as active memorial (defaults to free plan initially)
        const profileImageToUse = formData.profileImage || DEFAULT_PROFILE_IMAGE;

        // Basic validation before saving
        if (!formData.firstName || !formData.lastName) {
            alert("Please enter at least a First and Last Name before upgrading.");
            setStep(1);
            return;
        }

        const { relationship, ...dataToSave } = formData;
        const memorialData: Omit<Memorial, 'id' | 'slug' | 'tributes' | 'followers'> = {
            ...dataToSave, gender: dataToSave.gender || undefined, userId: currentUser!.id,
            middleName: dataToSave.middleName || undefined, state: dataToSave.state || undefined,
            createdAt: Date.now(),
            profileImage: profileImageToUse,
            theme: selectedTheme || 'timeless',
            layout: formData.layout || 'timeless',
            colorPalette: formData.colorPalette || 'timeless-blue',
            status: 'active',
        };

        const newMemorial = addMemorial(memorialData, customSlug);
        console.log("Memorial saved for upgrade:", newMemorial);
        window.localStorage.removeItem(DRAFT_STORAGE_KEY);
        clearGuestMemorial();

        // Navigate to checkout with new memorial ID
        navigate(`/checkout/premium`, { state: { memorialId: newMemorial.id } });
    };

    const handleAuthRedirect = (path: '/login' | '/signup') => {
        // Save draft data even if incomplete so user can sign up/login and return
        const { relationship, ...dataToSave } = formData;

        // Merge the selectedTheme into the saved data, use the default image if none selected for the draft
        const draftData = {
            ...dataToSave,
            profileImage: formData.profileImage || DEFAULT_PROFILE_IMAGE,

            theme: selectedTheme,
            layout: formData.layout,
            colorPalette: formData.colorPalette,
            donations: [],
            tributes: [],
            status: 'draft',
        };

        saveGuestMemorial(draftData);
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
            <div>
                <label htmlFor="profileImage" className={labelStyles}>Profile Image (Optional)</label>
                <div className="mb-2 text-xs text-soft-gray">You can add this later. If left blank, a default image will be used.</div>
                <PhotoUpload onPhotosUpload={handleProfileImageUpload} multiple={false} />
                {formData.profileImage && (
                    <div className="mt-4 flex items-center gap-4">
                        <span className="text-sm font-medium text-deep-navy">Selected Image:</span>
                        <img
                            src={formData.profileImage.url}
                            alt="Profile"
                            className="w-16 h-16 rounded-full object-cover border border-silver shadow-sm"
                        />
                    </div>
                )}
            </div>
        </div>
    );

    const step2Content = (
        <div className="space-y-6">
            <h3 className="text-xl font-serif text-deep-navy border-b border-silver pb-2">Location &amp; Details</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div><label htmlFor="city" className={labelStyles}>City</label><input type="text" name="city" value={formData.city} onChange={handleInputChange} required className={inputStyles} /></div>
                <div><label htmlFor="state" className={labelStyles}>State / Province</label><input type="text" name="state" value={formData.state} onChange={handleInputChange} className={inputStyles} /></div>
                <div>
                    <label htmlFor="country" className={labelStyles}>Country</label>
                    <input list="country-list" name="country" value={formData.country} onChange={handleInputChange} required className={inputStyles} placeholder="Start typing to search..." />
                    <datalist id="country-list">
                        {countries.map(c => <option key={c} value={c} />)}
                    </datalist>
                </div>
            </div>
            <div>
                <label htmlFor="restingPlace" className={labelStyles}>Resting Place (Optional)</label>
                <input
                    type="text"
                    name="restingPlace"
                    value={formData.restingPlace}
                    onChange={handleInputChange}
                    className={inputStyles}
                    placeholder="e.g., Riverside Cemetery, Section A"
                />
                <p className="text-xs text-soft-gray mt-1">The final resting place, such as a cemetery name and location</p>
            </div>
            <div>
                <label htmlFor="causeOfDeathInput" className={labelStyles}>Cause of Death (Optional)</label>
                {!isCustomCauseMode ? (
                    <select onChange={handleCauseSelect} className={inputStyles} defaultValue="">
                        <option value="" disabled>Select a cause or add custom...</option>
                        {causeOfDeathSuggestions.map(s => <option key={s} value={s}>{s}</option>)}
                        <option value="Other">Other (Add Custom)</option>
                    </select>
                ) : (
                    <div className="flex gap-2">
                        <input
                            type="text"
                            id="causeOfDeathInput"
                            value={causeOfDeathInput}
                            onChange={(e) => setCauseOfDeathInput(e.target.value)}
                            onKeyDown={handleCauseOfDeathKeyDown}
                            placeholder="Type and press Enter"
                            className={inputStyles}
                            autoFocus
                        />
                        <button type="button" onClick={() => setIsCustomCauseMode(false)} className="px-3 py-2 bg-silver rounded-md text-sm font-medium hover:bg-soft-gray">Cancel</button>
                    </div>
                )}

                <div className="flex flex-wrap gap-2 mt-2">
                    {formData.causeOfDeath.map(tag => (<span key={tag} className="bg-silver text-deep-navy text-sm font-medium px-2.5 py-1 rounded-full flex items-center">{tag}<button type="button" onClick={() => removeCauseOfDeath(tag)} className="ml-1.5 text-soft-gray hover:text-deep-navy">&times;</button></span>))}
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
                    <div>
                        <label htmlFor="relationship" className={labelStyles}>Your Relationship to Deceased</label>
                        <select
                            name="relationship"
                            value={formData.relationship}
                            onChange={handleInputChange}
                            className="mt-1 block w-full rounded-md bg-white border-silver shadow-sm focus:border-dusty-blue focus:ring-dusty-blue sm:text-sm text-deep-navy px-3 py-2 max-w-full"
                        >
                            <option value="">Select Relationship</option>
                            {relationshipOptions.map(r => <option key={r} value={r}>{r}</option>)}
                        </select>
                    </div>
                    <div><label htmlFor="personalityTraits" className={labelStyles}>Personality Traits</label><textarea id="personalityTraits" value={personalityTraits} onChange={(e) => setPersonalityTraits(e.target.value)} rows={2} className={inputStyles.replace('bg-pale-sky', 'bg-white')} placeholder="e.g. Kind, adventurous, stubborn but loving"></textarea></div>
                    <div><label htmlFor="keyMemories" className={labelStyles}>Key Memories & Life Highlights</label><textarea id="keyMemories" value={keyMemories} onChange={(e) => setKeyMemories(e.target.value)} rows={3} className={inputStyles.replace('bg-pale-sky', 'bg-white')} placeholder="Mention hobbies, career, favorite sayings, or specific memories..."></textarea></div>
                    <button type="button" onClick={handleGenerateBio} disabled={isGeneratingBio} className="w-full sm:w-auto px-4 py-2 bg-dusty-blue text-white font-semibold rounded-md text-sm hover:opacity-90 disabled:bg-soft-gray">{isGeneratingBio ? 'Generating...' : 'Generate Biography'}</button>
                </div>
            </div>
            <div>
                <label htmlFor="biography" className={labelStyles}>Full Biography</label>
                <RichTextEditor {...bioProps} />
            </div>

            <div className="bg-pale-sky/60 p-4 rounded-lg border border-silver">
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <h4 className="font-semibold text-deep-navy">Memorial Highlights</h4>
                        <p className="text-sm text-soft-gray">Short, poetic snippets used in themes (e.g. Hero section).</p>
                    </div>
                    <button
                        type="button"
                        onClick={handleGenerateHighlights}
                        disabled={isGeneratingHighlights || !formData.biography}
                        className="px-3 py-1.5 bg-dusty-blue/10 text-dusty-blue font-medium rounded-md text-sm hover:bg-dusty-blue/20 disabled:opacity-50 transition-colors"
                    >
                        {isGeneratingHighlights ? 'Generating...' : formData.aiHighlights && formData.aiHighlights.length > 0 ? 'Regenerate' : 'Auto-Generate'}
                    </button>
                </div>

                {formData.aiHighlights && formData.aiHighlights.length > 0 ? (
                    <div className="space-y-3">
                        {formData.aiHighlights.map((highlight, index) => (
                            <div key={index} className="flex items-start gap-2 group">
                                <div className="flex-1">
                                    <textarea
                                        value={highlight}
                                        onChange={(e) => handleUpdateHighlight(index, e.target.value)}
                                        rows={2}
                                        className={`${inputStyles} bg-white text-sm`}
                                    />
                                </div>
                                <button
                                    type="button"
                                    onClick={() => handleDeleteHighlight(index)}
                                    className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                                    title="Remove highlight"
                                >
                                    <span className="material-symbols-outlined text-sm">close</span>
                                </button>
                            </div>
                        ))}
                        <button
                            type="button"
                            onClick={handleAddHighlight}
                            className="text-sm text-dusty-blue font-medium hover:text-deep-navy flex items-center gap-1 mt-2"
                        >
                            <span className="material-symbols-outlined text-sm">add</span> Add Custom Highlight
                        </button>
                    </div>
                ) : (
                    <div className="text-center py-6 border-2 border-dashed border-gray-200 rounded-md">
                        <p className="text-sm text-gray-500 mb-2">No highlights yet.</p>
                        <button
                            type="button"
                            onClick={handleGenerateHighlights}
                            disabled={isGeneratingHighlights || !formData.biography}
                            className="text-dusty-blue hover:text-deep-navy font-medium text-sm"
                        >
                            Generate from Biography
                        </button>
                    </div>
                )}
            </div>
        </div>
    );

    const gallerySection = (
        <div className="space-y-6">
            <h3 className="text-xl font-serif text-deep-navy border-b border-silver pb-2">Media Gallery</h3>
            <div><label className={labelStyles}>Upload Photos, Videos, Audio & Documents</label><MediaUpload onMediaUpload={handleMediaUpload} multiple /></div>
            <div className="border-t border-silver pt-4"><label className={labelStyles}>Add External Links (e.g., YouTube, Social Media)</label><div className="flex items-center gap-2 mt-1"><input type="text" value={linkTitle} onChange={e => setLinkTitle(e.target.value)} placeholder="Link Title" className={inputStyles} /><input type="url" value={linkUrl} onChange={e => setLinkUrl(e.target.value)} placeholder="https://example.com" className={inputStyles} /><button type="button" onClick={handleAddLink} className="px-4 py-2 bg-silver text-deep-navy font-semibold rounded-md text-sm hover:bg-soft-gray/80 whitespace-nowrap">Add Link</button></div></div>
            {formData.gallery.length > 0 && <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3 mt-4">{formData.gallery.map(item => (
                <div key={item.id} className="relative group bg-pale-sky rounded-md overflow-hidden border border-silver aspect-square">
                    {item.type === 'image' ? (
                        <img src={item.url} alt={item.fileName} className="w-full h-full object-cover" />
                    ) : item.type === 'link' ? (
                        <div className="w-full h-full flex flex-col items-center justify-center p-2 text-center bg-white border-2 border-dusty-blue">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-dusty-blue mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" /></svg>
                            <span className="text-xs font-semibold text-deep-navy truncate w-full px-1">{item.title}</span>
                        </div>
                    ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center p-2 text-center text-soft-gray">
                            {item.type === 'video' ? <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg> : <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 1.343 2 3 2zm0 0v-8" /></svg>}
                            <span className="text-xs truncate w-full">{item.fileName}</span>
                        </div>
                    )}
                    <button type="button" onClick={() => handleDeleteGalleryItem(item.id)} className="absolute top-1 right-1 bg-white/80 rounded-full p-1 text-red-500 hover:text-red-700 font-bold shadow-sm opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity">&times;</button>
                </div>
            ))}</div>}
        </div>
    );

    const themeSection = (
        <div className="space-y-10">
            <h3 className="text-xl font-serif text-deep-navy border-b border-silver pb-2">Design Your Tribute</h3>

            {/* Step 1: Color Palette */}
            <div>
                <div className="flex items-baseline justify-between mb-4">
                    <h4 className="font-bold text-deep-navy text-lg">1. Choose a Color Palette</h4>
                    <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded-full">Sets the mood</span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
                    {COLOR_PALETTES.map(palette => (
                        <ColorSwatch
                            key={palette.id}
                            palette={palette}
                            isSelected={formData.colorPalette === palette.id}
                            onClick={() => setFormData(p => ({ ...p, colorPalette: palette.id }))}
                        />
                    ))}
                </div>
            </div>

            {/* Step 2: Layout */}
            <div>
                <div className="flex items-baseline justify-between mb-4">
                    <h4 className="font-bold text-deep-navy text-lg">2. Select a Layout</h4>
                    <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded-full">Defines structure</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {LAYOUTS.map(layout => (
                        <LayoutCard
                            key={layout.id}
                            layout={layout}
                            isSelected={formData.layout === layout.id}
                            colorPalette={COLOR_PALETTES.find(c => c.id === formData.colorPalette) || COLOR_PALETTES[0]}
                            onClick={() => setFormData(p => ({ ...p, layout: layout.id }))}
                            onPreview={() => {
                                // For preview, we temporarily sync 'theme' for legacy Modal if needed, 
                                // or update the Modal to respect 'layout' and 'colorPalette' in formData directly.
                                // Since we pass formData to modal, we rely on updated props.
                                setFormData(p => ({ ...p, layout: layout.id })); // Ensure selected
                                setIsPreviewOpen(true);
                            }}
                        />
                    ))}
                </div>
            </div>

            {/* Step 3: Memorial URL */}
            <div className="pt-6 border-t border-silver">
                <h4 className="font-bold text-deep-navy text-lg mb-4">3. Memorial URL</h4>
                <div>
                    <label htmlFor="customSlug" className={labelStyles}>Customize Memorial Link</label>
                    <div className="mt-1 flex rounded-md shadow-sm">
                        <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-silver bg-gray-50 text-gray-500 sm:text-sm">foreverconnects.com/memorial/</span>
                        <input
                            type="text"
                            name="customSlug"
                            id="customSlug"
                            value={customSlug}
                            onChange={handleSlugChange}
                            className={`flex-1 min-w-0 block w-full px-3 py-2 rounded-none rounded-r-md sm:text-sm ${slugError ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : 'border-silver focus:ring-dusty-blue focus:border-dusty-blue'} border`}
                            placeholder="john-doe"
                        />
                    </div>
                    {slugError && <p className="mt-1 text-sm text-red-600">{slugError}</p>}
                    <p className="mt-1 text-xs text-soft-gray">Leave blank to auto-generate from name.</p>
                </div>
            </div>
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
                            <div><label htmlFor="recipient" className={labelStyles}>Recipient Name <span className="text-red-500">*</span></label><input type="text" name="recipient" value={formData.donationInfo.recipient} onChange={handleDonationInfoChange} className={inputStyles} placeholder="Who will receive the funds?" required /></div>
                            <div><label htmlFor="goal" className={labelStyles}>Goal Amount ($)</label><input type="number" name="goal" value={formData.donationInfo.goal} onChange={handleDonationInfoChange} className={inputStyles} placeholder="Optional" /></div>
                        </div>
                        <div><label htmlFor="purpose" className={labelStyles}>Purpose <span className="text-red-500">*</span></label><select name="purpose" value={formData.donationInfo.purpose} onChange={handleDonationInfoChange} className={inputStyles} required>{donationPurposes.map(p => <option key={p} value={p}>{p}</option>)}</select></div>
                        <div><label htmlFor="description" className={labelStyles}>Description</label><textarea name="description" value={formData.donationInfo.description} onChange={handleDonationInfoChange} rows={3} className={inputStyles} placeholder="Explain what the donations will be used for..." /></div>
                        <div className="flex items-center"><input type="checkbox" name="showDonorWall" checked={formData.donationInfo.showDonorWall} onChange={handleDonationInfoChange} className="h-4 w-4 text-dusty-blue rounded border-silver focus:ring-dusty-blue" /><label htmlFor="showDonorWall" className="ml-2 text-sm text-deep-navy">Show Public Donor Wall</label></div>
                    </div>
                )}
            </div>

            {/* Received Donations List */}
            <div className="bg-white p-6 rounded-lg border border-silver shadow-sm">
                <h4 className="text-lg font-bold text-deep-navy mb-4">Received Donations</h4>

                <div className="flex justify-between items-center mb-6">
                    <div className="bg-pale-sky px-4 py-2 rounded-lg">
                        <span className="text-sm text-soft-gray block">Total Raised</span>
                        <span className="text-xl font-bold text-deep-navy">
                            ${(formData.donations?.reduce((sum, d) => sum + d.amount, 0) || 0).toLocaleString()}
                        </span>
                    </div>
                    <div className="bg-pale-sky px-4 py-2 rounded-lg">
                        <span className="text-sm text-soft-gray block">Donors</span>
                        <span className="text-xl font-bold text-deep-navy">{formData.donations?.length || 0}</span>
                    </div>
                </div>

                {formData.donations && formData.donations.length > 0 ? (
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Donor</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Message</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {formData.donations && [...formData.donations].sort((a, b) => b.date - a.date).map((donation) => (
                                    <tr key={donation.id}>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            {new Date(donation.date).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            {donation.isAnonymous ? (
                                                <span className="italic text-gray-500">Anonymous ({donation.name})</span>
                                            ) : (
                                                donation.name
                                            )}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-deep-navy">
                                            ${donation.amount.toLocaleString()}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">
                                            {donation.message || '-'}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${donation.payoutStatus === 'paid'
                                                ? 'bg-green-100 text-green-800'
                                                : 'bg-yellow-100 text-yellow-800'
                                                }`}>
                                                {donation.payoutStatus === 'paid' ? 'Paid' : 'Pending'}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="text-center py-8 text-soft-gray border-2 border-dashed border-gray-200 rounded-lg">
                        <p>No donations received yet.</p>
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
            { id: 'theme', label: 'Design' }, // Renamed from Theme
            { id: 'donations', label: 'Donations' }
        ];

        return (
            <div className="space-y-6">
                <div className="border-b border-silver overflow-x-auto no-scrollbar">
                    <nav className="-mb-px flex space-x-8" aria-label="Tabs">
                        {tabs.map(tab => (
                            <button
                                key={tab.id}
                                type="button"
                                onClick={() => setCurrentTab(tab.id)}
                                className={`${currentTab === tab.id
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
            case 5: return donationSection;
            case 6: return themeSection;
            default: return null;
        }
    };

    if (!isDataLoaded) return <p>Loading editor...</p>;

    return (
        <div className="max-w-4xl mx-auto animate-fade-in">
            <UpgradeModal isOpen={isUpgradeModalOpen} onClose={() => setIsUpgradeModalOpen(false)} onConfirm={handleUpgradeConfirm} reason={upgradeReason} />
            <AuthRequiredModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} onAuthRedirect={handleAuthRedirect} />
            <ThemePreviewModal
                isOpen={isPreviewOpen}
                onClose={() => setIsPreviewOpen(false)}
                formData={formData}
                themeName={formData.layout || 'timeless'}
            />

            <div className="flex justify-between items-center mb-2">
                <div></div> {/* Spacer */}
                {!isLoggedIn && !isEditMode && (
                    <button
                        type="button"
                        onClick={() => setIsAuthModalOpen(true)}
                        className="text-dusty-blue hover:text-deep-navy font-medium text-sm"
                    >
                        Save Progress & Create Account
                    </button>
                )}
            </div>

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
                            step < 6 ? (
                                <button type="button" onClick={handleNextStep} className="px-8 py-2 bg-dusty-blue hover:opacity-90 text-white font-bold rounded-lg transition-colors">Next</button>
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

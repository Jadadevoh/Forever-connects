import React, { useState, useEffect } from 'react';
import { useMemorials } from '../hooks/useMemorials';
import { Link } from 'react-router-dom';
import { MemorialPlan, User } from '../types';
import { useApiSettings } from '../hooks/useApiSettings';
import { useUsers } from '../hooks/useUsers';
import UserEditModal from '../components/UserEditModal';
import { useSiteSettings } from '../hooks/useSiteSettings';
import { FEATURE_List, FeatureName } from '../config/features';

const AdminDashboardPage: React.FC = () => {
    const { users, deleteUser } = useUsers();
    const { memorials, deleteMemorial, updateMemorial } = useMemorials();
    const { apiSettings, saveApiSettings } = useApiSettings();
    const { siteSettings, saveSiteSettings } = useSiteSettings();

    const [activeTab, setActiveTab] = useState('overview');

    // State for user editing modal
    const [selectedUser, setSelectedUser] = useState<User | null>(null);

    // State for the settings forms, initialized from context
    const [apiFormState, setApiFormState] = useState(apiSettings);
    const [siteFormState, setSiteFormState] = useState(siteSettings);

    const [featureOverrides, setFeatureOverrides] = useState<Record<FeatureName, MemorialPlan[]>>(
        siteSettings.featureOverrides || {} as Record<FeatureName, MemorialPlan[]>
    );

    useEffect(() => {
        setApiFormState(apiSettings);
    }, [apiSettings]);

    useEffect(() => {
        setSiteFormState(siteSettings);
        setFeatureOverrides(siteSettings.featureOverrides || {} as Record<FeatureName, MemorialPlan[]>);
    }, [siteSettings]);

    const handleApiInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { id, value, type, checked } = e.target;
        setApiFormState(prev => ({
            ...prev,
            [id]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSiteInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { id, value } = e.target;
        setSiteFormState(prev => ({ ...prev, [id]: value }));
    };

    const handleFeatureToggle = (featureName: FeatureName, plan: MemorialPlan) => {
        setFeatureOverrides(prev => {
            const currentPlans = prev[featureName] || FEATURE_List.find(f => f.name === featureName)?.availableIn || [];
            const hasPlan = currentPlans.includes(plan);

            let newPlans;
            if (hasPlan) {
                newPlans = currentPlans.filter(p => p !== plan);
            } else {
                newPlans = [...currentPlans, plan];
            }

            return {
                ...prev,
                [featureName]: newPlans
            };
        });
    };

    const handleSaveFeatureSettings = () => {
        saveSiteSettings({
            ...siteSettings,
            featureOverrides: featureOverrides
        });
        alert('Feature settings saved!');
    };

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, field: 'logoUrl' | 'heroImageUrl' | 'aboutHeroImageUrl') => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                setSiteFormState(prev => ({
                    ...prev,
                    [field]: event.target?.result as string,
                }));
            };
            reader.readAsDataURL(file);
        }
    };

    // State for API key visibility
    const [showStripeSecret, setShowStripeSecret] = useState(false);
    const [showSmtpPass, setShowSmtpPass] = useState(false);


    const handleEditUser = (user: User) => {
        setSelectedUser(user);
    };

    const handleDeleteUser = (userId: string, userName: string) => {
        if (window.confirm(`Are you sure you want to delete the user ${userName}? This action cannot be undone.`)) {
            deleteUser(userId);
        }
    };

    const handleDeleteMemorial = (id: string, name: string) => {
        if (window.confirm(`Are you sure you want to delete the memorial for ${name}? This action cannot be undone.`)) {
            deleteMemorial(id);
        }
    }

    const handleSaveApiSettings = (e: React.FormEvent) => {
        e.preventDefault();
        saveApiSettings(apiFormState);
        alert('API settings saved! (For this demo, keys are stored in your browser\'s local storage)');
    };

    const handleSaveSiteSettings = (e: React.FormEvent) => {
        e.preventDefault();
        saveSiteSettings(siteFormState);
        alert('Site settings saved!');
    };

    const inputStyles = "block w-full rounded-md bg-pale-sky border-silver shadow-sm focus:border-dusty-blue focus:ring-dusty-blue sm:text-sm text-deep-navy px-3 py-2";
    const labelStyles = "block text-sm font-medium text-deep-navy/90";

    const EyeIcon = () => (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
            <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
        </svg>
    );

    const EyeSlashIcon = () => (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.27 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z" clipRule="evenodd" />
            <path d="M12.454 16.697L9.75 13.992a4 4 0 01-3.742-3.741L2.303 6.546A10.048 10.048 0 00.458 10c1.274 4.057 5.064 7 9.542 7 .847 0 1.673-.123 2.468-.352z" />
        </svg>
    );

    const renderTabContent = () => {
        switch (activeTab) {
            case 'overview':
                return (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-white p-6 rounded-lg shadow-sm border border-silver">
                            <h2 className="text-xl font-serif text-deep-navy">Total Users</h2>
                            <p className="text-3xl font-bold text-dusty-blue mt-2">{users.length}</p>
                        </div>
                        <div className="bg-white p-6 rounded-lg shadow-sm border border-silver">
                            <h2 className="text-xl font-serif text-deep-navy">Total Memorials</h2>
                            <p className="text-3xl font-bold text-dusty-blue mt-2">{memorials.length}</p>
                        </div>
                    </div>
                );
            case 'users':
                return (
                    <div className="bg-white p-6 rounded-lg shadow-sm border border-silver">
                        <h2 className="text-2xl font-serif text-deep-navy mb-4">User Management</h2>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm text-left text-deep-navy">
                                <thead className="text-xs text-deep-navy uppercase bg-pale-sky">
                                    <tr>
                                        <th scope="col" className="px-6 py-3">Name</th>
                                        <th scope="col" className="px-6 py-3">Email</th>
                                        <th scope="col" className="px-6 py-3">Role</th>
                                        <th scope="col" className="px-6 py-3">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {users.map(user => (
                                        <tr key={user.id} className="bg-white border-b border-silver">
                                            <td className="px-6 py-4 font-medium whitespace-nowrap">{user.name}</td>
                                            <td className="px-6 py-4">{user.email}</td>
                                            <td className="px-6 py-4 capitalize">{user.role}</td>
                                            <td className="px-6 py-4 flex items-center space-x-2">
                                                <button onClick={() => handleEditUser(user)} className="font-medium text-dusty-blue hover:underline">Edit</button>
                                                <button onClick={() => handleDeleteUser(user.id, user.name || 'User')} className="font-medium text-red-600 hover:underline">Delete</button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                );
            case 'memorials':
                return (
                    <div className="bg-white p-6 rounded-lg shadow-sm border border-silver">
                        <h2 className="text-2xl font-serif text-deep-navy mb-4">Memorial Management</h2>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm text-left text-deep-navy">
                                <thead className="text-xs text-deep-navy uppercase bg-pale-sky">
                                    <tr>
                                        <th scope="col" className="px-6 py-3">Full Name</th>
                                        <th scope="col" className="px-6 py-3">Dates</th>
                                        <th scope="col" className="px-6 py-3">Plan</th>
                                        <th scope="col" className="px-6 py-3">Created By (User ID)</th>
                                        <th scope="col" className="px-6 py-3">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {memorials.map(m => (
                                        <tr key={m.id} className="bg-white border-b border-silver">
                                            <td className="px-6 py-4 font-medium whitespace-nowrap">
                                                {[m.firstName, m.middleName, m.lastName].filter(Boolean).join(' ')}
                                            </td>
                                            <td className="px-6 py-4">{new Date(m.birthDate).getFullYear()} - {new Date(m.deathDate).getFullYear()}</td>
                                            <td className="px-6 py-4">
                                                <select
                                                    value={m.plan || 'free'}
                                                    onChange={(e) => updateMemorial(m.id, { plan: e.target.value as MemorialPlan })}
                                                    className="block w-full rounded-md border-silver shadow-sm focus:border-dusty-blue focus:ring-dusty-blue text-xs sm:text-sm py-1"
                                                >
                                                    <option value="free">Remembrance (Free)</option>
                                                    <option value="premium">Living (Premium)</option>
                                                    <option value="eternal">Eternal (One-time)</option>
                                                </select>
                                            </td>
                                            <td className="px-6 py-4">{m.userId || 'N/A'}</td>
                                            <td className="px-6 py-4 flex items-center space-x-2">
                                                <Link to={`/memorial/${m.slug}`} className="font-medium text-dusty-blue hover:underline">View</Link>
                                                <button
                                                    onClick={() => handleDeleteMemorial(m.id, [m.firstName, m.lastName].join(' '))}
                                                    className="font-medium text-red-600 hover:underline"
                                                >
                                                    Delete
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                );
            case 'customization':
                return (
                    <div className="bg-white p-6 rounded-lg shadow-sm border border-silver">
                        <h2 className="text-2xl font-serif text-deep-navy mb-4">Site Customization</h2>
                        <form onSubmit={handleSaveSiteSettings} className="space-y-6">
                            <div>
                                <label htmlFor="siteName" className={labelStyles}>Site Name</label>
                                <input
                                    type="text"
                                    id="siteName"
                                    value={siteFormState.siteName}
                                    onChange={handleSiteInputChange}
                                    className={inputStyles}
                                />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label htmlFor="logoUrl" className={labelStyles}>Site Logo</label>
                                    <input type="file" id="logoUrl" onChange={(e) => handleImageUpload(e, 'logoUrl')} accept="image/*" className="mt-1 text-sm" />
                                    {siteFormState.logoUrl && <img src={siteFormState.logoUrl} alt="Logo preview" className="mt-2 h-10 w-auto bg-pale-sky p-1 rounded-md" />}
                                </div>
                                <div>
                                    <label htmlFor="heroImageUrl" className={labelStyles}>Homepage Hero Image</label>
                                    <input type="file" id="heroImageUrl" onChange={(e) => handleImageUpload(e, 'heroImageUrl')} accept="image/*" className="mt-1 text-sm" />
                                    {siteFormState.heroImageUrl && <img src={siteFormState.heroImageUrl} alt="Hero preview" className="mt-2 h-20 w-auto object-cover rounded-md" />}
                                </div>
                                <div>
                                    <label htmlFor="aboutHeroImageUrl" className={labelStyles}>About Page Hero Image</label>
                                    <input type="file" id="aboutHeroImageUrl" onChange={(e) => handleImageUpload(e, 'aboutHeroImageUrl')} accept="image/*" className="mt-1 text-sm" />
                                    {siteFormState.aboutHeroImageUrl && <img src={siteFormState.aboutHeroImageUrl} alt="About hero preview" className="mt-2 h-20 w-auto object-cover rounded-md" />}
                                </div>
                            </div>
                            <div className="text-right">
                                <button type="submit" className="bg-dusty-blue hover:opacity-90 text-white font-bold py-2 px-4 rounded-lg">
                                    Save Site Settings
                                </button>
                            </div>
                        </form>
                    </div>
                );
            case 'features':
                return (
                    <div className="bg-white p-6 rounded-lg shadow-sm border border-silver">
                        <div className="flex justify-between items-center mb-6">
                            <div>
                                <h2 className="text-2xl font-serif text-deep-navy">Plans & Features</h2>
                                <p className="text-soft-gray text-sm mt-1">Configure which features are available for each subscription plan.</p>
                            </div>
                            <button
                                onClick={handleSaveFeatureSettings}
                                className="bg-dusty-blue hover:opacity-90 text-white font-bold py-2 px-4 rounded-lg"
                            >
                                Save Feature Settings
                            </button>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full text-sm text-left text-deep-navy border-collapse">
                                <thead>
                                    <tr className="bg-pale-sky">
                                        <th className="px-6 py-4 border border-silver w-1/3">Feature</th>
                                        <th className="px-6 py-4 border border-silver text-center">Free</th>
                                        <th className="px-6 py-4 border border-silver text-center">Premium</th>
                                        <th className="px-6 py-4 border border-silver text-center">Eternal</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {FEATURE_List.map(feature => (
                                        <tr key={feature.name} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 border border-silver">
                                                <div className="font-medium text-deep-navy">{feature.displayName}</div>
                                                <div className="text-xs text-soft-gray mt-1">{feature.description}</div>
                                            </td>
                                            {['free', 'premium', 'eternal'].map((plan) => {
                                                // Determine if checked: check overrides first, then default config
                                                const currentOverride = featureOverrides[feature.name];
                                                const isChecked = currentOverride
                                                    ? currentOverride.includes(plan as MemorialPlan)
                                                    : feature.availableIn.includes(plan as MemorialPlan);

                                                return (
                                                    <td key={`${feature.name}-${plan}`} className="px-6 py-4 border border-silver text-center">
                                                        <input
                                                            type="checkbox"
                                                            checked={isChecked}
                                                            onChange={() => handleFeatureToggle(feature.name, plan as MemorialPlan)}
                                                            className="h-5 w-5 text-dusty-blue rounded border-silver focus:ring-dusty-blue cursor-pointer"
                                                        />
                                                    </td>
                                                );
                                            })}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                );
            case 'settings':
                return (
                    <div className="bg-white p-6 rounded-lg shadow-sm border border-silver">
                        <h2 className="text-2xl font-serif text-deep-navy mb-4">API & Service Configuration</h2>
                        <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-6 rounded-md" role="alert">
                            <p className="font-bold">Security Notice</p>
                            <p>For security, API keys must be managed in your hosting environment's "Secrets" panel. The Gemini AI key, for example, must be a secret named `API_KEY` to be used by the application.</p>
                        </div>
                        <form onSubmit={handleSaveApiSettings} className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label htmlFor="stripePublicKey" className={labelStyles}>Stripe Public Key</label>
                                    <div className="mt-1">
                                        <input
                                            type="text"
                                            id="stripePublicKey"
                                            value={apiFormState.stripePublicKey}
                                            onChange={handleApiInputChange}
                                            className={inputStyles}
                                            placeholder="pk_live_..."
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label htmlFor="stripeSecretKey" className={labelStyles}>Stripe Secret Key</label>
                                    <div className="relative mt-1">
                                        <input
                                            type={showStripeSecret ? 'text' : 'password'}
                                            id="stripeSecretKey"
                                            value={apiFormState.stripeSecretKey}
                                            onChange={handleApiInputChange}
                                            className={`${inputStyles} pr-10`}
                                            placeholder="sk_live_..."
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowStripeSecret(!showStripeSecret)}
                                            className="absolute inset-y-0 right-0 flex items-center pr-3 text-soft-gray hover:text-deep-navy"
                                            aria-label={showStripeSecret ? "Hide key" : "Show key"}
                                        >
                                            {showStripeSecret ? <EyeSlashIcon /> : <EyeIcon />}
                                        </button>
                                    </div>
                                </div>
                            </div>
                            <div className="border-t border-silver pt-4">
                                <h3 className="text-lg font-semibold text-deep-navy/90 mb-4">Email (SMTP) Settings</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label htmlFor="smtpHost" className={labelStyles}>SMTP Host</label>
                                        <div className="mt-1">
                                            <input
                                                type="text"
                                                id="smtpHost"
                                                value={apiFormState.smtpHost || ''}
                                                onChange={handleApiInputChange}
                                                className={inputStyles}
                                                placeholder="smtp.example.com"
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label htmlFor="smtpPort" className={labelStyles}>SMTP Port</label>
                                        <div className="mt-1">
                                            <input
                                                type="text"
                                                id="smtpPort"
                                                value={apiFormState.smtpPort || ''}
                                                onChange={handleApiInputChange}
                                                className={inputStyles}
                                                placeholder="587"
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                                    <div>
                                        <label htmlFor="smtpUser" className={labelStyles}>SMTP Username</label>
                                        <div className="mt-1">
                                            <input
                                                type="text"
                                                id="smtpUser"
                                                value={apiFormState.smtpUser || ''}
                                                onChange={handleApiInputChange}
                                                className={inputStyles}
                                                placeholder="user@example.com"
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label htmlFor="smtpPass" className={labelStyles}>SMTP Password</label>
                                        <div className="relative mt-1">
                                            <input
                                                type={showSmtpPass ? 'text' : 'password'}
                                                id="smtpPass"
                                                value={apiFormState.smtpPass || ''}
                                                onChange={handleApiInputChange}
                                                className={`${inputStyles} pr-10`}
                                                placeholder="Enter SMTP Password"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowSmtpPass(!showSmtpPass)}
                                                className="absolute inset-y-0 right-0 flex items-center pr-3 text-soft-gray hover:text-deep-navy"
                                                aria-label={showSmtpPass ? "Hide password" : "Show password"}
                                            >
                                                {showSmtpPass ? <EyeSlashIcon /> : <EyeIcon />}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="border-t border-silver pt-4">
                                <h3 className="text-lg font-semibold text-deep-navy/90 mb-4">Payment Gateway Settings</h3>
                                <div>
                                    <label htmlFor="paypalClientId" className={labelStyles}>PayPal Client ID (Optional)</label>
                                    <input
                                        type="text"
                                        id="paypalClientId"
                                        value={apiFormState.paypalClientId || ''}
                                        onChange={handleApiInputChange}
                                        className={inputStyles}
                                        placeholder="Enter PayPal Client ID to enable"
                                    />
                                </div>
                                <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-4">
                                    <div className="flex items-center p-3 bg-pale-sky rounded-md">
                                        <input
                                            id="enableApplePay"
                                            name="enableApplePay"
                                            type="checkbox"
                                            checked={apiFormState.enableApplePay || false}
                                            onChange={handleApiInputChange}
                                            className="h-4 w-4 rounded border-soft-gray text-dusty-blue focus:ring-dusty-blue"
                                        />
                                        <label htmlFor="enableApplePay" className="ml-3 block text-sm font-medium text-deep-navy">Enable Apple Pay</label>
                                    </div>
                                    <div className="flex items-center p-3 bg-pale-sky rounded-md">
                                        <input
                                            id="enableGooglePay"
                                            name="enableGooglePay"
                                            type="checkbox"
                                            checked={apiFormState.enableGooglePay || false}
                                            onChange={handleApiInputChange}
                                            className="h-4 w-4 rounded border-soft-gray text-dusty-blue focus:ring-dusty-blue"
                                        />
                                        <label htmlFor="enableGooglePay" className="ml-3 block text-sm font-medium text-deep-navy">Enable Google Pay</label>
                                    </div>
                                    <div className="flex items-center p-3 bg-pale-sky rounded-md">
                                        <input
                                            id="enableAch"
                                            name="enableAch"
                                            type="checkbox"
                                            checked={apiFormState.enableAch || false}
                                            onChange={handleApiInputChange}
                                            className="h-4 w-4 rounded border-soft-gray text-dusty-blue focus:ring-dusty-blue"
                                        />
                                        <label htmlFor="enableAch" className="ml-3 block text-sm font-medium text-deep-navy">Enable Bank (ACH)</label>
                                    </div>
                                </div>
                            </div>

                            <div className="text-right">
                                <button
                                    type="submit"
                                    className="bg-dusty-blue hover:opacity-90 text-white font-bold py-2 px-4 rounded-lg transition duration-300"
                                >
                                    Save API Settings
                                </button>
                            </div>
                        </form>
                    </div>
                );
            default: return null;
        }
    }


    return (
        <div className="animate-fade-in">
            <UserEditModal user={selectedUser} onClose={() => setSelectedUser(null)} />
            <h1 className="text-4xl font-serif font-bold text-deep-navy mb-6 border-b border-silver pb-4">Admin Dashboard</h1>

            <div className="bg-white rounded-lg shadow-sm border border-silver">
                <div className="border-b border-silver flex overflow-x-auto">
                    <button onClick={() => setActiveTab('overview')} className={`flex-1 sm:flex-none whitespace-nowrap px-4 sm:px-6 py-3 font-semibold text-sm sm:text-base transition-colors duration-200 text-center ${activeTab === 'overview' ? 'text-deep-navy border-b-2 border-dusty-blue' : 'text-soft-gray hover:text-deep-navy'}`}>Overview</button>
                    <button onClick={() => setActiveTab('users')} className={`flex-1 sm:flex-none whitespace-nowrap px-4 sm:px-6 py-3 font-semibold text-sm sm:text-base transition-colors duration-200 text-center ${activeTab === 'users' ? 'text-deep-navy border-b-2 border-dusty-blue' : 'text-soft-gray hover:text-deep-navy'}`}>Users</button>
                    <button onClick={() => setActiveTab('memorials')} className={`flex-1 sm:flex-none whitespace-nowrap px-4 sm:px-6 py-3 font-semibold text-sm sm:text-base transition-colors duration-200 text-center ${activeTab === 'memorials' ? 'text-deep-navy border-b-2 border-dusty-blue' : 'text-soft-gray hover:text-deep-navy'}`}>Memorials</button>
                    <button onClick={() => setActiveTab('features')} className={`flex-1 sm:flex-none whitespace-nowrap px-4 sm:px-6 py-3 font-semibold text-sm sm:text-base transition-colors duration-200 text-center ${activeTab === 'features' ? 'text-deep-navy border-b-2 border-dusty-blue' : 'text-soft-gray hover:text-deep-navy'}`}>Plans & Features</button>
                    <button onClick={() => setActiveTab('customization')} className={`flex-1 sm:flex-none whitespace-nowrap px-4 sm:px-6 py-3 font-semibold text-sm sm:text-base transition-colors duration-200 text-center ${activeTab === 'customization' ? 'text-deep-navy border-b-2 border-dusty-blue' : 'text-soft-gray hover:text-deep-navy'}`}>Site Customization</button>
                    <button onClick={() => setActiveTab('settings')} className={`flex-1 sm:flex-none whitespace-nowrap px-4 sm:px-6 py-3 font-semibold text-sm sm:text-base transition-colors duration-200 text-center ${activeTab === 'settings' ? 'text-deep-navy border-b-2 border-dusty-blue' : 'text-soft-gray hover:text-deep-navy'}`}>API Settings</button>
                </div>
                <div className="p-6 sm:p-8 bg-pale-sky/40">
                    {renderTabContent()}
                </div>
            </div>
        </div>
    );
}

export default AdminDashboardPage;
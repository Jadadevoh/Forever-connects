

import React, { useState, useEffect } from 'react';
import { useMemorials } from '../hooks/useMemorials';
import { Link } from 'react-router-dom';
import { User } from '../types';
import { useApiSettings } from '../hooks/useApiSettings';
import { useUsers } from '../hooks/useUsers';
import UserEditModal from '../components/UserEditModal';

const AdminDashboardPage: React.FC = () => {
    const { users, deleteUser } = useUsers();
    const { memorials, deleteMemorial } = useMemorials();
    const { apiSettings, saveApiSettings } = useApiSettings();
    
    // State for user editing modal
    const [selectedUser, setSelectedUser] = useState<User | null>(null);

    // State for the API settings form, initialized from context
    const [formState, setFormState] = useState(apiSettings);

    useEffect(() => {
        setFormState(apiSettings);
    }, [apiSettings]);

    const handleApiInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { id, value, type, checked } = e.target;
        setFormState(prev => ({ 
            ...prev,
            [id]: type === 'checkbox' ? checked : value
        }));
    };

    // State for API key visibility
    const [showStripeSecret, setShowStripeSecret] = useState(false);
    const [showGeminiKey, setShowGeminiKey] = useState(false);
    const [showOpenAiKey, setShowOpenAiKey] = useState(false);
    // FIX: Added state for SMTP password visibility toggle.
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
        saveApiSettings(formState);
        alert('API settings saved! (For this demo, keys are stored in your browser\'s local storage)');
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

    return (
        <div className="animate-fade-in">
            <UserEditModal user={selectedUser} onClose={() => setSelectedUser(null)} />
            <h1 className="text-4xl font-serif font-bold text-deep-navy mb-6 border-b border-silver pb-4">Admin Dashboard</h1>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="bg-white p-6 rounded-lg shadow-sm border border-silver">
                    <h2 className="text-xl font-serif text-deep-navy">Total Users</h2>
                    <p className="text-3xl font-bold text-dusty-blue mt-2">{users.length}</p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-sm border border-silver">
                    <h2 className="text-xl font-serif text-deep-navy">Total Memorials</h2>
                    <p className="text-3xl font-bold text-dusty-blue mt-2">{memorials.length}</p>
                </div>
            </div>

            {/* API Configuration */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-silver mb-8">
                <h2 className="text-2xl font-serif text-deep-navy mb-4">API & Service Configuration</h2>
                <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-6 rounded-md" role="alert">
                  <p className="font-bold">Security Notice</p>
                  <p>For demonstration purposes, these keys are stored in your browser's local storage. In a real-world application, API keys must be stored securely on a server and never exposed on the client-side.</p>
                </div>
                <form onSubmit={handleSaveApiSettings} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label htmlFor="stripePublicKey" className={labelStyles}>Stripe Public Key</label>
                            <div className="mt-1">
                                <input
                                    type="text"
                                    id="stripePublicKey"
                                    value={formState.stripePublicKey}
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
                                    value={formState.stripeSecretKey}
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
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label htmlFor="geminiApiKey" className={labelStyles}>Google Gemini API Key</label>
                            <div className="relative mt-1">
                                <input
                                    type={showGeminiKey ? 'text' : 'password'}
                                    id="geminiApiKey"
                                    value={formState.geminiApiKey}
                                    onChange={handleApiInputChange}
                                    className={`${inputStyles} pr-10`}
                                    placeholder="Enter Gemini API Key"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowGeminiKey(!showGeminiKey)}
                                    className="absolute inset-y-0 right-0 flex items-center pr-3 text-soft-gray hover:text-deep-navy"
                                    aria-label={showGeminiKey ? "Hide key" : "Show key"}
                                >
                                    {showGeminiKey ? <EyeSlashIcon /> : <EyeIcon />}
                                </button>
                            </div>
                        </div>
                        <div>
                            <label htmlFor="openAiApiKey" className={labelStyles}>OpenAI API Key</label>
                             <div className="relative mt-1">
                                <input
                                    type={showOpenAiKey ? 'text' : 'password'}
                                    id="openAiApiKey"
                                    value={formState.openAiApiKey}
                                    onChange={handleApiInputChange}
                                    className={`${inputStyles} pr-10`}
                                    placeholder="Enter OpenAI API Key"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowOpenAiKey(!showOpenAiKey)}
                                    className="absolute inset-y-0 right-0 flex items-center pr-3 text-soft-gray hover:text-deep-navy"
                                    aria-label={showOpenAiKey ? "Hide key" : "Show key"}
                                >
                                    {showOpenAiKey ? <EyeSlashIcon /> : <EyeIcon />}
                                </button>
                            </div>
                        </div>
                    </div>
                    {/* SMTP Settings */}
                    <div className="border-t border-silver pt-4">
                        <h3 className="text-lg font-semibold text-deep-navy/90 mb-4">Email (SMTP) Settings</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label htmlFor="smtpHost" className={labelStyles}>SMTP Host</label>
                                <div className="mt-1">
                                    <input
                                        type="text"
                                        id="smtpHost"
                                        value={formState.smtpHost || ''}
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
                                        value={formState.smtpPort || ''}
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
                                        value={formState.smtpUser || ''}
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
                                        value={formState.smtpPass || ''}
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

                    {/* Payment Gateway Settings */}
                    <div className="border-t border-silver pt-4">
                        <h3 className="text-lg font-semibold text-deep-navy/90 mb-4">Payment Gateway Settings</h3>
                        <div>
                            <label htmlFor="paypalClientId" className={labelStyles}>PayPal Client ID (Optional)</label>
                            <input
                                type="text"
                                id="paypalClientId"
                                value={formState.paypalClientId || ''}
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
                                    checked={formState.enableApplePay || false}
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
                                    checked={formState.enableGooglePay || false}
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
                                    checked={formState.enableAch || false}
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
                            Save Settings
                        </button>
                    </div>
                </form>
            </div>


            {/* User Management */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-silver mb-8">
                <h2 className="text-2xl font-serif text-deep-navy mb-4">User Management</h2>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left text-deep-navy">
                        <thead className="text-xs text-deep-navy uppercase bg-pale-sky">
                            <tr>
                                <th scope="col" className="px-6 py-3">Name</th>
                                <th scope="col" className="px-6 py-3">Email</th>
                                <th scope="col" className="px-6 py-3">Plan</th>
                                <th scope="col" className="px-6 py-3">Role</th>
                                <th scope="col" className="px-6 py-3">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map(user => (
                                <tr key={user.id} className="bg-white border-b border-silver">
                                    <td className="px-6 py-4 font-medium whitespace-nowrap">{user.name}</td>
                                    <td className="px-6 py-4">{user.email}</td>
                                    <td className="px-6 py-4 capitalize">{user.plan}</td>
                                    <td className="px-6 py-4 capitalize">{user.role}</td>
                                    <td className="px-6 py-4 flex items-center space-x-2">
                                        <button onClick={() => handleEditUser(user)} className="font-medium text-dusty-blue hover:underline">Edit</button>
                                        <button onClick={() => handleDeleteUser(user.id, user.name)} className="font-medium text-red-600 hover:underline">Delete</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Memorial Management */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-silver">
                <h2 className="text-2xl font-serif text-deep-navy mb-4">Memorial Management</h2>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left text-deep-navy">
                        <thead className="text-xs text-deep-navy uppercase bg-pale-sky">
                            <tr>
                                <th scope="col" className="px-6 py-3">Full Name</th>
                                <th scope="col" className="px-6 py-3">Dates</th>
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
        </div>
    );
}

export default AdminDashboardPage;
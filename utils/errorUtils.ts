/**
 * Maps technical authentication error codes to user-friendly messages.
 * @param error The error object from Firebase or other services
 * @returns A friendly user-facing error message
 */
export const getFriendlyErrorMessage = (error: any): string => {
    // Basic null check
    if (!error) return "An unexpected error occurred.";

    // If it's a string, return it directly if it doesn't look like a code
    if (typeof error === 'string') {
        return error;
    }

    // Check for Firebase Auth Error Codes
    const errorCode = error.code || '';
    const errorMessage = error.message || '';

    switch (errorCode) {
        case 'auth/user-not-found':
        case 'auth/invalid-login-credentials': // New firebase error code
        case 'auth/invalid-credential':
            return "We couldn't find an account with those credentials. Please check your email and password.";

        case 'auth/wrong-password':
            return "Incorrect password. Please try again.";

        case 'auth/invalid-email':
            return "Please enter a valid email address.";

        case 'auth/user-disabled':
            return "This account has been disabled. Please contact support.";

        case 'auth/email-already-in-use':
            return "This email is already registered. Please log in instead.";

        case 'auth/weak-password':
            return "Password should be at least 6 characters long.";

        case 'auth/operation-not-allowed':
            return "This sign-in method is not enabled. Please contact support.";

        case 'auth/too-many-requests':
            return "Too many failed login attempts. Please try again later or reset your password.";

        case 'auth/network-request-failed':
            return "Network error. Please check your internet connection and try again.";

        case 'auth/popup-closed-by-user':
            return "Sign-in was cancelled.";

        default:
            // Fallback: If message exists and isn't too technical, use it. Otherwise generic.
            // Firebase messages are often "Firebase: Error (auth/foo)."
            if (errorMessage && !errorMessage.includes('Firebase:')) {
                return errorMessage;
            }
            return "An unexpected error occurred. Please try again.";
    }
};

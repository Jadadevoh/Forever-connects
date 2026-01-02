import React from 'react';
import { Link } from 'react-router-dom';

const PaymentCancelPage: React.FC = () => {
    return (
        <div className="max-w-2xl mx-auto animate-fade-in">
            <div className="bg-white p-8 sm:p-12 rounded-lg shadow-sm border border-silver text-center">
                {/* Cancel Icon */}
                <div className="mb-6">
                    <div className="mx-auto w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center">
                        <svg
                            className="h-10 w-10 text-yellow-600"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                            />
                        </svg>
                    </div>
                </div>

                {/* Cancel Message */}
                <h1 className="text-4xl font-serif font-bold text-deep-navy mb-4">Payment Cancelled</h1>
                <p className="text-lg text-soft-gray mb-8">
                    Your payment was cancelled. No charges have been made to your account.
                </p>

                {/* Information Box */}
                <div className="bg-pale-sky/40 p-6 rounded-lg border border-silver mb-8 text-left">
                    <h2 className="font-semibold text-deep-navy mb-3">What Happened?</h2>
                    <p className="text-sm text-soft-gray mb-4">
                        You cancelled the payment process before it was completed. This is completely normal, and you can try again whenever you're ready.
                    </p>
                    <h3 className="font-semibold text-deep-navy mb-2">Common Reasons:</h3>
                    <ul className="text-sm text-soft-gray space-y-1 list-disc list-inside">
                        <li>Changed your mind about the plan</li>
                        <li>Want to review features again</li>
                        <li>Need to check with family members</li>
                        <li>Prefer to upgrade later</li>
                    </ul>
                </div>

                {/* Action Buttons */}
                <div className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <Link
                            to="/pricing"
                            className="px-6 py-3 bg-dusty-blue text-white font-bold rounded-lg hover:opacity-90 transition-opacity"
                        >
                            View Plans Again
                        </Link>
                        <Link
                            to="/dashboard"
                            className="px-6 py-3 bg-white border-2 border-silver text-deep-navy font-bold rounded-lg hover:bg-pale-sky transition-colors"
                        >
                            Go to Dashboard
                        </Link>
                    </div>
                    <Link
                        to="/"
                        className="block text-sm text-soft-gray hover:text-deep-navy transition-colors"
                    >
                        Return to Home
                    </Link>
                </div>

                {/* Help Section */}
                <div className="mt-8 pt-6 border-t border-silver">
                    <h3 className="font-semibold text-deep-navy mb-3">Need Help Deciding?</h3>
                    <p className="text-sm text-soft-gray mb-4">
                        We're here to help you choose the right plan for your needs.
                    </p>
                    <div className="flex justify-center gap-4">
                        <Link
                            to="/contact"
                            className="text-dusty-blue hover:underline font-medium text-sm"
                        >
                            Contact Support
                        </Link>
                        <span className="text-silver">|</span>
                        <Link
                            to="/about"
                            className="text-dusty-blue hover:underline font-medium text-sm"
                        >
                            Learn More
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PaymentCancelPage;

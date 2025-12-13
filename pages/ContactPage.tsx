import React, { useState } from 'react';
import { useApiSettings } from '../hooks/useApiSettings';
import { sendContactFormNotification } from '../services/emailService';
import { useSiteSettings } from '../hooks/useSiteSettings';


const ContactPage: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const { apiSettings } = useApiSettings();
  const { siteSettings } = useSiteSettings();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real application, you would handle the form submission here (e.g., save to a database).
    sendContactFormNotification({ name, email, message }, apiSettings, siteSettings.siteName);
    setSubmitted(true);
  };

  const inputStyles = "mt-1 block w-full rounded-md bg-white border-silver shadow-sm focus:border-dusty-blue focus:ring-dusty-blue sm:text-sm text-deep-navy px-3 py-2";
  const labelStyles = "block text-sm font-medium text-deep-navy/90";

  return (
    <div className="animate-fade-in bg-white p-8 sm:p-12 rounded-lg shadow-sm border border-silver max-w-2xl mx-auto">
      <h1 className="text-4xl font-serif font-bold text-deep-navy text-center mb-2">Contact Us</h1>
      <p className="text-lg text-soft-gray text-center mb-8">
        We're here to help. Please fill out the form below with any questions or comments.
      </p>

      {submitted ? (
        <div className="text-center bg-pale-sky/50 p-8 rounded-lg border border-silver">
          <h2 className="text-2xl font-serif text-deep-navy">Thank You!</h2>
          <p className="mt-2 text-deep-navy/90">Your message has been sent. We will get back to you shortly.</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="name" className={labelStyles}>Your Name</label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className={inputStyles}
            />
          </div>
          <div>
            <label htmlFor="email" className={labelStyles}>Your Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className={inputStyles}
            />
          </div>
          <div>
            <label htmlFor="message" className={labelStyles}>Message</label>
            <textarea
              id="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={5}
              required
              className={inputStyles}
            ></textarea>
          </div>
          <div className="text-right">
            <button
              type="submit"
              className="inline-flex justify-center py-2 px-6 border border-transparent shadow-sm text-base font-medium rounded-md text-white bg-dusty-blue hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-dusty-blue"
            >
              Send Message
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default ContactPage;
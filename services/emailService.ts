import { ApiSettings } from '../hooks/useApiSettings';
import { User, Memorial, Tribute, MemorialPlan, Donation, EmailSettings } from '../types';

// A helper function to check if SMTP is configured
const isSmtpConfigured = (settings: ApiSettings): boolean => {
  return !!(settings.smtpHost && settings.smtpPort && settings.smtpUser && settings.smtpPass);
};

// Generic email sending simulation
const sendEmail = (to: string, subject: string, body: string, settings: ApiSettings, memorialEmailSettings?: EmailSettings) => {
  if (isSmtpConfigured(settings)) {
    let finalBody = body;
    let fromInfo = `${settings.smtpUser} (via ${settings.smtpHost}:${settings.smtpPort})`;

    if (memorialEmailSettings) {
      // Wrap body with header and footer
      if (memorialEmailSettings.headerImageUrl) {
        finalBody = `<div style="text-align: center; margin-bottom: 20px; padding-bottom: 20px; border-bottom: 1px solid #eee;"><img src="${memorialEmailSettings.headerImageUrl}" alt="Logo" style="max-width: 200px; max-height: 100px; object-fit: contain;"></div>` + finalBody;
      }
      if (memorialEmailSettings.footerMessage) {
        finalBody = finalBody + `<div style="margin-top: 20px; padding-top: 20px; border-top: 1px solid #eee; font-size: 12px; color: #777; text-align: center;">${memorialEmailSettings.footerMessage.replace(/\n/g, '<br>')}</div>`;
      }
      // Set custom From/Reply-To
      if (memorialEmailSettings.senderName && memorialEmailSettings.replyToEmail) {
        fromInfo = `${memorialEmailSettings.senderName} <${settings.smtpUser}> (Reply-To: ${memorialEmailSettings.replyToEmail})`;
      }
    }

    console.log('%c--- Simulating Email Sent ---', 'color: #3B82F6; font-weight: bold;');
    console.log(`To: ${to}`);
    console.log(`From: ${fromInfo}`);
    console.log(`Subject: ${subject}`);
    console.log('Body (HTML):\n' + '-'.repeat(30));
    console.log(finalBody);
    console.log('-'.repeat(30));
    console.log('%c-----------------------------', 'color: #3B82F6; font-weight: bold;');
  } else {
    console.warn('Email notification skipped: SMTP settings are not configured in the admin dashboard.');
  }
};

// --- New Email Functions ---

// Welcome email sent after registration, including verification link
export const sendWelcomeEmail = (user: User, settings: ApiSettings, siteName: string) => {
  const verificationLink = `${window.location.origin}${window.location.pathname}#/verify-email?token=${Date.now()}`; // Simulated token
  const subject = `Welcome to ${siteName}, ${user.name}!`;
  const body = `
<p>Dear ${user.name},</p>
<p>Welcome! We are honored to have you join our community.</p>
<p>To get started, please verify your email address by clicking the link below:</p>
<p><a href="${verificationLink}">Verify Your Email</a></p>
<p>If you have any questions, please don't hesitate to contact us.</p>
<br>
<p>Sincerely,<br>The ${siteName} Team</p>
  `;
  sendEmail(user.email, subject, body, settings);
};

// Password reset email
export const sendPasswordResetEmail = (email: string, settings: ApiSettings, siteName: string) => {
  const resetLink = `${window.location.origin}${window.location.pathname}#/reset-password?token=${Date.now()}`; // Simulated token
  const subject = `Reset Your Password for ${siteName}`;
  const body = `
<p>Hello,</p>
<p>You requested a password reset. Please click the link below to set a new password:</p>
<p><a href="${resetLink}">Reset Your Password</a></p>
<p>If you did not request this, please ignore this email. This link will expire in 1 hour.</p>
<br>
<p>Sincerely,<br>The ${siteName} Team</p>
  `;
  sendEmail(email, subject, body, settings);
};

// Failed payment reminder (placeholder for webhook-driven logic)
export const sendFailedPaymentNotification = (user: User, settings: ApiSettings, siteName: string) => {
  const subject = `Action Required: Your payment for ${siteName} failed`;
  const body = `
<p>Dear ${user.name},</p>
<p>We were unable to process the payment for your plan. To keep your premium features active, please update your billing information.</p>
<p>[Link to Billing Page]</p>
<p>If you have any questions, please contact our support team.</p>
<br>
<p>Sincerely,<br>The ${siteName} Team</p>
  `;
  sendEmail(user.email, subject, body, settings);
};

// Donation Receipt to Donor
export const sendDonationReceipt = (donorEmail: string, donation: Donation, memorial: Memorial, settings: ApiSettings, siteName: string) => {
  const memorialName = `${memorial.firstName} ${memorial.lastName}`;
  const subject = `Thank you for your donation to the memorial of ${memorialName}`;
  const body = `
<p>Dear ${donation.isAnonymous ? 'Donor' : donation.name},</p>
<p>Thank you for your generous donation of <strong>$${donation.amount.toFixed(2)}</strong>. Your contribution helps preserve the memorial of ${memorialName} and support their family.</p>
<p>${!donation.isAnonymous && donation.message ? `Your message: <blockquote>"${donation.message}"</blockquote>` : ''}</p>
<p>We are grateful for your support.</p>
<br>
<p>Sincerely,<br>The ${siteName} Team</p>
  `;
  sendEmail(donorEmail, subject, body, settings, memorial.emailSettings);
};

// Donation Notification to Memorial Owner
export const sendDonationNotification = (donation: Donation, memorial: Memorial, owner: User, settings: ApiSettings, siteName: string) => {
  const memorialName = `${memorial.firstName} ${memorial.lastName}`;
  const subject = `You have received a new donation for ${memorialName}`;
  const body = `
<p>Dear ${owner.name},</p>
<p>You have received a new donation for the memorial of ${memorialName}.</p>
<p><strong>From:</strong> ${donation.name}</p>
<p><strong>Amount:</strong> $${donation.amount.toFixed(2)}</p>
<p><strong>Message:</strong> <blockquote>"${donation.message}"</blockquote></p>
<br>
<p>Sincerely,<br>The ${siteName} Team</p>
  `;
  sendEmail(owner.email, subject, body, settings, memorial.emailSettings);
};


// --- Existing Email Functions ---

// Specific notification for new tributes
export const sendNewTributeNotification = (
  memorial: Memorial,
  // FIX: Updated type to include 'likes', which is now part of the Tribute type.
  tribute: Omit<Tribute, 'id' | 'createdAt'>,
  owner: User,
  settings: ApiSettings,
  siteName: string
) => {
  const memorialName = `${memorial.firstName} ${memorial.lastName}`;
  const memorialUrl = `${window.location.origin}${window.location.pathname}#/memorial/${memorial.slug}`;

  const subject = `New Tribute for ${memorialName}`;
  const body = `
<p>Dear ${owner.name},</p>
<p>A new tribute has been posted on the memorial for <strong>${memorialName}</strong>.</p>
<p><strong>From:</strong> ${tribute.author}</p>
<p><strong>Message:</strong></p>
<blockquote style="border-left: 2px solid #ccc; padding-left: 10px; margin-left: 5px; font-style: italic;">
  ${tribute.message.replace(/\n/g, '<br>')}
</blockquote>
<p>You can view the new tribute here:</p>
<p><a href="${memorialUrl}">${memorialUrl}</a></p>
<br>
<p>Sincerely,<br>The ${siteName} Team</p>
  `;
  sendEmail(owner.email, subject, body, settings, memorial.emailSettings);
};

// Specific notification for plan upgrades
export const sendPlanUpgradeNotification = (user: User, newPlan: MemorialPlan, settings: ApiSettings, siteName: string) => {
  const subject = 'Your Plan Has Been Upgraded!';
  const body = `
<p>Dear ${user.name},</p>
<p>Thank you for upgrading! Your plan has been successfully changed to <strong>${newPlan}</strong>.</p>
<p>You now have access to all the features of your new plan. If you have any questions, please don't hesitate to contact us.</p>
<br>
<p>Sincerely,<br>The ${siteName} Team</p>
  `;
  sendEmail(user.email, subject, body, settings);
};

// Specific notification for contact form submissions
export const sendContactFormNotification = (
  formData: { name: string; email: string; message: string; subject?: string },
  settings: ApiSettings,
  siteName: string
) => {
  const adminEmail = settings.smtpUser || 'admin@example.com'; // Send to admin
  const baseSubject = `New Contact Form Submission from ${formData.name}`;
  const subject = formData.subject
    ? `${formData.subject} - ${baseSubject} - ${siteName}`
    : `${baseSubject} - ${siteName}`;
  const body = `
<p>You have received a new message from the website contact form.</p>
<p><strong>Name:</strong> ${formData.name}</p>
<p><strong>Email:</strong> ${formData.email}</p>
<p><strong>Message:</strong></p>
<hr>
<p>${formData.message.replace(/\n/g, '<br>')}</p>
<hr>
  `;
  sendEmail(adminEmail, subject, body, settings);
};
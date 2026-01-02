const { onCall, HttpsError } = require("firebase-functions/v2/https");
const { setGlobalOptions } = require("firebase-functions/v2");
const admin = require("firebase-admin");
const { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } = require("@google/generative-ai");

admin.initializeApp();

// Set global options for all functions
setGlobalOptions({ region: "us-central1" });

const safetySettings = [
    {
        category: HarmCategory.HARM_CATEGORY_HARASSMENT,
        threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH,
    },
    {
        category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
        threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH,
    },
    {
        category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
        threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH,
    },
    {
        category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
        threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH,
    },
];

exports.generateBiography = onCall({ cors: true }, async (request) => {
    const { details } = request.data;
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
        console.error("GEMINI_API_KEY is missing from environment variables");
        throw new HttpsError('failed-precondition', 'The Gemini API key is not configured on the server.');
    }

    console.log(`Using API Key (Prefix: ${apiKey.substring(0, 6)}..., Length: ${apiKey.length})`);

    try {
        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({
            model: "gemini-2.0-flash",
            safetySettings
        });

        console.log("Model initialized (gemini-2.0-flash), calling generateContent...");

        const prompt = `Write a heartfelt and respectful biography for a memorial website for ${details.name || 'the deceased'}.
The biography is being written from the perspective of their ${details.relationship || 'loved one'}. The tone should be warm, personal, celebratory of their life, and comforting.
Incorporate the following details into a flowing narrative, not just a list.

Personality Traits to highlight:
---
${details.personalityTraits}
---

Key memories, life events, and highlights:
---
${details.keyMemories}
---

Combine these elements into a beautiful life story that captures the essence of who they were.
`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        return { text };
    } catch (error) {
        console.error("Error in generateBiography function:", error);
        throw new HttpsError('internal', 'VERSION-CHECK-3: Error generating biography: ' + error.message);
    }
});

exports.generateThemeSuggestions = onCall({ cors: true }, async (request) => {
    const { biography } = request.data;
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
        throw new HttpsError('failed-precondition', 'The Gemini API key is not configured on the server.');
    }

    try {
        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({
            model: "gemini-2.0-flash",
            safetySettings,
            generationConfig: {
                responseMimeType: "application/json"
            }
        });

        const prompt = `Based on the tone and content of the following biography, suggest 2-3 suitable visual themes for a memorial website.

Biography:
---
${biography}
---

For each theme, provide the following fields:
- 'name': A unique identifier combining the color palette and layout style (e.g., 'classic-rose-classic').
- 'title': A user-friendly title (e.g., 'Classic Rose (Classic)').
- 'description': A short description of the theme.
- 'colorTheme': The name of the color palette (e.g., 'classic-rose').
- 'layout': The layout style, either 'classic' or 'story'.
- 'colors': An object with 'bg', 'primary', and 'text' hex color codes.

Available Color Palettes:
- 'classic-rose': Soft, warm pinks and creams. Colors: { bg: '#FFF5F5', primary: '#D68C8C', text: '#5E3737' }
- 'modern-blue': Clean, crisp blues and grays. Colors: { bg: '#F0F4F8', primary: '#3B82F6', text: '#1F2937' }
- 'elegant-gold': Luxurious creams and golds. Colors: { bg: '#FCFBF8', primary: '#D4AF37', text: '#4A443A' }
- 'peaceful-green': Natural, calming greens and earthy tones. Colors: { bg: '#F1F5F2', primary: '#6A994E', text: '#386641' }

Available Layout Styles:
- 'classic': A timeless, centered design. Respectful and traditional.
- 'story': An editorial, side-by-side layout that presents the biography and photo like a feature story. More personal and narrative-focused.

Analyze the biography and choose combinations that best fit its feeling.

Return a JSON array of theme objects.
`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        return JSON.parse(text);
    } catch (error) {
        console.error("Error in generateThemeSuggestions function:", error);
        throw new HttpsError('internal', 'Error generating themes: ' + error.message);
    }
});

exports.generateTributeSuggestions = onCall({ cors: true }, async (request) => {
    const { name, relationship, sentiment } = request.data;
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
        throw new HttpsError('failed-precondition', 'The Gemini API key is not configured on the server.');
    }

    try {
        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({
            model: "gemini-2.0-flash",
            safetySettings,
            generationConfig: {
                responseMimeType: "application/json"
            }
        });

        const prompt = `Generate 3 distinct, heartfelt tribute messages for a memorial website for a person named ${name}. 
The person writing the tribute is their ${relationship}.
The desired sentiment for the tribute is "${sentiment}".
The tributes should be short (1-2 sentences), respectful, and personal, matching the sentiment.
Return a JSON array of 3 strings.`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        return JSON.parse(text);
    } catch (error) {
        console.error("Error in generateTributeSuggestions function:", error);
        throw new HttpsError('internal', 'Error generating tribute suggestions: ' + error.message);
    }
});

exports.generateTributeHighlights = onCall({ cors: true }, async (request) => {
    const { tributes } = request.data;
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
        throw new HttpsError('failed-precondition', 'The Gemini API key is not configured on the server.');
    }

    try {
        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({
            model: "gemini-2.0-flash",
            safetySettings,
            generationConfig: {
                responseMimeType: "application/json"
            }
        });

        // Limit inputs to avoid huge prompts
        const inputTributes = tributes.slice(0, 50).join("\n---\n");

        const prompt = `Analyze the following tribute messages from a memorial guestbook:
---
${inputTributes}
---
Extract the 3 to 5 most touching, impactful, or beautifully written short excerpts (1-2 sentences maximum each) that represent the collective love and memory. 
The excerpts should be standalone and emotionally resonant.
Return a JSON array of strings.`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        return JSON.parse(text);
    } catch (error) {
        console.error("Error in generateTributeHighlights function:", error);
        throw new HttpsError('internal', 'Error generating highlights: ' + error.message);
    }
});

exports.createPaymentIntent = onCall({ cors: true }, async (request) => {
    const { amount, currency, metadata } = request.data;
    const stripeKey = process.env.STRIPE_SECRET_KEY;

    if (!stripeKey) {
        console.error("STRIPE_SECRET_KEY is missing from environment variables");
        throw new HttpsError('failed-precondition', 'Stripe payments are not configured on the server.');
    }

    const stripe = require('stripe')(stripeKey);

    try {
        // Create PaymentIntent
        // Amount is expected in cents
        const paymentIntent = await stripe.paymentIntents.create({
            amount,
            currency: currency || 'usd',
            metadata: metadata || {},
            automatic_payment_methods: {
                enabled: true,
            },
        });

        return {
            clientSecret: paymentIntent.client_secret,
        };
    } catch (error) {
        console.error("Error creating payment intent:", error);
        throw new HttpsError('internal', 'Error processing payment: ' + error.message);
    }
});

exports.diag_listModels = onCall({ cors: true }, async (request) => { return { status: "active" }; });

const { onDocumentCreated } = require("firebase-functions/v2/firestore");

exports.onSubscriptionCreated = onDocumentCreated("customers/{uid}/subscriptions/{subscriptionId}", async (event) => {
    const subscription = event.data.data();
    const memorialId = subscription.metadata?.memorialId;
    const status = subscription.status;
    const role = subscription.role; // e.g. 'premium'

    if (memorialId && ['active', 'trialing'].includes(status)) {
        console.log(`Updating memorial ${memorialId} to plan ${role} (subscription)`);
        await admin.firestore().collection('memorials').doc(memorialId).update({
            plan: role || 'premium'
        });
    }
});

exports.onPaymentSuccess = onDocumentCreated("customers/{uid}/payments/{paymentId}", async (event) => {
    const payment = event.data.data();
    const memorialId = payment.metadata?.memorialId;
    const status = payment.status;

    // Check for 'succeeded' status for one-time payments (Eternal)
    if (memorialId && status === 'succeeded') {
        // We need to determine the plan. For Eternal, we might infer or check metadata for plan name if passed.
        // Or assume ONE_TIME payment with memorialId is Eternal.
        // Better: look at prices or metadata.
        // If we passed specific metadata like plan='eternal' in checkout session, the extension copies it to payment metadata?
        // Usually yes.
        // Let's assume we want to set it to 'eternal' if not specified, or check price items if possible.
        // For now, simpler: if payment succeeded and has memorialId, set to eternal (since premium is sub).
        console.log(`Updating memorial ${memorialId} to plan eternal (payment)`);
        await admin.firestore().collection('memorials').doc(memorialId).update({
            plan: 'eternal'
        });
    }
});

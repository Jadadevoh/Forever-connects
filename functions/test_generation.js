const { GoogleGenerativeAI } = require('@google/generative-ai');
const fs = require('fs');
const path = require('path');

// Read API Key from .env manually
const envPath = path.join(__dirname, '.env');
const envContent = fs.readFileSync(envPath, 'utf8');
const apiKeyMatch = envContent.match(/GEMINI_API_KEY=(.*)/);
const apiKey = apiKeyMatch ? apiKeyMatch[1].trim() : null;

if (!apiKey) {
    console.error("API Key not found in .env");
    process.exit(1);
}

async function testGeneration() {
    try {
        const genAI = new GoogleGenerativeAI(apiKey);
        // Using the same config as deployed: gemini-2.0-flash-exp, default API version
        const model = genAI.getGenerativeModel({
            model: "gemini-2.0-flash-exp"
        });

        console.log("Attempting generation with gemini-2.0-flash-exp...");
        const result = await model.generateContent("Say 'Hello, World!' if you are working.");
        const response = await result.response;
        console.log("Success! Response:", response.text());
    } catch (e) {
        console.error('Error:', e.message);
        if (e.message.includes('404')) {
            console.error("404 Error details: The model might not exist or the API version is wrong.");
        }
    }
}
testGeneration();

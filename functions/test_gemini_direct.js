const { GoogleGenerativeAI } = require("@google/generative-ai");

async function testGemini() {
    // Using the key found in .env as VITE_API_KEY (assuming this is the one intended for Gemini)
    const apiKey = "AIzaSyA4hSp9vCYFIcqQuHpc5_6fHKtM1WZEPm4";

    console.log("Testing Gemini API Key: " + apiKey.substring(0, 10) + "...");

    try {
        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        const prompt = "Explain the meaning of life in one sentence.";
        console.log("Sending prompt: " + prompt);

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        console.log("\n✅ SUCCESS! API Response:");
        console.log(text);
    } catch (error) {
        console.error("\n❌ FAILED. Error details:");
        console.error(error.message);
    }
}

testGemini();

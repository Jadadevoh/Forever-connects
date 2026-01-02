const fs = require('fs');
const path = require('path');
const https = require('https');

async function verify() {
    try {
        const envPath = path.join(__dirname, '.env');
        if (!fs.existsSync(envPath)) {
            console.error(".env file not found in functions directory");
            return;
        }
        const envContent = fs.readFileSync(envPath, 'utf8');
        const match = envContent.match(/GEMINI_API_KEY=(.*)/);

        if (!match) {
            console.error("GEMINI_API_KEY not found in .env");
            return;
        }

        const apiKey = match[1].trim();
        console.log("Found API Key: " + apiKey.substring(0, 5) + "...");

        const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;

        console.log("Fetching models list from API...");

        https.get(url, (res) => {
            let data = '';
            res.on('data', (chunk) => data += chunk);
            res.on('end', () => {
                console.log(`Status Code: ${res.statusCode}`);
                if (res.statusCode === 200) {
                    try {
                        const json = JSON.parse(data);
                        console.log("Available Models:");
                        if (json.models) {
                            json.models.forEach(m => console.log(`- ${m.name}`));
                        } else {
                            console.log("No models field in response:", data);
                        }
                    } catch (e) {
                        console.log("Error parsing JSON:", e);
                        console.log("Raw body:", data);
                    }
                } else {
                    console.log("Request failed:", data);
                }
            });
        }).on('error', (err) => {
            console.error("Error making request:", err);
        });

    } catch (err) {
        console.error("Error:", err);
    }
}
verify();

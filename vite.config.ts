import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current working directory.
  // Set the third parameter to '' to load all env regardless of the `VITE_` prefix.
  const env = loadEnv(mode, process.cwd(), '');

  return {
    plugins: [react()],
    server: {
      port: 8080,
      host: '0.0.0.0'
    },
    preview: {
      port: 8080,
      host: '0.0.0.0',
      allowedHosts: true,
    },
    define: {
      // Explicitly define environment variables to pass to the client.
      // This prevents exposing the entire process.env object.
      'process.env': {
        API_KEY: env.API_KEY,
        FIREBASE_API_KEY: env.FIREBASE_API_KEY,
        FIREBASE_AUTH_DOMAIN: env.FIREBASE_AUTH_DOMAIN,
        FIREBASE_PROJECT_ID: env.FIREBASE_PROJECT_ID,
        FIREBASE_STORAGE_BUCKET: env.FIREBASE_STORAGE_BUCKET,
        FIREBASE_MESSAGING_SENDER_ID: env.FIREBASE_MESSAGING_SENDER_ID,
        FIREBASE_APP_ID: env.FIREBASE_APP_ID,
        FIREBASE_MEASUREMENT_ID: env.FIREBASE_MEASUREMENT_ID,
      }
    }
  };
});
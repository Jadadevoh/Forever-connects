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
    }
  };
});
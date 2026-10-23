import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import { handleApi } from './server/api.mjs';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  for (const name of ['SMTP_HOST', 'SMTP_PORT', 'SMTP_USER', 'SMTP_PASSWORD', 'SMTP_FROM', 'PRIVACY_REVIEWED', 'PRIVACY_NOTICE_PATH']) {
    if (env[name] && !process.env[name]) process.env[name] = env[name];
  }
  return {
  plugins: [react(), {
    name: 'enquiry-api',
    configureServer(server) { server.middlewares.use(handleApi); },
  }],
  server: { host: '0.0.0.0', port: 5173, strictPort: true },
  };
});

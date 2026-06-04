import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

const root = path.dirname(fileURLToPath(import.meta.url));
const flowxPublicDir = path.resolve(root, '../flowx/public');

export default defineConfig({
  plugins: [react(), tailwindcss()],
  publicDir: flowxPublicDir,
});

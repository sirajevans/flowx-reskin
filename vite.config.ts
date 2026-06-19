import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

const root = path.dirname(fileURLToPath(import.meta.url));
const localPublicDir = path.resolve(root, 'public');
const siblingPublicDir = path.resolve(root, '../flowx/public');
const publicDir = fs.existsSync(localPublicDir)
  ? localPublicDir
  : fs.existsSync(siblingPublicDir)
    ? siblingPublicDir
    : localPublicDir;

export default defineConfig({
  define: {
    'process.env.DRAGGABLE_DEBUG': 'false',
  },
  plugins: [react(), tailwindcss()],
  publicDir,
});

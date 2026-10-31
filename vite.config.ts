import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';

const base = process.env.GITHUB_REPOSITORY
  ? `/${process.env.GITHUB_REPOSITORY.split('/')[1]}/`
  : './';

export default defineConfig(() => {
  return {
    base,
    plugins: [
      react(),
      tailwindcss(),
      VitePWA({
        registerType: 'autoUpdate',
        includeAssets: ['favicon.svg', 'icon.svg'],
        manifest: {
          id: './',
          name: 'Saiful Islam Rifat · Goal & Vision Roadmap',
          short_name: 'SIR Roadmap',
          description: 'Saiful Islam Rifat - Lifelong Personal Goals, Vision, Knowledge & Roadmap App',
          theme_color: '#09090b',
          background_color: '#09090b',
          display: 'standalone',
          orientation: 'portrait-primary',
          start_url: './',
          scope: './',
          icons: [
            {
              src: 'icon.svg',
              sizes: '512x512',
              type: 'image/svg+xml',
              purpose: 'any'
            },
            {
              src: 'icon.svg',
              sizes: '512x512',
              type: 'image/svg+xml',
              purpose: 'maskable'
            }
          ]
        },
        devOptions: {
          enabled: true,
          type: 'module'
        }
      })
    ],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.')
      }
    }
  };
});

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  base: '/Inclusive_Auditor/',
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['icons/icon.svg', 'icons/maskable-icon.svg'],
      manifest: {
        name: 'TRU Accessibility Audit',
        short_name: 'TRU Audit',
        description: 'TRU Inclusive & Accessible Spaces Audit',
        start_url: '/Inclusive_Auditor/index.html',
        scope: '/Inclusive_Auditor/',
        display: 'standalone',
        background_color: '#fff5de',
        theme_color: '#003e51',
        icons: [
          {
            src: '/Inclusive_Auditor/icons/icon.svg',
            sizes: 'any',
            type: 'image/svg+xml'
          },
          {
            src: '/Inclusive_Auditor/icons/maskable-icon.svg',
            sizes: 'any',
            type: 'image/svg+xml',
            purpose: 'maskable'
          }
        ]
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,svg,png,ico,json,txt,woff2}'],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*$/i,
            handler: 'StaleWhileRevalidate',
            options: {
              cacheName: 'google-fonts-stylesheets'
            }
          },
          {
            urlPattern: /^https:\/\/fonts\.gstatic\.com\/.*$/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'google-fonts-webfonts',
              expiration: {
                maxEntries: 20,
                maxAgeSeconds: 31536000
              }
            }
          }
        ]
      }
    })
  ]
});

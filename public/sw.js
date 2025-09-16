// Simple service worker skeleton
const CACHE_NAME = 'cv-photo-studio-v1';

self.addEventListener('install', (event) => {
  console.log('Service Worker installing');
});

self.addEventListener('activate', (event) => {
  console.log('Service Worker activating');
});

self.addEventListener('fetch', (event) => {
  // Basic fetch handling - implementation coming soon
});
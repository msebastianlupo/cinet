'use strict'

const CACHE_NAME = "v1";

importScripts('https://storage.googleapis.com/workbox-cdn/releases/7.0.0/workbox-sw.js');


// recursos precacheados
const precacheados = [
    '/*.html',
    '/*.js',
    '/*.css',
    '/*.png',
    '/*.gif',
    '/*.ttf'
];
  
  self.addEventListener('install', (event) => {
    event.waitUntil(caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(precacheados);
    }));
  });       


self.addEventListener("message", event => {
    if(event.data && event.data.type == "SKIP_WAITING"){
        self.skipWaiting();
    }
})

workbox.routing.registerRoute(
    new RegExp('/.*'),
    new workbox.strategies.StaleWhileRevalidate({
        cacheName: CACHE_NAME
    })
)
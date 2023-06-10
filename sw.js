'use strict'

const CACHE_NAME = "v1";

importScripts('https://storage.googleapis.com/workbox-cdn/releases/7.0.0/workbox-sw.js');


// recursos precacheados
const precacheados = [
    '/index.html',
    '/guardadas.html',
    '/trailers.html',
    '/css-ft/estilos.css',
    '/css-ft/default-sans.ttf',
    '/img/busqueda.png',
    '/img/cerrado.png',
    '/img/guardado.png',
    '/img/loading.png',
    '/img/logo.png',
    '/img/menu.png',
    '/img/no-disponible.png',
    '/img/siguiente.png'
];
  
self.addEventListener('install', (event) => {
    event.waitUntil(caches.open(CACHE_NAME)
        .then((cache) => {
            return cache.addAll(precacheados);
        })
    );
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
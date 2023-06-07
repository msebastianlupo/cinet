'use strict'

if('serviceWorker' in navigator){
    navigator.serviceWorker.register('../sw.js')
    .then((mensaje) => {
        console.info("Service Worker funcionando");
    })
}else{
    console.warn("Este navegador no soporta Service Worker");
}
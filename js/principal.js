'use strict'

let nav = document.querySelector("nav");
let inputBuscador = document.querySelector("#input-buscador");
const accion = new Accion("Cinet | Ventana");
const datos = new Datos("main", accion.crearCarga, accion.romperCarga);
const youtube = new Youtube("AIzaSyD-2DWzuRVp9aYdM7rW2k2pNqTyVvY0ops", "main", "#titulo");

nav.addEventListener("click", (e) => {
    if(e.target.id === "buscador"){
        accion.quitarClase(".menu-lista-secciones", "top-cero");
        accion.alternarClases(".buscador-cont", "top-cero");
    }
    else if(e.target.id === "menu"){
        accion.quitarClase(".buscador-cont", "top-cero");
        accion.alternarClases(".menu-lista-secciones", "top-cero");
    }
    else if(e.target.className === "cerrar"){
        accion.quitarClase(".menu-lista-secciones", "top-cero");
        accion.quitarClase(".buscador-cont", "top-cero");
    }
})

inputBuscador.addEventListener("keyup", (e) => {
    let valor = e.target.value.trim();
    if(e.key === "Enter" && valor.length){
        if(datos.detectarArchivo("guardadas.html")){
            datos.filtrarGuardadas(e.target.value, ".div-peli-cont");
        }else if(navigator.onLine){
            if(datos.detectarArchivo("trailers.html")){
                youtube.pedirTrailer(valor);
            }else if(datos.detectarArchivo("index.html")){
                accion.crearCarga();
                fetch(`https://www.omdbapi.com/?apikey=8b43f631&s=${valor}&type=movie`)
                .then(res => {
                    return res.json();
                })
                .then(json => {
                    json.Response === "True" ? datos.mostrarResultados(json) : console.warn("No se encontró ningún resultado");
                    accion.romperCarga();
                })
            }
        }else{
            accion.notificar("¡Para buscar películas necesitás conexión a internet", 4000, "div-noticia-mala");
        }
    }
})

if(datos.detectarArchivo("guardadas.html")){
    datos.generarFichaGuardada();
}

/*Bienvenida*/
if(!localStorage.getItem("cinet-slider") && datos.detectarArchivo("index.html")){
    accion.crearSlider(
        [
            {
                ruta: "img/slide1.png", desc: "Obtené información fácilmente sobre cualquier película"
            },
            {
                ruta: "img/slide2.png", desc: "Mirá un trailer de inmediato usando el buscador dinámico"
            },
            {
                ruta: "img/slide3.png", desc: "Ya estás listo para empezar. Vamos..."
            }
        ]
    );
}

if(!datos.detectarArchivo("index.html") && !datos.detectarArchivo("guardadas.html") && !datos.detectarArchivo("trailers.html")){
    location.href = "index.html";
}

addEventListener("offline", () => {
    accion.notificar("¡La conexión falló!", 3000, "div-noticia-mala");
})

addEventListener("online", () => {
    accion.notificar("¡De nuevo online!", 3000, "div-noticia-buena");
})

if(!navigator.onLine){
    datos.detectarArchivo("guardadas.html") || accion.notificar("Sin conexión: solo es posible acceder a las películas guardadas", 4000, "div-noticia-mala");
}
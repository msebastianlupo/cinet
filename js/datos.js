'use strict'


/**
 * trabaja con los json de https://www.omdbapi.com/
 */
class Datos {
    /**
     * @param {function} tag elemento html donde se generará el contenido
     * @param {function} loadFunc la función que se ejecutará mientras se realizan consultas por fetch. opcional
     * @param {function} closeFunc la función que se ejecutará cuando fetch devuelva resultados. opcional
     */
    constructor(tag, loadFunc = null, closeFunc = null){
        this.tag = document.querySelector(tag);
        this.loadFunc = loadFunc;
        this.closeFunc = closeFunc;
    }

    /**
     * muestra los resultados de búsqueda, incluyendo el póster y un botón para obtener los datos de cada película
     * @param {object} json con todos los resultados de películas
     */
    mostrarResultados(json){
        let padreCheck = document.querySelector("#padre");
        if(padreCheck){
            padreCheck.remove();
        }
        let padre = document.createElement("div");
        padre.id = "padre";
        let h1 = document.querySelector("#titulo");
        h1.innerText = `Películas encontradas: ${json.Search.length}`;
        this.tag.append(padre);
        for(let valor of json.Search){
            let div = document.createElement("div");
            let div2 = document.createElement("div");
            let h2 = document.createElement("h2");
            let img = document.createElement("img");
            let div3 = document.createElement("div");
            let button = document.createElement("button");
            div.classList.add("div-peli-cont");
            div2.classList.add("div-h2-img-cont");
            h2.classList.add("h2-titulo-busqueda");
            img.classList.add("img-poster");
            button.classList.add("btn-buscar-ficha");
            div3.classList.add("div-ficha-cont");
            h2.innerText = `${valor.Title} | ${valor.Year}`;
            if(valor.Poster !== "N/A") {
                img.src = valor.Poster;
            }else{
                img.src = "img/no-disponible.png";
            }
            img.alt = valor.Title;
            div3.id = valor.imdbID;
            button.innerText = "Información";
            div2.append(h2, img);
            div3.append(button);
            div.append(div2, div3);
            padre.append(div);
            button.addEventListener("click", (e) => {
                this.obtenerFichaOmdb(e, valor.imdbID, valor.Title);
            })
        }
    }

    /**
     * obtiene datos de una película en omdb (ficha técnica)
     * @param {object} e evento que dispara esta consulta para eliminar botones que ya cumplieron su función. es opcional
     * @param {string} id del elemento html a poblar, será enviado a generarFicha()
     * @param {string} titulo de la película a buscar en omdb
     */
    obtenerFichaOmdb(e = null, id, titulo){
        if(this.loadFunc){
            this.loadFunc();
        }
        try{
            fetch(`https://www.omdbapi.com/?apikey=8b43f631&t=${titulo}&type=movie`)
            .then(res => {
                if(!res.ok){
                    throw new Error("No se pueden conseguir los datos de la película");
                }
                return res.json();
            })
            .then(json => {
                this.generarFicha(id, json);
                if(e){
                    e.target.remove();
                }
                this.closeFunc();
            })    
        }catch(error){
            
        }
    }

    /**
     * inserta los datos disponibles de una película en un elemento html
     * @param {string} id del item a a poblar
     * @param {object} json de la película a mostrar
     * @param {string} btn un texto para el título de la imagen guardar. opcional
     */
    generarFicha(id, json, btn = ""){
        let elemento = document.querySelector("#" + id),
        pGuardar = document.createElement("p"),
        imgGuardar = document.createElement("img"),
        pTitulo = document.createElement("p"),
        pEstreno = document.createElement("p"),
        pDuracion = document.createElement("p"),
        pGenero = document.createElement("p"),
        pDirector = document.createElement("p"),
        pEscritor = document.createElement("p"),
        pActores = document.createElement("p"),
        pSinopsis = document.createElement("p"),
        button = document.createElement("button");
        imgGuardar.classList.add("img-guardar");
        imgGuardar.src = "img/guardado.png";
        imgGuardar.alt = titulo;
        btn === "" ? imgGuardar.title = "Guardar/quitar " + json.Title : imgGuardar.title = btn + json.Title;
        pTitulo.innerText = `Título: ${json.Title}`;
        pEstreno.innerText = `Estreno: ${json.Released}`;
        pDuracion.innerText = `Dureción: ${json.Runtime}`;
        pGenero.innerText = `Género: ${json.Genre}`;
        pDirector.innerText = `Director: ${json.Director}`;
        pEscritor.innerText = `Escritor: ${json.Writer}`;
        pActores.innerText = `Actores: ${json.Actors}`;
        pSinopsis.innerText = `Sinópsis: ${json.Plot}`;
        button.innerText = "Información";
        button.classList.add("btn-buscar-ficha", "controlable");
        pGuardar.append(imgGuardar);
        elemento.append(pGuardar, pTitulo, pEstreno, pDuracion, pGenero, pDirector, pEscritor, pActores, pSinopsis, button);
        imgGuardar.addEventListener("load", () => {
            if(this.checkearGuardado(json)){
                imgGuardar.classList.add("opacidad-5");
            }
        })
        imgGuardar.addEventListener("click", (e) => {
            this.alternarGuardado(e, json);
        })
        button.addEventListener("click", (e) => {
            this.alternarDatos(e);
        })
    }

    alternarDatos(e){
        let elemento = document.querySelector("#" + e.target.parentNode.id);
        let listaP = elemento.querySelectorAll("p");
        for(let p of listaP){
            p.classList.toggle("no-visible");
        }
    }

    /**
     * guarda o borra películas
     * @param {object} e el evento
     * @param {object} json la película
     */
    alternarGuardado(e, json){
        let almacen = localStorage.getItem("cinet");
        let agregar = true;
        if(almacen?.length){
            let almacenParse = JSON.parse(almacen);
            for(let n = 0; n < almacenParse.length; n++){
                if(almacenParse[n].imdbID === json.imdbID){
                    almacenParse.splice(n, 1);
                    agregar = false;
                    if(this.detectarArchivo("guardadas.html")){
                        e.target.parentNode.parentNode.parentNode.remove();
                        break;
                    }
                    e.target.classList.remove("opacidad-5");
                    break;
                }
            }
            if(agregar){
                almacenParse.unshift(json);
            }
            let almacenString = JSON.stringify(almacenParse);
            localStorage.setItem("cinet", almacenString);
        }else{
            let arrAlmacen = [];
            arrAlmacen.push(json);
            let arrAlmacenString = JSON.stringify(arrAlmacen);
            localStorage.setItem("cinet", arrAlmacenString);
        }
        if(agregar){
            e.target.classList.add("opacidad-5");
        }
    }

    /**
     * checkea si la película está guardada
     * @param {object} json la película
     * @returns {boolean} true si lo encuentra o false si no lo encuentra
     */
    checkearGuardado(json){
        let almacen = localStorage.getItem("cinet");
        if(almacen){
            let almacenParse = JSON.parse(almacen);
            for(let peli of almacenParse){
                if(peli.imdbID === json.imdbID){
                    return true;
                }
            }
        }
        return false;
    }

    /**
     * genera una ficha para las películas guardadas
     */
    generarFichaGuardada(){
        let almacen = localStorage.getItem("cinet");
        if(almacen?.length){
            let almacenParse = JSON.parse(almacen);
            let padreCheck = document.querySelector("#padre");
            if(padreCheck){
                padreCheck.remove();
            }
            let padre = document.createElement("div");
            padre.id = "padre";
            this.tag.append(padre);
            for(let value of almacenParse){
                let div = document.createElement("div");
                let h2 = document.createElement("h2");
                let div2 = document.createElement("div");
                div.classList.add("div-peli-cont", "background-cover", "padding-top-cero");
                h2.classList.add("h2-peli-guardada");
                h2.innerText = `${value.Title} | ${value.Year}`;
                if(value.Poster !== "N/A"){
                    div.style.backgroundImage = `url('${value.Poster}')`;
                }else{
                    img.src = "img/no-disponible.png";
                }
                div2.id = value.imdbID;
                div2.classList.add("div-ficha-cont");
                div.append(h2, div2);
                padre.append(div);
                this.generarFicha(value.imdbID, value, "Quitar ");
            }
        }
    }

    /**
     * oculta todos los elementos que no se relacionan con la búsqueda, añadiendo una clase css "no-visible-seg"
     * @param {string} input búsqueda deseada
     * @param {string} tag html, id o clase el cual ocultará cuando haya coincidencias
     */
    filtrarGuardadas(input, tag){
        let inputFix = input.toLowerCase();
        let elementos = document.querySelectorAll(tag);
        for(let value of elementos){
            let valueFix = value.firstChild.innerText.toLowerCase();
            if(!valueFix.includes(inputFix)){
                value.classList.add("no-visible-seg");
            }else{
                value.classList.remove("no-visible-seg");
            }
        }
    }

    /**
     * detecta el nombre del documento
     * @param {string} nombre del archivo
     * @returns {boolean} true si coincide con la ruta, false si es diferente
     */
    detectarArchivo(nombre){
        let url = location.href;   
        let ultimoSlash = url.lastIndexOf("/");
        let archivo = url.substring(ultimoSlash + 1);
        return  archivo === nombre || archivo === nombre + "#";
    }
}
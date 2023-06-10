'use strict'

//**crea un reproductor de video embebido*/
class Youtube {
    /**
     * @param {string} apiKey la clave provista por google
     * @param {string} tag elemento html, id o clase sobre la que creará el productor
     * @param {string} elemTitulo elemento html, id o clase sobre la que mostrará el título del video
     */
    constructor(apiKey, tag, elemTitulo){
        this.apiKey = apiKey;
        this.tag = tag;
        this.elemTitulo = elemTitulo;
    }

    pedirTrailer(consulta){
        const accion = new Accion("Youtube");
        accion.crearCarga();
        try{
            fetch(`https://www.googleapis.com/youtube/v3/search?q=${consulta} trailer&part=snippet&type=video&maxResults=1&key=${this.apiKey}`)
            .then(res => {
                if(!res.ok){
                    throw new Error("No se puede conseguir el trailer");
                }
                return res.json();
            })
            .then(json => {
                this.crearReproductor(json);
                accion.romperCarga();
            })
        }catch(error){
            accion.romperCarga();
        }
    }

    /**
     * crea el reproductor
     * @param {object} json el objeto api v3
     * @param {number} pos la posición del item json. Usará el primero si no se especifica
     */
    crearReproductor(json, pos = 0){
        if(json.items.length){
            let checkIframe = document.querySelector("#iframe-player");
            if(checkIframe){
                checkIframe.remove();
            }
            let iframe = document.createElement("iframe");
            iframe.id = "iframe-player";
            iframe.src = `https://www.youtube.com/embed/${json.items[pos].id.videoId}`;
            iframe.setAttribute("allowfullscreen", "");
            let tag = document.querySelector(this.tag);
            let titulo = document.querySelector(this.elemTitulo);
            tag.append(iframe);
            titulo.innerText = json.items[pos].snippet.title;
        }else{
            console.warn("No se encontró el trailer, probá otra vez");
        }
    }
}
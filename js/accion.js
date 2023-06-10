'use strict'

/**
 * crea elementos gráficos interactivos para el usuario
 */
class Accion {

    /**
     * @param {string} titulo predeterminado
     */
    constructor(titulo){
        this.titulo = titulo;
    }

    /**
     * crea una caja de bienvenida para mostrar
     * @param {array} arr un array de objetos que deben poseer dos propiededades "ruta" (de la imagen) y "desc" (descripción)
     */
    crearSlider(arr){
        localStorage.setItem("cinet-slider", "false");
        try {
            let body = document.querySelector("body");
            let divCont = document.createElement("div");
            let divCaja = document.createElement("div");
            let imgSiguiente = document.createElement("img");
            divCont.id = "div-cont";
            divCaja.id = "div-caja";
            imgSiguiente.id = "img-siguiente";
            imgSiguiente.src = "img/siguiente.png";
            imgSiguiente.alt = "Siguiente";
            imgSiguiente.title = "Siguiente";
            for(let dato of arr){
                let divImgCont = document.createElement("div");
                let img = document.createElement("img");
                let h3 = document.createElement("h3");
                divImgCont.classList.add("slider-div", "slider-off");
                img.src = dato.ruta;
                h3.classList.add("h3-slider");
                h3.innerText = dato.desc;
                divImgCont.append(img, h3);
                divCaja.append(divImgCont);
            }
            divCont.append(divCaja, imgSiguiente);
            imgSiguiente.addEventListener("click", e => {
                this.deslizar();
            })
            body.append(divCont);
    
            //para que el primero se visualice
            let slPred = document.querySelector(".slider-div")
            slPred.classList.add("slider-on");
        }catch (error) {
            console.error("Error en argumentos o rutas inexistentes." + error);
        }
    }

    /**
     * desplaza el slider, cuando no hay más items que mostrar cierra
     * @returns {boolean} true mientras el slider sea visible, false en otros casos
     */
    deslizar(){
        let slidersDiv = document.querySelectorAll(".slider-div");
        if(slidersDiv){
            for(let n = 0; n < slidersDiv.length; n++){
                if(slidersDiv[n].classList.contains("slider-on")){
                    slidersDiv[n].classList.remove("slider-on");
                    if(n + 1 < slidersDiv.length){
                        slidersDiv[n + 1].classList.add("slider-on");
                        return true;
                    }else{
                        slidersDiv[n].classList.add("slider-on");
                        this.destruir("#div-cont");
                    }
                }
            }
        }
        return false;
    }

    /**
     * @param {string} elem una etiqueta, una clase (. + clase) o un (# + id) cualquiera sea para destruir
     * @returns {boolean} true si es eliminado, false si no existe de antemano en el DOM
     */
    destruir(elem){
        let elemento = document.querySelector(elem);
        if(elemento){
            elemento.remove();
            return true;
        }
        return false;
    }

    /**
     * aplica y quita clases css al elemento especificado
     * @param {string} elem una etiqueta, una clase (. + clase) o un (# + id) cualquiera sea para aplicarle las clases
     * @param {string} clases conjunto de clases separadas por coma, sin utilizar puntos
     * @returns {boolean} true si el elemento existe en el DOM, false si no existe
     */
    alternarClases(elem, clases){
        let elemento = document.querySelector(elem);
        if(elemento){
            let fixClases = clases.replace(/ /g, "");
            let arrClases = fixClases.split(",");
            for(let clase of arrClases){
                try{
                    elemento.classList.toggle(clase);
                }catch(err){
                    console.error("Error de sintaxis: nombres de clases o caracteres inválidos");
                }
            }
            return true;
        }
        return false;
    }

    /**
     * quita una clase css específica
     * @param {string} elem una etiqueta, una clase (. + clase) o un (# + id) cualquiera sea para quitarle la clase
     * @returns {boolean} true si el elemento existe en el DOM, false si no existe
     */
    quitarClase(elem, clase){
        let elemento = document.querySelector(elem);
        if(elemento){
            elemento.classList.remove(clase);
            return true;
        }
        return false;
    }

    /**
     * bloquea el sitio durante alguna operación. el contenedor usa una clase css "div-bloqueado"
     */
    crearCarga(){
        console.info("Se están realizando tareas, aguardá");
        let div = document.createElement("div");
        div.classList.add("div-bloqueado");
        document.body.append(div);
    }

    /**
     * destruye la capa creada
     */
    romperCarga(){
        console.info("Tarea finalizada");
        let divBloqueado = document.querySelector(".div-bloqueado");
        if(divBloqueado){
            divBloqueado.remove();
        }
    }

    /**
     * crea un aviso al usuario y se autodestruye en el tiempo especificado
     * @param {string} mensaje el aviso
     * @param {string} tiempo en milisegundos
     * @param {string} clase css según el tipo de noticia
     */
    notificar(mensaje, tiempo, clase){
        let div = document.createElement("div");
        div.classList.add("div-noticia", clase);
        div.innerText = mensaje;
        document.body.append(div);
        setTimeout(() => {
            div.remove();
        }, tiempo);
    }
}


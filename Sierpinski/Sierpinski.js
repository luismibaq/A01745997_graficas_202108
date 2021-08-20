import { Triangulo } from "./Triangulo.js";



function main() {
    // Obtener el contexto
    const canvas = document.getElementById("htmlCanvas");
    if (!canvas) {
        console.log("Error al cargar el canvas");
        return;
    }
    const contexto = canvas.getContext("2d");


    prim.dibujar();
    let prim = new Triangulo(250,20,100,280,400,280,"black",null,contexto);
    
    let slider = document.getElementById("myRange");
    let output = document.getElementById("demo");
    output.innerHTML = slider.value;

    slider.oninput = function () {
        output.innerHTML = this.value;
        prim.dibujar();
        prim.crearHijos(this.value);
    }
}

main();
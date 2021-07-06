//Constructores
function Seguro (marca, year, tipo){
    this.marca = marca;
    this.year = year;
    this.tipo = tipo;
}

//Realiza la cotización con los datos
Seguro.prototype.cotizarSeguro = function (){ //no utilizo arrow pq tengo q acceder a los datos del obj
    /*
        1 = Americano 1.15
        2 = Asiatico 1.05
        3 = Europeo 1.35 
    */

   let cantidad;
   const base = 2000;

   console.log(this.marca)
   switch(this.marca){
        case"1":
            cantidad = base* 1.15;
            break;
        case"2":
            cantidad = base* 1.05;
            break;
        case"3":
            cantidad = base* 1.35;
            break;
        default:
            break;
   }

   //Leer el año
   const diferencia = new Date ().getFullYear() - this.year;

   // Cada año que la diferencia es mayor, el costo va a reducirse un 3%
   cantidad -= ((diferencia * 3) * cantidad ) / 100;

   /* 
        Si el seguro es basico se multiplica por 30% mas
        si es completo 50% mas
   */

        if(this.tipo ==="basico"){
            cantidad *= 1.30;
        } else {
            cantidad *= 1.50;
        }

   console.log(cantidad);

   return cantidad;

}

function UI() {}

//Llena las opciones de los años

UI.prototype.llenarOpciones = () => {
    const max = new Date ().getFullYear(),
        min = max - 22;

    const selectYear = document.querySelector("#year");

    for ( let i = max; i > min; i-- ){
        let option = document.createElement("option");
        option.value = i;
        option.textContent = i;
        selectYear.appendChild(option);
    }
}

//Muestras alertas en pantalla
UI.prototype.mostrarMensaje = (mensaje, tipo) => {
    const div = document.createElement("div");

    if (tipo === "error"){
        div.classList.add(/* "mensaje" */ "error"); //El error y el correcto son class de css
    } else {
        div.classList.add(/* "mensaje" */ "correcto");
    }

    div.classList.add("mensaje", "mt-10"); //agrega el msj y le da un margen top 10
    div.textContent = mensaje;

    //Insertar en el HTML
    const formulario = document.querySelector("#cotizar-seguro");
    formulario.insertBefore(div, document.querySelector("#resultado")) //el nuevo nodo y el nodo de referencia donde lo inserto

    setTimeout(() =>{
        div.remove();
    }, 3000)


}

UI.prototype.mostrarResultado = (total, seguro) => {
    //destructuring
    const { marca, year, tipo } = seguro
    
    let textoMarca;

    switch(marca){
        case"1":
            textoMarca = "Americano";
            break;
        case"2":
            textoMarca = "Asiatico";
            break;
        case"3":
            textoMarca = "Europeo";
            break;
        default:
                break;
    }

    //Crear el resultado
    const div = document.createElement("div");
    div.classList.add("mt-10"); // css tailwind

    div.innerHTML = `
    <p class="header"> Tu resumen </p>
    <p class="font-bold"> Tipo: <span class="font-normal capitalize"> ${tipo}</p>
    <p class="font-bold"> Total: <span class="font-normal"> $ ${total}</p>
    <p class="font-bold"> Marca: <span class="font-normal"> ${textoMarca}</p>
    <p class="font-bold"> Año: <span class="font-normal"> ${year}</p>
    `
    const resultadoDiv = document.querySelector("#resultado");

    

    //mostrar el spinner
    const spinner = document.querySelector("#cargando");
    spinner.style.display ="block";

    setTimeout(() => {
        spinner.style.display ="none"; //se borra el spinner
        resultadoDiv.appendChild(div) // se muestra el resultado
    }, 3000 )


}

//Instanciar UI
const ui = new UI();


document.addEventListener("DOMContentLoaded", ()=>{
    ui.llenarOpciones(); //llena el select con los años..
});

eventListeners()
function eventListeners(){
    const formulario = document.querySelector("#cotizar-seguro");
    formulario.addEventListener("submit", cotizarSeguro)
}

function cotizarSeguro(e){
    e.preventDefault();
    
    //Leer la marca seleccionada
    const marca = document.querySelector("#marca").value;
    
    //Leer el año seleccionado
    const year = document.querySelector("#year").value;

    //Leer el tipo de cobertura
    const tipo = document.querySelector('input[name="tipo"]:checked').value;

    if(marca === "" || year === "" || tipo === "" ){
        ui.mostrarMensaje("Todos los campos son obligatorios" , "error"); //es un proto, mensaje, tipo de mensaje
        return; //para cortar la ejecución
    } 

    ui.mostrarMensaje("Cotizando..." , "correcto");

    //Ocultar las cotizaciones previas
    //detecta si hay un div adentro de resultado y lo elimina
    const resultados = document.querySelector("#resultado div");
    if(resultados != null ){
        resultados.remove();
    }


    //Instanciar el seguro
    const seguro = new Seguro(marca, year, tipo);
    const total = seguro.cotizarSeguro();


    //Utilizar el prototype que va a cotizar
    ui.mostrarResultado(total, seguro);


}

let indiceEditando = null;
let tickets = [];

function mostrarExito(msg){
    let el = document.getElementById("msg-exito");

    el.textContent = msg;
    el.style.display = "block";

    setTimeout(
        function(){
            el.style.display = "none";
        }
        , 3000
    )
}

function renderizarTodos(){
    document.getElementById("panel-tickets").innerHTML = "";

    tickets.forEach(function(t, i){
        crearTarjeta(t, i);
    });
}

function mostrarError(msg){
    let el = document.getElementById("msg-error");
    el.textContent = msg;
    el.style.display = msg ? "block" : "none"
}

function getBadgesClass(estado){
    // if (estado === "Nuevo"){
    //     return "badge badge--new"
    // }else if(estado === "En Curso"){
    //     return "badge badge--active"
    // }else if(estado === "Urgente"){
    //     return "badge badge--urgent"
    // }else if(estado === "Resuelto"){
    //     return "badge badge--closed"
    // }else{
    //     return "badge badge--closed"
    // }

    if(estado === "Nuevo") return "badge badge--new"
    if(estado === "En Curso") return "badge badge--active"
    if(estado === "Urgente") return "badge badge--urgent"
    if(estado === "Resuelto") return "badge--done"
    return "badge badge--closed"
    
}

function actualizarContador(){
    document.getElementById("contador").textContent = tickets.length
}

function crearTarjeta(parametro1, indice){
    let div = document.createElement("div");

    div.className = "tarjeta";
    div.className = "ticket";
    div.dataset.indice = indice

    div.innerHTML = `
        <h3>${parametro1.titulo}</h3>
        <p> 
             ${parametro1.descripcion}
        </p>
        <span class="${getBadgesClass(parametro1.estado)}"> ${parametro1.estado} </span>
        <p><strong> Prioridad:</strong> ${parametro1.prioridad} </p>
        <button class="btn-eliminar">Eliminar</button>
        <button class="btn-editar">Editar</button>
    `;

    div.querySelector(".btn-eliminar").addEventListener("click", function(){
        let ok = window.confirm("¿Estas seguro que deseas eliminar este ticket?")
      
        if(!ok) return;

        let pos = parseInt(div.dataset.indice);
        tickets.splice(pos,1);
        actualizarContador();
        div.remove();
    });

    div.querySelector(".btn-editar").addEventListener("click",function(){
        let pos = parseInt(div.dataset.indice);

        document.getElementById("input-titulo").value = tickets[pos].titulo;
        document.getElementById("input-descripcion").value = tickets[pos].descripcion;
        document.getElementById("input-prioridad").value = tickets[pos].prioridad;
        document.getElementById("input-estado").value = tickets[pos].estado;

        indiceEditando = pos;

        document.getElementById("btn-crear").textContent = "Guardar Cambios";
        document.getElementById("btn-crear").style.backgroundColor = "#854F0B";

        document.getAnimations("form-ticket").scrollIntoView({ behavior: "smooth" })
    });

    document.getElementById("panel-tickets").appendChild(div);
}

const formTicket = document.getElementById("form-ticket");

formTicket.addEventListener("submit", function(e){
    e.preventDefault();

    let titulo = document.getElementById("input-titulo").value;

    if(titulo.trim() === ""){
        mostrarError("El titulo no puede estar vacio.");
        // alert("El titulo no puede estar vacio.")
        return;
    }

    mostrarError("");

    if(indiceEditando !== null){
        //MODO EDICION
        tickets[indiceEditando].titulo = titulo;
        tickets[indiceEditando].descripcion = document.getElementById("input-descripcion").value;
        tickets[indiceEditando].estado = document.getElementById("input-estado").value;
        tickets[indiceEditando].prioridad = document.getElementById("input-prioridad").value;

        renderizarTodos();

        indiceEditando = null;
        document.getElementById("btn-crear").textContent = "Crear Ticket";
        document.getElementById("btn-crear").style.backgroundColor = "";
        mostrarExito("Ticket actualizado correctamente.");

    }else{
        //MODO CREACION
        let nuevoTicket = {
            titulo: titulo,
            descripcion: document.getElementById("input-descripcion").value,
            estado: document.getElementById("input-estado").value,
            prioridad: document.getElementById("input-prioridad").value
        };

        tickets.push(nuevoTicket);  

        crearTarjeta(nuevoTicket, tickets.length - 1);

        actualizarContador();
    }


    e.target.reset();
});


document.getElementById("btn-limpiar").addEventListener("click",function(){

    tickets = [];
    document.getElementById("panel-tickets").innerHTML = "";
    actualizarContador();
});


// ======================================================================================================






// formTicket.addEventListener("submit", function(e){
//     e.preventDefault();

//     const tituloCapturado = document.getElementById("input-titulo").value;
//     const prioridadCapturada = document.getElementById("input-prioridad").value;
    

//     console.log("Titulo: ", tituloCapturado);
//     console.log("Prioridad: ", prioridadCapturada);
//     // console.log("descripcion: ", descripcionCapturada);

//     const descripcionCapturada = document.getElementById("input-descripcion");

//     descripcionCapturada.textContent = tituloCapturado;
// });
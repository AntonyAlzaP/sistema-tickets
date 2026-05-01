
let filtroActual = "todos"
let indiceEditando = null;
let tickets = [];

const toastEl = document.getElementById("toast");
const modalOverlay = document.getElementById("modal-overlay");
// const btnAbrirModal = document.getElementById("btn-abrir-modal");
const btnHeroCrear = document.getElementById("btn-hero-crear");
const btnCerrarModal = document.getElementById("btn-modal-cerrar");
const btnCancelarModal = document.getElementById("btn-cancelar-modal");
const panelTickets = document.getElementById("panel-tickets");
const formTicket = document.getElementById("form-ticket");

function abrirModal(){
    modalOverlay.classList.add("activo");
    document.body.style.overflow = "hidden";
    document.getElementById("modal-titulo").focus();
}

function cerrarModal(){
    modalOverlay.classList.remove("activo");
    document.body.style.overflow = "";
    resetearFormulario();
}

modalOverlay.addEventListener("click", function(e){
    if(e.target === modalOverlay) cerrarModal();
});

document.addEventListener("keydown", function(e){
    if(e.key == "Escape" && modalOverlay.classList.contains("activo")){
        cerrarModal();
    }
});

// btnAbrirModal.addEventListener("click", abrirModal);
btnHeroCrear.addEventListener("click", abrirModal);
btnCerrarModal.addEventListener("click", cerrarModal);
btnCancelarModal.addEventListener("click", cerrarModal);

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

function aplicarFiltro(filtro){
    filtroActual = filtro;

    document.querySelectorAll(".filtro-btn").forEach(function(btn){
        btn.classList.toggle("activo", btn.dataset.filtro === filtro);
    });

    panelTickets.querySelectorAll(".ticket").forEach(function(tarjeta){
        
        const estado = tarjeta.dataset.estado;
        const visible = filtro === "todos" || estado === filtro;
      
        tarjeta.style.display = visible ? "" : "none";
    });
}

document.querySelectorAll(".filtro-btn").forEach(function(btn){
    btn.addEventListener("click",function(){
        aplicarFiltro(btn.dataset.filtro);
    })
});

function renderizarTodos(){
    panelTickets.innerHTML = "";

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
    div.dataset.indice = indice;
    div.dataset.estado = parametro1.estado;

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
        actualizarStats();
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

    panelTickets.appendChild(div);
}



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

        mostrarToast("El ticket se creo de manera correcta", "error")
    }

    actualizarStats();
    cerrarModal();
    e.target.reset();
});


document.getElementById("btn-limpiar").addEventListener("click",function(){

    tickets = [];
    panelTickets.innerHTML = "";
    actualizarStats();
    actualizarContador();
});


function mostrarToast(mensaje, tipo = "exito"){
    toastEl.textContent = mensaje;
    toastEl.className = `toast toast--${tipo} visible`;

    setTimeout(function(){
        toastEl.classList.remove("visible");
    }, 3000);
}

function actualizarStats(){
    const nuevos = tickets.filter(t => t.estado === "Nuevo").length;
    const enCurso = tickets.filter(t => t.estado === "En Curso").length;
    const resueltos = tickets.filter(t => t.estado === "Resuelto").length;

    document.getElementById("stat-total").textContent = tickets.length;
    document.getElementById("stat-nuevos").textContent = nuevos;
    document.getElementById("stat-curso").textContent = enCurso;
    document.getElementById("stat-resueltos").textContent = resueltos;
}

// ! constructores
function Seguro(marca, year, tipo) {
	this.marca = marca;
	this.year = year;
	this.tipo = tipo;
}

// Realiza la cotiacion del seguro
Seguro.prototype.cotizarSeguro = function () {
	let cantidad;
	const base = 2000;

	switch (this.marca) {
		case "1":
			cantidad = base * 1.15;
			break;
		case "2":
			cantidad = base * 1.05;
			break;
		case "3":
			cantidad = base * 1.35;
			break;

		default:
			break;
	}

	// Leer el anio, cada anio el seguro se decrementa un 3%
	const diferencia = new Date().getFullYear() - this.year;
	cantidad -= (diferencia * 3 * cantidad) / 100;

	// Si es basico aumenta 30%, si es completo 50%

	if (this.tipo === "basico") {
		cantidad *= 1.3;
	} else {
		cantidad *= 1.5;
	}
	return cantidad;
};

function UI() {}

// prototype para llenar las opciones de los anios
UI.prototype.llenarAnios = () => {
	const max = new Date().getFullYear(),
		min = max - 20;
	const selectAnios = document.getElementById("year");
	for (let i = max; i > min; i--) {
		let option = document.createElement("option");
		option.value = i;
		option.textContent = i;
		selectAnios.appendChild(option);
	}
};

// prototype para mostrar las alertas en pantalla
UI.prototype.mostrarMensaje = (mensaje, tipo) => {
	const div = document.createElement("div");

	if (tipo === "error") {
		div.classList.add("error");
	} else {
		div.classList.add("correcto");
	}

	div.classList.add("mensaje", "mt-10");
	div.textContent = mensaje;

	//Insertar en HTML
	const formulario = document.querySelector("#cotizar-seguro");
	formulario.insertBefore(div, document.querySelector("#resultado"));

	setTimeout(() => {
		div.remove();
	}, 1500);
};

UI.prototype.mostrarResultado = (total, seguro) => {
	const { marca, year, tipo } = seguro;
	let textoMarca;

	switch (marca) {
		case "1":
			textoMarca = "Americano";
			break;
		case "2":
			textoMarca = "Asiatico";
			break;
		case "3":
			textoMarca = "Europeo";
			break;

		default:
			break;
	}

	//Crear el Resultado
	const div = document.createElement("div");
	div.classList.add("mt-10");
	div.innerHTML = `
    <p class="header">Tu Resumen:</p>
    <p class='font-bold'>Marca: ${textoMarca}</p>    
    <p class='font-bold'>Año: ${year}</p>    
    <p class='font-bold capitalize'>Tipo de Seguro: ${tipo}</p>    
    <p class='font-bold'>Total: <span class='font-normal'> $${total}</span></p>    
  `;
	const resultadoDiv = document.querySelector("#resultado");

	//Mostar el Spinner
	const spinner = document.querySelector("#cargando");
	spinner.style.display = "block";

	setTimeout(() => {
		spinner.style.display = "none";
		resultadoDiv.appendChild(div);
	}, 1500);
};

// instanciar UI para llenar los anios
const ui = new UI();

document.addEventListener("DOMContentLoaded", () => {
	ui.llenarAnios();
});

eventListeners();
function eventListeners() {
	const formulario = document.getElementById("cotizar-seguro");
	formulario.addEventListener("submit", cotizarSeguro);
}

function cotizarSeguro(e) {
	e.preventDefault();

	//? leer la marca seleccionada
	const marca = document.querySelector("#marca").value;

	//? leer el año seleccionado
	const year = document.querySelector("#year").value;

	//? leer el tipo de seguro seleccionado (Input Radio)
	const tipo = document.querySelector('input[name="tipo"]:checked').value;

	if (marca == "" || year == "" || tipo == "") {
		ui.mostrarMensaje("Todos los campos son obligatorios", "error");
		return;
	}
	ui.mostrarMensaje("Cotizando...", "correcto");

	// Ocultar cotizaciones previas
	const resultados = document.querySelector("#resultado div");
	if (resultados != null) {
		resultados.remove();
	}

	// Instanciando seguro
	const seguro = new Seguro(marca, year, tipo);
	const total = seguro.cotizarSeguro();

	// Utilizar el prototype que va a cotiar el seguro
	ui.mostrarResultado(total, seguro);
}

// ===============================
// ELEMENTOS DEL DOM
// ===============================
const form = document.getElementById('presupuesto-form');

const productoRadios = document.querySelectorAll('input[name="producto"]');
const plazoInput = document.getElementById('plazo');
const extrasCheckbox = document.querySelectorAll('.extra');
const presupuestoFinal = document.getElementById('presupuesto-final');
const plazoInfo = document.getElementById('plazo-info');

// ===============================
// CÁLCULO DE PRESUPUESTO
// ===============================
function calcularPresupuesto() {

    // Producto base
    const productoSeleccionado = document.querySelector('input[name="producto"]:checked');
    let base = parseFloat(productoSeleccionado.dataset.price);

    // Extras
    let extrasTotal = 0;
    extrasCheckbox.forEach(extra => {
        if (extra.checked) {
            extrasTotal += parseFloat(extra.dataset.price);
        }
    });

    // Subtotal
    let total = base + extrasTotal;

    // Plazo
    const meses = parseInt(plazoInput.value);
    let mensajePlazo = "Plazo estándar";

    if (meses <= 4) {
        total *= 0.9; // crea el 10% descuento
        mensajePlazo = "Descuento aplicado: 10%";
    } else if (meses > 9) {
        total *= 1.05; // crea el 5% recargo
        mensajePlazo = "Recargo aplicado: 5%";
    }

    plazoInfo.textContent = `${mensajePlazo} (${meses} meses)`;
    presupuestoFinal.value = `${total.toFixed(2)} €`;
}

// ===============================
// UTILIDADES DE ERROR
// ===============================
function setError(input, message) {
    const errorElement = input.nextElementSibling;
    errorElement.textContent = message;
    input.classList.add('error-input');
}

function clearError(input) {
    const errorElement = input.nextElementSibling;
    errorElement.textContent = '';
    input.classList.remove('error-input');
}

// ===============================
// VALIDACIÓN DEL FORMULARIO
// ===============================
function validarFormulario() {

    let valido = true;

    const nombre = form.nombre;
    const apellidos = form.apellidos;
    const telefono = form.telefono;
    const email = form.email;
    const privacidad = form.privacy;

    const regexTexto = /^[A-Za-zÀ-ÿ\s]+$/;
    const regexTelefono = /^[0-9]{9}$/;
    const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    // ===== NOMBRE =====
    if (!nombre.value.trim()) {
        setError(nombre, "El nombre es obligatorio.");
        valido = false;
    } else if (!regexTexto.test(nombre.value) || nombre.value.length > 15) {
        setError(nombre, "Solo letras y máximo 15 caracteres.");
        valido = false;
    } else {
        clearError(nombre);
    }

    // ===== APELLIDOS =====
    if (!apellidos.value.trim()) {
        setError(apellidos, "Los apellidos son obligatorios.");
        valido = false;
    } else if (!regexTexto.test(apellidos.value) || apellidos.value.length > 40) {
        setError(apellidos, "Solo letras y máximo 40 caracteres.");
        valido = false;
    } else {
        clearError(apellidos);
    }

    // ===== TELÉFONO =====
    if (!regexTelefono.test(telefono.value)) {
        setError(telefono, "Debe tener exactamente 9 números.");
        valido = false;
    } else {
        clearError(telefono);
    }

    // ===== EMAIL =====
    if (!regexEmail.test(email.value)) {
        setError(email, "Introduce un email válido.");
        valido = false;
    } else {
        clearError(email);
    }

    // ===== PRIVACIDAD =====
    const privacyError = privacidad.closest('label').nextElementSibling;
    if (!privacidad.checked) {
        privacyError.textContent = "Debes aceptar la política de privacidad.";
        valido = false;
    } else {
        privacyError.textContent = "";
    }

    return valido;
}


// ===============================
// EVENTOS DE PRESUPUESTO
// ===============================
productoRadios.forEach(radio =>
    radio.addEventListener('change', calcularPresupuesto)
);

plazoInput.addEventListener('input', calcularPresupuesto);

extrasCheckbox.forEach(extra =>
    extra.addEventListener('change', calcularPresupuesto)
);

// ===============================
// ENVÍO DEL FORMULARIO
// ===============================
form.addEventListener('submit', function (e) {
    e.preventDefault();

    if (!validarFormulario()) {
        return; // 🚫 Por favor revise campos incorrectos
    }

    // ✅ SOLO entra aquí si todo es válido
    alert("Formulario enviado correctamente 🚀");

    form.reset();
    calcularPresupuesto();
});

// ===============================
// INIT
// ===============================
window.addEventListener('DOMContentLoaded', calcularPresupuesto);


['nombre', 'apellidos', 'telefono', 'email'].forEach(campo => {
    form[campo].addEventListener('input', validarFormulario);
});
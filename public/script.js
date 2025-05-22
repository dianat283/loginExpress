document.getElementById('btn-cotizar').addEventListener('click', async () => {
    const response = await fetch('/aseguradoras');
    const aseguradoras = await response.json();

    console.log(aseguradoras); // Muestra los datos de aseguradoras en la consola
});

async function crearAseguradora() {
    const datos = {
        identificacion: document.getElementById("identificacion").value,
        razon_social: document.getElementById("razon_social").value,
        cobertura: document.getElementById("cobertura").value
    };

    const response = await fetch('/aseguradoras', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(datos)
    });

    const resultado = await response.json();
    console.log(resultado); // Confirmación desde el backend
    document.getElementById("mensaje").innerText = resultado.mensaje;

    obtenerAseguradoras(); // Actualiza la lista en la página
}

async function obtenerAseguradoras() {
    const response = await fetch('/aseguradoras'); // Solicitar datos al backend
    const aseguradoras = await response.json(); // Convertir respuesta a JSON

    let listaHTML = "<h3>Lista de Aseguradoras</h3>";
    aseguradoras.forEach(aseguradora => {
        listaHTML += `<p><strong>${aseguradora.razon_social}</strong> - Cobertura: ${aseguradora.cobertura}</p>`;
    });

    document.getElementById("resultadoConsulta").innerHTML = listaHTML; // Mostrar datos en la página
}

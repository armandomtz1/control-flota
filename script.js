const URL_FISICO = "https://script.google.com/macros/s/AKfycbx.../exec";

const URL_CONTAMINANTES = "https://script.google.com/macros/s/AKfycbyXXXXXXXXXXX_CONTAMINANTES/exec"; // Reemplaza por tu URL

let datosGlobal = [];

async function cargarFisicoMecanica() {
  await cargarDesdeURL(URL_FISICO);
}
async function cargarContaminantes() {
  await cargarDesdeURL(URL_CONTAMINANTES);
}

async function cargarDesdeURL(url) {
  try {
    const res = await fetch(url);
    const datos = await res.json();
    datosGlobal = datos;
    renderizarTabla(datos);
    renderizarPanel(datos);
  } catch (error) {
    console.error("Error:", error);
  }
}

function renderizarTabla(datos) {
  const encabezados = Object.keys(datos[0] || {});
  const tabla = document.getElementById("tablaDatos").getElementsByTagName("tbody")[0];
  const headerRow = document.getElementById("encabezados");
  headerRow.innerHTML = "";
  encabezados.forEach(col => {
    const th = document.createElement("th");
    th.textContent = col;
    headerRow.appendChild(th);
  });

  tabla.innerHTML = "";
  datos.forEach(fila => {
    const tr = document.createElement("tr");
    encabezados.forEach(col => {
      const td = document.createElement("td");
      td.textContent = fila[col];
      tr.appendChild(td);
    });
    tabla.appendChild(tr);
  });
}

function renderizarPanel(datos) {
  const panel = document.getElementById("panelEstadisticas");
  const contador = {
    "Vigente": 0,
    "En cambio": 0,
    "Vencida": 0,
    "Instalado": 0
  };

  datos.forEach(fila => {
    const estatus = fila["Estatus"];
    if (contador[estatus] !== undefined) {
      contador[estatus]++;
    }
  });

  panel.innerHTML = `
    <div class="card" onclick="filtrarPorEstatus('Vigente')"><h3>✅ Vigente</h3><p>${contador["Vigente"]}</p></div>
    <div class="card" onclick="filtrarPorEstatus('En cambio')"><h3>⚠️ En cambio</h3><p>${contador["En cambio"]}</p></div>
    <div class="card" onclick="filtrarPorEstatus('Vencida')"><h3>❌ Vencida</h3><p>${contador["Vencida"]}</p></div>
    <div class="card" onclick="filtrarPorEstatus('Instalado')"><h3>🟡 Instalado</h3><p>${contador["Instalado"]}</p></div>
  `;
}

function filtrarPorEstatus(estatus) {
  const filtrados = datosGlobal.filter(fila => fila["Estatus"] === estatus);
  renderizarTabla(filtrados);
}

function filtrarTabla() {
  const texto = document.getElementById("buscador").value.toLowerCase();
  const filtrados = datosGlobal.filter(fila => {
    return fila["Placa"]?.toString().toLowerCase().includes(texto);
  });
  renderizarTabla(filtrados);
}

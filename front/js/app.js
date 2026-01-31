const API_URL = "https://script.google.com/macros/s/AKfycbwqMSLZZrnsFnHzMHTk1wcP2vAxGeDGxeqtOL5ShA4BV27isKxwziRKac68WQFNKtkfCg/exec";

const nome = document.getElementById("nome");
const id = document.getElementById("id");
const turno = document.getElementById("turno");
const cargo = document.getElementById("cargo");
const presenca = document.getElementById("presenca");
const buscarId = document.getElementById("buscarId");
const idOriginal = document.getElementById("idOriginal");

const horasNome = document.getElementById("horasNome");
const dom = document.getElementById("dom");
const seg = document.getElementById("seg");
const ter = document.getElementById("ter");
const qua = document.getElementById("qua");
const qui = document.getElementById("qui");
const sex = document.getElementById("sex");
const sab = document.getElementById("sab");
const resultadoHoras = document.getElementById("resultadoHoras");
const description = document.getElementById("description");

let funcionarioOriginal = null;

// ================= LOGIN =================
function showResult() {
  const usuarios = [
    { nome: "Renan Santos", id: 324 },
    { nome: "Guima Krek", id: 307 },
    { nome: "Escarlat Paccine", id: 2567 },
    { nome: "Barbara Schneider", id: 938 },
    { nome: "Ravine Blunt", id: 637 },
    { nome: "Luiz Cerreti", id: 2370 },
    { nome: "Marcos Daniel", id: 1324 },
    { nome: "Alberto Wolf", id: 4334 },
    { nome: "Bia Soares", id: 696 },
    { nome: "Mario Santana", id: 618 },
    { nome: "Jaqueline", id: 1103 },
    { nome: "Ray Rizzi", id: 1332 },
    { nome: "Chico Clout", id: 2736 },
    { nome: "Rafaela Infinity", id: 1411 }
  ];

  const optionsHTML = usuarios.map(u =>
    `<option value="${u.nome} - ${u.id}">${u.nome} - ${u.id}</option>`
  ).join('');

  Swal.fire({
    title: 'Selecione seu usuário',
    html: `<select id="meuSelect" style="width:50%"><option value="">Escolha...</option>${optionsHTML}</select>`,
    allowOutsideClick: false,
    preConfirm: () => {
      const value = document.getElementById('meuSelect').value;
      if (!value) {
        Swal.showValidationMessage('Selecione uma opção');
        return false;
      }
      document.getElementById('user-name').innerText = value;
      return value;
    }
  });
}

// ================= LIMPAR CAMPOS =================
function limparCampos() {
  nome.value = "";
  id.value = "";
  turno.value = "Manhã";
  cargo.value = "Estagiário";
  presenca.value = "";
  buscarId.value = "";
  idOriginal.value = "";

  horasNome.value = "";
  dom.value = seg.value = ter.value = qua.value = qui.value = sex.value = sab.value = "";
  resultadoHoras.value = "";
  description.value = "";
}

// ================= CADASTRAR =================
async function cadastrar() {
  const funcionario = {
    nome: nome.value,
    id: id.value,
    turno: turno.value,
    cargo: cargo.value,
    presenca: presenca.value
  };

  Swal.fire({ title: 'Salvando...', didOpen: () => Swal.showLoading() });

  const res = await fetch(API_URL, {
    method: "POST",
    body: JSON.stringify({ action: "cadastrar", funcionario })
  });

  const msg = await res.json();
  Swal.close();

  if (msg.erro) return Swal.fire("Erro", msg.erro, "error");
  Swal.fire("Sucesso!", msg, "success");
}

// ================= BUSCAR =================
async function buscarPorId() {
    const idBusca = buscarId.value || document.getElementById("user-select").value;

    if (!idBusca) return Swal.fire("Digite um ID", "", "warning");

    Swal.fire({ title: 'Buscando...', didOpen: () => Swal.showLoading() });

    const res = await fetch(API_URL, {
        method: "POST",
        body: JSON.stringify({ action: "buscar", id: idBusca })
    });

    const func = await res.json();
    Swal.close();

    if (func.erro) return Swal.fire("Erro", func.erro, "error");

    funcionarioOriginal = { ...func };

    nome.value = func.nome;
    id.value = func.id;
    turno.value = func.turno;
    cargo.value = func.cargo;
    presenca.value = func.presenca;
    idOriginal.value = func.id;

    horasNome.value = func.nome;
    dom.value = func.dom || "";
    seg.value = func.seg || "";
    ter.value = func.ter || "";
    qua.value = func.qua || "";
    qui.value = func.qui || "";
    sex.value = func.sex || "";
    sab.value = func.sab || "";
    description.value = func.description || "";
    

    resultadoHoras.value = func.total || "00:00:00";

    Swal.fire("Funcionário encontrado!", "", "success");

    document.getElementById('horasContainer').classList.remove("hidden");
    document.getElementById('calculadora').classList.remove("hidden");
}

// ================= ALTERAR =================
async function alterar() {
    if (!funcionarioOriginal) return Swal.fire("Busque antes de alterar", "", "warning");

    const funcionario = {
        nome: nome.value,
        id: id.value,
        idOriginal: idOriginal.value,
        turnoAtual: funcionarioOriginal.turno,
        turnoNovo: turno.value,
        cargo: cargo.value,
        presenca: presenca.value
    };

    Swal.fire({ title: 'Atualizando...', didOpen: () => Swal.showLoading() });

    const res = await fetch(API_URL, {
        method: "POST",
        body: JSON.stringify({ action: "alterar", funcionario })
    });

    const msg = await res.json();
    Swal.close();

    if (msg.erro) return Swal.fire("Erro", msg.erro, "error");
    Swal.fire("Atualizado!", msg.message, "success");
}

// ================= REMOVER =================
async function remover() {
    Swal.fire({ title: 'Removendo...', didOpen: () => Swal.showLoading() });

    const res = await fetch(API_URL, {
        method: "POST",
        body: JSON.stringify({ action: "remover", id: id.value, turno: turno.value })
    });

    const msg = await res.json();
    Swal.close();

    if (msg.erro) return Swal.fire("Erro", msg.erro, "error");
    Swal.fire("Removido!", msg, "success");
}

// ================= SALVAR HORAS =================
async function salvarHoras() {
    const dados = {
        nome: horasNome.value,
        dom: dom.value, seg: seg.value, ter: ter.value, qua: qua.value,
        qui: qui.value, sex: sex.value, sab: sab.value,
        description: description.value
    };

    Swal.fire({ title: 'Salvando horas...', didOpen: () => Swal.showLoading() });

    const res = await fetch(API_URL, {
        method: "POST",
        body: JSON.stringify({ action: "salvarHoras", dados })
    });

    const msg = await res.json();
    Swal.close();

    if (msg.erro) return Swal.fire("Erro", msg.erro, "error");
    Swal.fire("Horas salvas!", msg, "success");
}

// ================= CARREGAR USUÁRIOS POR TURNO =================
async function carregarUsuariosPorTurno() {
    const turnoSel = document.getElementById("turno-select").value;

    Swal.fire({ title: 'Carregando...', didOpen: () => Swal.showLoading() });

    const res = await fetch(API_URL + "?action=usuariosTurno&turno=" + turnoSel);
    const lista = await res.json();
    Swal.close();

    const select = document.getElementById("user-select");
    select.innerHTML = `<option disabled selected>Médicos</option>`;

    lista.forEach(u => {
        const op = document.createElement("option");
        op.value = u.id;
        op.textContent = u.nome;
        select.appendChild(op);
    });
}

function validarCampo(id) {
    const campo = document.getElementById(id);
    const valor = campo.value.toLowerCase();

    let totalSegundos = 0;

    const dias = ["dom", "seg", "ter", "qua", "qui", "sex", "sab"];

    dias.forEach(dia => {
    const v = document.getElementById(dia).value;

    if (
        v &&
        v.includes(":") &&
        !["ausente", "falta", "-"].includes(v.toLowerCase())
    ) {
        totalSegundos += horaParaSegundos(v);
    }
    });

    document.getElementById("resultadoHoras").value =
    segundosParaHora(totalSegundos);

      // ===== REGRAS DE COR =====
    if (valor.includes(":")) {
        const segundosDigitados = horaParaSegundos(valor);
        const minPedido = horaParaSegundos("00:30:00");
        const segundosMeta = horaParaSegundos("02:00:00");

        if (segundosDigitados >= segundosMeta) {
            campo.style.color = "green";
        } else if (segundosDigitados < minPedido) {
            campo.style.color = "red";
        } else {
        campo.style.color = "orange";
        
    }

    } else if (valor === "ausente") {
        campo.style.color = "purple";
    } else if (valor === "falta") {
        campo.style.color = "red";
    } else if (valor === "-") {
        campo.style.color = "gray";
    } else {
        campo.style.color = "";
    }
}

window.validarCampo = validarCampo;


// ================= INIT =================
window.onload = () => {
    limparCampos();
    showResult();
};

// deixar global pros botões HTML
window.cadastrar = cadastrar;
window.buscarPorId = buscarPorId;
window.alterar = alterar;
window.remover = remover;
window.salvarHoras = salvarHoras;
window.carregarUsuariosPorTurno = carregarUsuariosPorTurno;

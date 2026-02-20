const meses = [
    "Janeiro","Fevereiro","Março","Abril","Maio","Junho",
    "Julho","Agosto","Setembro","Outubro","Novembro","Dezembro"
];

let dados = JSON.parse(localStorage.getItem("sistemaFinanceiro")) || {};

const mesSelect = document.getElementById("mesSelect");
const pensaoInput = document.getElementById("pensaoInput");
const resumoDiv = document.getElementById("resumo");
const resumoGeralDiv = document.getElementById("resumoGeral");
const statusPensao = document.getElementById("statusPensao");

meses.forEach(mes => {
    const option = document.createElement("option");
    option.value = mes;
    option.textContent = mes;
    mesSelect.appendChild(option);
});

mesSelect.addEventListener("change", atualizarTela);
document.getElementById("salvarPensao").addEventListener("click", salvarPensao);
document.getElementById("addRecebimento").addEventListener("click", adicionarRecebimento);
document.getElementById("pagarPensao").addEventListener("click", pagarPensao);

function obterMesAtual() {
    const mes = mesSelect.value;
    if (!dados[mes]) {
        dados[mes] = {
            pensao: 0,
            pensaoPaga: false,
            recebimentos: []
        };
    }
    return dados[mes];
}

function salvar() {
    localStorage.setItem("sistemaFinanceiro", JSON.stringify(dados));
}

function salvarPensao() {
    const mes = obterMesAtual();
    mes.pensao = parseFloat(pensaoInput.value) || 0;
    salvar();
    atualizarTela();
}

function adicionarRecebimento() {
    const mes = obterMesAtual();
    const data = document.getElementById("dataInput").value;
    const valor = parseFloat(document.getElementById("valorInput").value);

    if (!data || !valor) return;

    mes.recebimentos.push({
        data,
        valor,
        dizimo: valor * 0.10,
        oferta: valor * 0.05
    });

    salvar();
    atualizarTela();
}

function pagarPensao() {
    const mes = obterMesAtual();
    mes.pensaoPaga = true;
    salvar();
    atualizarTela();
}

function atualizarTela() {
    const mes = obterMesAtual();

    let totalRecebido = 0;
    let totalDizimo = 0;
    let totalOferta = 0;

    mes.recebimentos.forEach(r => {
        totalRecebido += r.valor;
        totalDizimo += r.dizimo;
        totalOferta += r.oferta;
    });

    const saldo = totalRecebido - totalDizimo - totalOferta - mes.pensao;

    resumoDiv.innerHTML = `
        <p>Total Recebido: R$ ${totalRecebido.toFixed(2)}</p>
        <p>Total Dízimo: R$ ${totalDizimo.toFixed(2)}</p>
        <p>Total Oferta: R$ ${totalOferta.toFixed(2)}</p>
        <p>Pensão: R$ ${mes.pensao.toFixed(2)}</p>
        <p>Saldo Final: R$ ${saldo.toFixed(2)}</p>
    `;

    if (mes.pensaoPaga) {
        statusPensao.innerHTML = "<span class='verde'>Pensão Paga</span>";
    } else {
        statusPensao.innerHTML = "<span class='vermelho'>Pensão Pendente</span>";
    }

    gerarResumoGeral();
}

function gerarResumoGeral() {
    let html = "";

    meses.forEach(mes => {
        if (dados[mes]) {
            html += `
                <p>
                ${mes} - 
                Pensão: R$ ${dados[mes].pensao.toFixed(2)} - 
                ${dados[mes].pensaoPaga ? 
                    "<span class='verde'>Paga</span>" : 
                    "<span class='vermelho'>Pendente</span>"}
                </p>
            `;
        }
    });

    resumoGeralDiv.innerHTML = html;
}

atualizarTela();

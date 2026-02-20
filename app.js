let banco = JSON.parse(localStorage.getItem("financeiroCompleto")) || {};

let mesSelecionado = "";

function salvar() {
    localStorage.setItem("financeiroCompleto", JSON.stringify(banco));
}

function formatar(valor) {
    return valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

function selecionarMes() {
    mesSelecionado = document.getElementById("mes").value;

    if (!banco[mesSelecionado]) {
        banco[mesSelecionado] = {
            pensaoMensal: 0,
            recebimentos: [],
            pagamentosPensao: []
        };
    }

    salvar();
    atualizarResumo();
}

function definirPensao() {
    if (!mesSelecionado) return;

    banco[mesSelecionado].pensaoMensal =
        parseFloat(document.getElementById("pensaoMensal").value) || 0;

    salvar();
    atualizarResumo();
}

function adicionarRecebimento() {
    if (!mesSelecionado) return;

    const data = document.getElementById("dataRecebimento").value;
    const valor = parseFloat(document.getElementById("valorRecebido").value);

    if (!data || !valor) return;

    const dizimo = valor * 0.10;
    const oferta = valor * 0.05;

    banco[mesSelecionado].recebimentos.push({ data, valor, dizimo, oferta });

    salvar();
    atualizarResumo();
}

function pagarPensao() {
    if (!mesSelecionado) return;

    const valor = parseFloat(document.getElementById("valorPensaoPago").value);
    if (!valor) return;

    banco[mesSelecionado].pagamentosPensao.push(valor);

    salvar();
    atualizarResumo();
}

function atualizarResumo() {
    if (!mesSelecionado) return;

    const dados = banco[mesSelecionado];

    let totalRecebido = 0;
    let totalDizimo = 0;
    let totalOferta = 0;

    dados.recebimentos.forEach(r => {
        totalRecebido += r.valor;
        totalDizimo += r.dizimo;
        totalOferta += r.oferta;
    });

    let totalPensaoPaga = dados.pagamentosPensao.reduce((a, b) => a + b, 0);
    let pensaoRestante = dados.pensaoMensal - totalPensaoPaga;
    if (pensaoRestante < 0) pensaoRestante = 0;

    let saldo = totalRecebido - (totalDizimo + totalOferta + totalPensaoPaga);

    let statusPensao = pensaoRestante === 0 && dados.pensaoMensal > 0
        ? "<span style='color:green;font-weight:bold;'>Pensão Quitada</span>"
        : "<span style='color:red;font-weight:bold;'>Pendente</span>";

    document.getElementById("resumo").innerHTML = `
        <h3>${mesSelecionado}</h3>
        <p>Total Recebido: ${formatar(totalRecebido)}</p>
        <p>Total Dízimo: ${formatar(totalDizimo)}</p>
        <p>Total Oferta: ${formatar(totalOferta)}</p>
        <p>Pensão Mensal: ${formatar(dados.pensaoMensal)}</p>
        <p>Pensão Paga: ${formatar(totalPensaoPaga)}</p>
        <p>Pensão Restante: ${formatar(pensaoRestante)}</p>
        <p>Status: ${statusPensao}</p>
        <h3>Saldo Atual: ${formatar(saldo)}</h3>
    `;

    let lista = document.getElementById("historico");
    lista.innerHTML = "";

    dados.recebimentos.forEach(r => {
        const item = document.createElement("li");
        item.innerHTML = `
            <strong>${r.data}</strong><br>
            Recebeu: ${formatar(r.valor)} |
            Dízimo: ${formatar(r.dizimo)} |
            Oferta: ${formatar(r.oferta)}
        `;
        lista.appendChild(item);
    });
}

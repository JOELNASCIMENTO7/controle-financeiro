let dados = JSON.parse(localStorage.getItem("financeiro")) || {
    mes: "",
    pensaoMensal: 500,
    recebimentos: [],
    pagamentosPensao: []
};

function salvar() {
    localStorage.setItem("financeiro", JSON.stringify(dados));
}

function definirMes() {
    dados.mes = document.getElementById("mes").value;
    salvar();
    atualizarResumo();
}

function definirPensao() {
    dados.pensaoMensal = parseFloat(document.getElementById("pensaoMensal").value) || 0;
    salvar();
    atualizarResumo();
}

function adicionarRecebimento() {
    const data = document.getElementById("dataRecebimento").value;
    const valor = parseFloat(document.getElementById("valorRecebido").value);

    if (!data || !valor) return;

    const dizimo = valor * 0.10;
    const oferta = valor * 0.05;

    dados.recebimentos.push({ data, valor, dizimo, oferta });
    salvar();
    atualizarResumo();
}

function pagarPensao() {
    const valor = parseFloat(document.getElementById("valorPensaoPago").value);
    if (!valor) return;

    dados.pagamentosPensao.push(valor);
    salvar();
    atualizarResumo();
}

function atualizarResumo() {
    let totalRecebido = 0;
    let totalDizimo = 0;
    let totalOferta = 0;

    dados.recebimentos.forEach(r => {
        totalRecebido += r.valor;
        totalDizimo += r.dizimo;
        totalOferta += r.oferta;
    });

    let totalPensaoPaga = dados.pagamentosPensao.reduce((a, b) => a + b, 0);
    let pensaoFaltando = dados.pensaoMensal - totalPensaoPaga;

    let saldo = totalRecebido - (totalDizimo + totalOferta + totalPensaoPaga);

    document.getElementById("resumo").innerHTML = `
        <h3>Mês: ${dados.mes}</h3>
        <p>Total Recebido: R$ ${totalRecebido.toFixed(2)}</p>
        <p>Total Dízimo: R$ ${totalDizimo.toFixed(2)}</p>
        <p>Total Oferta: R$ ${totalOferta.toFixed(2)}</p>
        <p>Pensão Mensal: R$ ${dados.pensaoMensal.toFixed(2)}</p>
        <p>Pensão Paga: R$ ${totalPensaoPaga.toFixed(2)}</p>
        <p>Pensão Restante: R$ ${pensaoFaltando.toFixed(2)}</p>
        <h3>Saldo Atual: R$ ${saldo.toFixed(2)}</h3>
    `;

    let lista = document.getElementById("historico");
    lista.innerHTML = "";

    dados.recebimentos.forEach(r => {
        const item = document.createElement("li");
        item.innerHTML = `
            ${r.data} - Recebeu: R$ ${r.valor.toFixed(2)} 
            | Dízimo: R$ ${r.dizimo.toFixed(2)} 
            | Oferta: R$ ${r.oferta.toFixed(2)}
        `;
        lista.appendChild(item);
    });
}

atualizarResumo();

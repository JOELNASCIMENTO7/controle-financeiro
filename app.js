const meses = [
  "Janeiro","Fevereiro","Março","Abril",
  "Maio","Junho","Julho","Agosto",
  "Setembro","Outubro","Novembro","Dezembro"
];

let dados = JSON.parse(localStorage.getItem("financeiro")) || {};

function salvar() {
  localStorage.setItem("financeiro", JSON.stringify(dados));
}

function criarTela() {
  const container = document.getElementById("meses");
  container.innerHTML = "";

  meses.forEach(mes => {

    if (!dados[mes]) {
      dados[mes] = { salario: 0, despesas: [] };
    }

    const hoje = new Date();

    let total = 0;
    let pago = 0;

    let despesasHTML = "";

    dados[mes].despesas.forEach((d, index) => {

      total += d.valor;
      if (d.pago) pago += d.valor;

      const vencimento = new Date(d.vencimento);
      let classe = "pendente";

      if (d.pago) {
        classe = "pago";
      } else if (vencimento < hoje) {
        classe = "atrasado";
      }

      despesasHTML += `
        <div class="${classe}" style="padding:8px;margin:5px 0;border-radius:8px;">
          <strong>${d.descricao}</strong><br>
          Valor: R$ ${d.valor} <br>
          Vence: ${d.vencimento} <br>
          Status: ${d.pago ? "Pago" : "Pendente"}<br>
          <button onclick="togglePago('${mes}', ${index})">
            ${d.pago ? "Desmarcar" : "Marcar como Pago"}
          </button>
          <button onclick="excluir('${mes}', ${index})">Excluir</button>
        </div>
      `;
    });

    const pendente = total - pago;
    const sobra = dados[mes].salario - total;
    const percentual = dados[mes].salario > 0
      ? (total / dados[mes].salario) * 100
      : 0;

    container.innerHTML += `
      <div class="card">
        <h2>${mes}</h2>
        <p>Salário: R$ ${dados[mes].salario}</p>
        <p>Total: R$ ${total}</p>
        <p>Pago: R$ ${pago}</p>
        <p>Pendente: R$ ${pendente}</p>
        <p>Sobra: R$ ${sobra}</p>

        <div class="barra">
          <div class="progresso" style="width:${percentual}%"></div>
        </div>
        <p>${percentual.toFixed(1)}% do salário comprometido</p>

        <button onclick="definirSalario('${mes}')">Definir Salário</button>
        <button onclick="adicionarDespesa('${mes}')">Adicionar Despesa</button>

        ${despesasHTML}
      </div>
    `;
  });

  salvar();
}

function definirSalario(mes) {
  const salario = prompt("Digite o salário:", dados[mes].salario);
  if (salario !== null) {
    dados[mes].salario = Number(salario);
    criarTela();
  }
}

function adicionarDespesa(mes) {
  const descricao = prompt("Descrição:");
  const valor = prompt("Valor:");
  const vencimento = prompt("Data de vencimento (AAAA-MM-DD):");

  if (descricao && valor && vencimento) {
    dados[mes].despesas.push({
      descricao,
      valor: Number(valor),
      vencimento,
      pago: false
    });
    criarTela();
  }
}

function togglePago(mes, index) {
  dados[mes].despesas[index].pago =
    !dados[mes].despesas[index].pago;
  criarTela();
}

function excluir(mes, index) {
  dados[mes].despesas.splice(index, 1);
  criarTela();
}

criarTela();

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

    const total = dados[mes].despesas.reduce((acc, d) => acc + d.valor, 0);
    const sobra = dados[mes].salario - total;

    container.innerHTML += `
      <div class="card">
        <h2>${mes}</h2>
        <p>Salário: R$ ${dados[mes].salario}</p>
        <p>Total gasto: R$ ${total}</p>
        <p>Sobra: R$ ${sobra}</p>
        <button onclick="editarMes('${mes}')">Abrir</button>
      </div>
    `;
  });

  salvar();
}

function editarMes(mes) {
  const salario = prompt("Digite o salário:", dados[mes].salario);
  dados[mes].salario = Number(salario);

  const descricao = prompt("Descrição da despesa:");
  const valor = prompt("Valor:");

  if (descricao && valor) {
    dados[mes].despesas.push({ descricao, valor: Number(valor) });
  }

  salvar();
  criarTela();
}

criarTela();

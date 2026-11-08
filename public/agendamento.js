const form = document.getElementById("formAgendamento");
const selectCliente = document.getElementById("cliente");
const lista = document.getElementById("listaAgendamentos");

async function carregarClientes() {
    const resposta = await fetch("/api/clientes");
    const clientes = await resposta.json();

    clientes.forEach(cliente => {
        const opcao = document.createElement("option");
        opcao.value = cliente.id;
        opcao.textContent = cliente.nome;
        selectCliente.appendChild(opcao);
    });
}

async function carregarAgenda() {
    const resposta = await fetch("/api/agendamentos");
    const agendamentos = await resposta.json();

    lista.innerHTML = "";

    agendamentos.forEach(item => {
        const linha = document.createElement("tr");

        [
            item.cliente,
            item.profissional,
            item.servico,
            item.data,
            item.horario
        ].forEach(valor => {
            const coluna = document.createElement("td");
            coluna.textContent = valor;
            linha.appendChild(coluna);
        });

        lista.appendChild(linha);
    });
}

form.addEventListener("submit", async (evento) => {
    evento.preventDefault();

    const dados = {
        cliente_id: Number(selectCliente.value),
        profissional: document.getElementById("profissional").value,
        servico: document.getElementById("servico").value,
        data: document.getElementById("data").value,
        horario: document.getElementById("horario").value
    };

    const resposta = await fetch("/api/agendamentos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dados)
    });

    const resultado = await resposta.json();
    alert(resultado.mensagem);

    if (resposta.ok) {
        form.reset();
        await carregarAgenda();
    }
});

carregarClientes();
carregarAgenda();
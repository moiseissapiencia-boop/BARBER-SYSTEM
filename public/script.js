const formulario = document.getElementById("formCliente");
const lista = document.getElementById("listaClientes");

async function carregarClientes() {
    try {
        const resposta = await fetch("/api/clientes");

        if (!resposta.ok) {
            throw new Error("Erro ao consultar clientes.");
        }

        const clientes = await resposta.json();

        lista.innerHTML = "";

        clientes.forEach(cliente => {
            const linha = document.createElement("tr");

            [cliente.nome, cliente.telefone, cliente.email || "-"]
                .forEach(valor => {
                    const coluna = document.createElement("td");
                    coluna.textContent = valor;
                    linha.appendChild(coluna);
                });

            lista.appendChild(linha);
        });
    } catch (erro) {
        alert("Não foi possível carregar os clientes.");
        console.error(erro);
    }
}

formulario.addEventListener("submit", async (evento) => {
    evento.preventDefault();

    const cliente = {
        nome: document.getElementById("nome").value,
        telefone: document.getElementById("telefone").value,
        email: document.getElementById("email").value
    };

    try {
        const resposta = await fetch("/api/clientes", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(cliente)
        });

        const resultado = await resposta.json();

        if (!resposta.ok) {
            throw new Error(resultado.mensagem);
        }

        alert("Cliente cadastrado com sucesso!");

        formulario.reset();
        await carregarClientes();
    } catch (erro) {
        alert(erro.message);
    }
});

carregarClientes();
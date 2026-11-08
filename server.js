const express = require("express");
const db = require("./database/db");
const app = express();
app.use(express.json());
const PORT = 3000;

app.use(express.static("public"));
// CADASTRAR CLIENTE
app.post("/api/clientes", (req, res) => {
    const { nome, telefone, email } = req.body;

    if (
        typeof nome !== "string" ||
        !nome.trim() ||
        typeof telefone !== "string" ||
        !telefone.trim()
    ) {
        return res.status(400).json({
            mensagem: "Nome e telefone são obrigatórios."
        });
    }

    if (email != null && typeof email !== "string") {
        return res.status(400).json({
            mensagem: "E-mail inválido."
        });
    }

    try {
        const comando = db.prepare(`
            INSERT INTO clientes (nome, telefone, email)
            VALUES (?, ?, ?)
        `);

        const resultado = comando.run(
            nome.trim(),
            telefone.trim(),
            email?.trim() || null
        );

        res.status(201).json({
            mensagem: "Cliente cadastrado com sucesso!",
            id: resultado.lastInsertRowid
        });
    } catch (erro) {
        console.error(erro);

        res.status(500).json({
            mensagem: "Erro ao cadastrar cliente."
        });
    }
});

// CONSULTAR CLIENTES
app.get("/api/clientes", (req, res) => {
    try {
        const clientes = db.prepare(
            "SELECT * FROM clientes ORDER BY id DESC"
        ).all();

        res.json(clientes);
    } catch (erro) {
        console.error(erro);

        res.status(500).json({
            mensagem: "Erro ao consultar clientes."
        });
    }
});// CADASTRAR AGENDAMENTO
app.post("/api/agendamentos", (req, res) => {
    const { cliente_id, profissional, servico, data, horario } = req.body;

    if (!Number.isInteger(cliente_id) || cliente_id <= 0 ||
        !profissional?.trim() || !servico?.trim() ||
        !data || !horario) {
        return res.status(400).json({
            mensagem: "Preencha todos os campos obrigatórios."
        });
    }

    try {
        const comando = db.prepare(`
            INSERT INTO agendamentos
            (cliente_id, profissional, servico, data, horario)
            VALUES (?, ?, ?, ?, ?)
        `);

        const resultado = comando.run(
            cliente_id,
            profissional.trim(),
            servico.trim(),
            data,
            horario
        );

        res.status(201).json({
            mensagem: "Agendamento realizado com sucesso!",
            id: resultado.lastInsertRowid
        });
    } catch (erro) {
        if (erro.code === "SQLITE_CONSTRAINT_UNIQUE") {
            return res.status(409).json({
                mensagem: "Este profissional já possui agendamento nesse horário."
            });
        }

        if (erro.code === "SQLITE_CONSTRAINT_FOREIGNKEY") {
            return res.status(400).json({
                mensagem: "Cliente não encontrado."
            });
        }

        console.error(erro);
        res.status(500).json({
            mensagem: "Erro ao realizar agendamento."
        });
    }
});

// CONSULTAR AGENDAMENTOS
app.get("/api/agendamentos", (req, res) => {
    try {
        const agendamentos = db.prepare(`
            SELECT a.id, c.nome AS cliente,
                   a.profissional, a.servico,
                   a.data, a.horario
            FROM agendamentos a
            JOIN clientes c ON c.id = a.cliente_id
            ORDER BY a.data, a.horario
        `).all();

        res.json(agendamentos);
    } catch (erro) {
        console.error(erro);
        res.status(500).json({
            mensagem: "Erro ao consultar agendamentos."
        });
    }
});
app.listen(PORT, () => {
    console.log("Servidor iniciado com sucesso!");
    console.log(`Acesse: http://localhost:${PORT}`);
});
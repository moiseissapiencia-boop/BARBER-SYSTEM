const Database = require("better-sqlite3");
const path = require("path");

const caminhoBanco = path.join(__dirname, "barber.db");

const db = new Database(caminhoBanco);

db.pragma("foreign_keys = ON");

db.exec(`
    CREATE TABLE IF NOT EXISTS clientes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nome TEXT NOT NULL,
        telefone TEXT NOT NULL,
        email TEXT
    );

    CREATE TABLE IF NOT EXISTS agendamentos (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        cliente_id INTEGER NOT NULL,
        profissional TEXT NOT NULL,
        servico TEXT NOT NULL,
        data TEXT NOT NULL,
        horario TEXT NOT NULL,
        FOREIGN KEY (cliente_id) REFERENCES clientes(id),
        UNIQUE(profissional, data, horario)
    );
`);

module.exports = db;
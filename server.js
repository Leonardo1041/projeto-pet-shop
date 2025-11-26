
const Express = require('express');
const app = Express();
const path = require('path');
const connection = require("./database/connection");
const bodyParser = require('body-parser');
const session = require('express-session');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./swagger-config');
const bcrypt = require('bcryptjs'); 
require('./openapi-docs');
const porta = process.env.PORT || 4000;

app.set("view engine", "ejs");
app.use(Express.static("public")); 
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Log global
app.use((req, res, next) => {
    console.log(`[REQUEST] ${req.method} ${req.url}`);
    next();
});

// ===== API ROUTES (Prioridade Alta) =====
// Importação
const clientesApi = require("./rotas/clientes");
const produtosApi = require("./rotas/produtos");

// Montagem
app.use("/api/clientes", clientesApi);
app.use("/api/produtos", produtosApi);

// Documentação
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Sessão
app.use(session({
    secret: 'chave_secreta_dev',
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false }
}));

// Setup de Usuários
app.get('/criar-usuarios', async (req, res) => {
    try {
        const salt = bcrypt.genSaltSync(10);
        const hash = bcrypt.hashSync('123456', salt);

        // Verifica/Cria coluna is_admin (Postgres/MySQL safe)
        try {
            await connection.query('ALTER TABLE clientes ADD COLUMN is_admin BOOLEAN DEFAULT FALSE');
        } catch (e) { /* Coluna ja existe */ }

        // Helper para inserir se nao existir
        const ensureUser = async (nome, email, isAdmin) => {
            const check = await connection.query('SELECT * FROM clientes WHERE email = $1', [email])
                .catch(() => connection.query('SELECT * FROM clientes WHERE email = ?', [email])); // MySQL fallback
            
            const rows = check.rows || (Array.isArray(check) ? check : []);
            if (rows.length === 0) {
                 await connection.query(
                    'INSERT INTO clientes (nome, email, telefone, senha, is_admin) VALUES ($1, $2, $3, $4, $5)', 
                    [nome, email, '00000000', hash, isAdmin]
                ).catch(() => connection.query(
                    'INSERT INTO clientes (nome, email, telefone, senha, is_admin) VALUES (?, ?, ?, ?, ?)', 
                    [nome, email, '00000000', hash, isAdmin]
                ));
            }
        };

        await ensureUser('Administrador', 'admin@loja.com', true);
        await ensureUser('Cliente Teste', 'cliente@loja.com', false);

        res.send('<h1>Usuários Criados/Verificados</h1><a href="/">Voltar</a>');
    } catch (err) {
        res.status(500).send("Erro: " + err.message);
    }
});

// Front-end React (Root)
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Rotas MVC Legadas (Fallback)
try {
    const lojaApi = require("./rotas/loja");
    const adminApi = require("./rotas/admin");
    app.use("/", lojaApi);
    app.use("/admin", adminApi);
} catch (e) {
    console.warn("Rotas legadas não carregadas totalmente.");
}

// Global 404 Handler - Capture everything that wasn't handled
app.use((req, res) => {
    if (req.url.startsWith('/api')) {
        return res.status(404).json({ error: "Endpoint não encontrado" });
    }
    res.status(404).send("Página não encontrada (404)");
});

app.listen(porta, ()=> {
    console.log("Servidor rodando na porta: " + porta);
});
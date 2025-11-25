const Express = require('express');
const app = Express();
const path = require('path');
const connection = require("./database/connection");
//const database = require("./database/database");
const homeController = require("./home/homeController");
const bodyParser = require('body-parser');
const session = require('express-session');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./swagger-config');
require('./openapi-docs'); // Importa as documentações das rotas
const porta = process.env.PORT || 4000;

// engine vai ser ejs
app.set("view engine", "ejs");

// pasta estatica de arquivos
app.use(Express.static("public")); 
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// ===== DOCUMENTAÇÃO SWAGGER =====
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Sessão básica em memória (não usar em produção)
app.use(session({
    secret: 'uma_chave_secreta_troque_em_producao',
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false }
}));

// Rota Principal: Serve o Front-end React (index.html)
// Colocado ANTES das outras rotas para ter prioridade na visualização
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

const rotasApi = require("./rotas/clientes");

app.use("/", homeController);
app.use("/api", rotasApi);
const lojaApi = require("./rotas/loja");
app.use("/", lojaApi);
// Rotas do painel admin
const adminApi = require("./rotas/admin");
app.use("/admin", adminApi);

app.listen(porta, ()=> {

    console.log("Servidor rodando na porta: " + porta);

});
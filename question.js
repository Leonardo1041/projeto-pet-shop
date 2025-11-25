var mysql = require("mysql2");
var connection = require("../database/connection");

connection.connect(function(err) {
    // criando tabelas de perguntas e respostas
   
    if (err) throw err;
    console.log("Connected!");
    var sql = "create table if not exists perguntas (id int primary key auto_increment, pergunta longtext );";
    connection.query(sql, function(err,result) {
         if (err) throw err;
         console.log("Tabela: Perguntas OK");
    })
})

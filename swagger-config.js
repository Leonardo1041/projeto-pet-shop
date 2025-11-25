const swaggerJsDoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API Loja - Documentação',
      version: '1.0.0',
      description: 'Documentação da API de gerenciamento de produtos, clientes e admin',
      contact: {
        name: 'Suporte',
        email: 'suporte@loja.com'
      }
    },
    servers: [
      {
        url: 'http://localhost:4000',
        description: 'Servidor de desenvolvimento'
      }
    ],
    components: {
      schemas: {
        Produto: {
          type: 'object',
          required: ['nome', 'tipo', 'preco'],
          properties: {
            id: {
              type: 'integer',
              description: 'ID único do produto',
              example: 1
            },
            nome: {
              type: 'string',
              description: 'Nome do produto',
              example: 'Ração Premium'
            },
            tipo: {
              type: 'string',
              description: 'Tipo/categoria do produto',
              example: 'Alimentação'
            },
            preco: {
              type: 'number',
              format: 'float',
              description: 'Preço do produto',
              example: 49.90
            },
            descricao: {
              type: 'string',
              description: 'Descrição detalhada do produto',
              example: 'Ração premium para cães adultos'
            }
          }
        },
        Cliente: {
          type: 'object',
          required: ['nome', 'email', 'telefone', 'senha'],
          properties: {
            id: {
              type: 'integer',
              description: 'ID único do cliente',
              example: 1
            },
            nome: {
              type: 'string',
              description: 'Nome completo do cliente',
              example: 'João Silva'
            },
            email: {
              type: 'string',
              format: 'email',
              description: 'Email do cliente',
              example: 'joao@example.com'
            },
            telefone: {
              type: 'string',
              description: 'Telefone do cliente',
              example: '11999999999'
            },
            senha: {
              type: 'string',
              format: 'password',
              description: 'Senha do cliente',
              example: 'senha123'
            }
          }
        },
        ClienteSaida: {
          type: 'object',
          properties: {
            id: {
              type: 'integer'
            },
            nome: {
              type: 'string'
            },
            email: {
              type: 'string'
            },
            telefone: {
              type: 'string'
            }
          }
        },
        Erro: {
          type: 'object',
          properties: {
            erro: {
              type: 'string',
              description: 'Mensagem de erro'
            }
          }
        }
      }
    }
  },
  apis: []
};

const specs = swaggerJsDoc(options);
module.exports = specs;

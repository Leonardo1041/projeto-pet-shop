#!/bin/bash

# Script para inicializar o banco de dados
# Execute com: bash setup-db.sh

echo "🐾 Inicializando banco de dados para Loja Pet Shop..."
echo ""

# Cores para terminal
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Verificar se PostgreSQL está rodando
echo -e "${YELLOW}Verificando PostgreSQL...${NC}"
if ! command -v psql &> /dev/null; then
    echo -e "${RED}❌ PostgreSQL não encontrado. Instale-o primeiro.${NC}"
    exit 1
fi

echo -e "${GREEN}✓ PostgreSQL encontrado${NC}"
echo ""

# Executar o schema
echo -e "${YELLOW}Criando tabela e inserindo dados de exemplo...${NC}"
psql -U leonardo -d ads05 -f database/schema.sql

if [ $? -eq 0 ]; then
    echo ""
    echo -e "${GREEN}✅ Banco de dados inicializado com sucesso!${NC}"
    echo ""
    echo "📊 Dados inseridos:"
    psql -U leonardo -d ads05 -c "SELECT COUNT(*) as total_produtos FROM produtos;"
else
    echo -e "${RED}❌ Erro ao inicializar banco de dados${NC}"
    exit 1
fi

echo ""
echo -e "${YELLOW}Próximos passos:${NC}"
echo "1. Execute: node index.js"
echo "2. Acesse: http://localhost:4000/loja"
echo ""
echo -e "${GREEN}Pronto para usar! 🚀${NC}"

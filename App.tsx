
import React, { useState } from 'react';

// Cores baseadas no CONFIG_VISUAL.js
const COLORS = {
  primary: '#667eea',
  secondary: '#764ba2',
  white: '#ffffff',
  text: '#333333',
  background: '#f5f5f5'
};

// Dados simulados para visualização imediata
const MOCK_PRODUTOS = [
  { id: 1, nome: "Ração Premium", tipo: "Alimentação", preco: 149.90, descricao: "Ração de alta qualidade para cães adultos." },
  { id: 2, nome: "Brinquedo Mordedor", tipo: "Brinquedo", preco: 29.90, descricao: "Resistente e divertido." },
  { id: 3, nome: "Cama Confort", tipo: "Acessório", preco: 89.90, descricao: "Conforto total para seu pet." },
  { id: 4, nome: "Coleira Ajustável", tipo: "Passeio", preco: 45.00, descricao: "Segurança e estilo." },
];

const MOCK_STATS = {
  produtos: 12,
  clientes: 45,
  vendas: 8
};

export default function App() {
  const [view, setView] = useState('loja'); // 'loja' | 'admin' | 'login'

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Header / Navbar */}
      <header style={{
        background: `linear-gradient(135deg, ${COLORS.primary} 0%, ${COLORS.secondary} 100%)`,
        padding: '1rem 2rem',
        color: 'white',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <h1 style={{ margin: 0, fontSize: '1.5rem' }}>🐾 PetLoja</h1>
        <nav>
          <button 
            onClick={() => setView('loja')}
            style={{ ...navButtonStyle, opacity: view === 'loja' ? 1 : 0.7 }}
          >
            Loja
          </button>
          <button 
            onClick={() => setView('admin')}
            style={{ ...navButtonStyle, opacity: view === 'admin' ? 1 : 0.7 }}
          >
            Admin
          </button>
        </nav>
      </header>

      {/* Conteúdo Principal */}
      <main style={{ flex: 1, padding: '2rem', maxWidth: '1200px', margin: '0 auto', width: '100%' }}>
        
        {view === 'loja' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h2 style={{ color: COLORS.secondary }}>Produtos Disponíveis</h2>
              <button style={primaryButtonStyle}>+ Filtros</button>
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '20px' }}>
              {MOCK_PRODUTOS.map(prod => (
                <div key={prod.id} style={cardStyle}>
                  <div style={{ height: '150px', background: '#eee', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '10px' }}>
                    <span style={{ fontSize: '3rem' }}>🐶</span>
                  </div>
                  <h3 style={{ margin: '10px 0', fontSize: '1.1rem' }}>{prod.nome}</h3>
                  <p style={{ color: '#666', fontSize: '0.9rem' }}>{prod.tipo}</p>
                  <p style={{ color: COLORS.primary, fontWeight: 'bold', fontSize: '1.2rem', margin: '10px 0' }}>
                    R$ {prod.preco.toFixed(2)}
                  </p>
                  <button style={{ width: '100%', ...primaryButtonStyle }}>Adicionar ao Carrinho</button>
                </div>
              ))}
            </div>
          </div>
        )}

        {view === 'admin' && (
          <div>
             <h2 style={{ color: COLORS.secondary, marginBottom: '20px' }}>Painel Administrativo</h2>
             
             {/* Dashboard Cards */}
             <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '40px' }}>
                <div style={statCardStyle}>
                  <h3>Total Produtos</h3>
                  <p style={statNumberStyle}>{MOCK_STATS.produtos}</p>
                </div>
                <div style={statCardStyle}>
                  <h3>Total Clientes</h3>
                  <p style={statNumberStyle}>{MOCK_STATS.clientes}</p>
                </div>
                <div style={statCardStyle}>
                  <h3>Vendas Hoje</h3>
                  <p style={statNumberStyle}>{MOCK_STATS.vendas}</p>
                </div>
             </div>

             <h3 style={{ color: '#555' }}>Ações Rápidas</h3>
             <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                <button style={secondaryButtonStyle}>Gerenciar Produtos</button>
                <button style={secondaryButtonStyle}>Gerenciar Clientes</button>
                <button style={secondaryButtonStyle}>Relatórios</button>
             </div>
          </div>
        )}

      </main>

      {/* Footer */}
      <footer style={{ textAlign: 'center', padding: '20px', background: '#333', color: '#fff', marginTop: 'auto' }}>
        <p>&copy; 2025 PetLoja. Todos os direitos reservados.</p>
      </footer>
    </div>
  );
}

// Estilos em Objeto
const navButtonStyle = {
  background: 'transparent',
  border: 'none',
  color: 'white',
  fontSize: '1rem',
  cursor: 'pointer',
  marginLeft: '15px',
  fontWeight: 'bold' as 'bold',
  padding: '5px 10px',
  borderBottom: '2px solid transparent'
};

const cardStyle = {
  background: 'white',
  padding: '20px',
  borderRadius: '10px',
  boxShadow: '0 4px 6px rgba(0,0,0,0.05)',
  transition: 'transform 0.2s',
  display: 'flex',
  flexDirection: 'column' as 'column'
};

const primaryButtonStyle = {
  background: COLORS.primary,
  color: 'white',
  border: 'none',
  padding: '10px 15px',
  borderRadius: '5px',
  cursor: 'pointer',
  fontWeight: 'bold' as 'bold',
  boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
};

const secondaryButtonStyle = {
  background: COLORS.secondary,
  color: 'white',
  border: 'none',
  padding: '10px 15px',
  borderRadius: '5px',
  cursor: 'pointer',
  fontWeight: 'bold' as 'bold'
};

const statCardStyle = {
  background: 'white',
  padding: '20px',
  borderRadius: '12px',
  boxShadow: '0 4px 15px rgba(0,0,0,0.05)',
  textAlign: 'center' as 'center',
  borderTop: `4px solid ${COLORS.primary}`
};

const statNumberStyle = {
  fontSize: '2.5rem',
  fontWeight: 'bold' as 'bold',
  color: COLORS.text,
  margin: '10px 0 0 0'
};

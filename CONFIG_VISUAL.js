// 🐾 ARQUIVO DE CONFIGURAÇÃO VISUAL DO CRUD
// Cores, fontes e estilos utilizados

const COLORS = {
  primary: '#667eea',      // Roxo principal
  secondary: '#764ba2',    // Violeta
  success: '#4CAF50',      // Verde
  danger: '#f44336',       // Vermelho
  warning: '#ff9800',      // Laranja
  info: '#2196F3',         // Azul
  light: '#f5f5f5',        // Cinza claro
  dark: '#333333',         // Cinza escuro
  white: '#ffffff',        // Branco
};

const GRADIENTS = {
  main: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  success: 'linear-gradient(135deg, #4CAF50 0%, #45a049 100%)',
  info: 'linear-gradient(135deg, #2196F3 0%, #0b7dda 100%)',
};

const SHADOWS = {
  small: '0 5px 15px rgba(0, 0, 0, 0.1)',
  medium: '0 10px 30px rgba(0, 0, 0, 0.3)',
  large: '0 15px 40px rgba(0, 0, 0, 0.4)',
};

const FONTS = {
  family: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
  sizes: {
    xs: '0.75em',
    sm: '0.9em',
    base: '1em',
    lg: '1.25em',
    xl: '1.5em',
    '2xl': '2em',
    '3xl': '2.5em',
  },
  weights: {
    normal: 400,
    medium: 500,
    bold: 700,
  },
};

const SPACING = {
  xs: '5px',
  sm: '10px',
  md: '15px',
  lg: '20px',
  xl: '30px',
};

const BORDER_RADIUS = {
  sm: '4px',
  md: '5px',
  lg: '8px',
  xl: '10px',
};

const BREAKPOINTS = {
  mobile: '600px',
  tablet: '768px',
  desktop: '1024px',
  wide: '1200px',
};

// Componentes Reutilizáveis
const BUTTONS = {
  primary: {
    background: COLORS.primary,
    color: COLORS.white,
    padding: '12px 25px',
    borderRadius: BORDER_RADIUS.md,
    fontSize: FONTS.sizes.base,
    fontWeight: FONTS.weights.bold,
    cursor: 'pointer',
    transition: 'all 0.3s',
  },
  success: {
    background: COLORS.success,
    color: COLORS.white,
    padding: '12px 25px',
    borderRadius: BORDER_RADIUS.md,
  },
  danger: {
    background: COLORS.danger,
    color: COLORS.white,
    padding: '8px 15px',
    borderRadius: BORDER_RADIUS.sm,
  },
  info: {
    background: COLORS.info,
    color: COLORS.white,
    padding: '8px 15px',
    borderRadius: BORDER_RADIUS.sm,
  },
};

const CARDS = {
  base: {
    background: COLORS.white,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
    boxShadow: SHADOWS.small,
    transition: 'transform 0.3s, box-shadow 0.3s',
  },
  hover: {
    transform: 'translateY(-5px)',
    boxShadow: SHADOWS.medium,
  },
};

const INPUTS = {
  base: {
    width: '100%',
    padding: '12px',
    border: '2px solid #ddd',
    borderRadius: BORDER_RADIUS.md,
    fontSize: FONTS.sizes.base,
    fontFamily: FONTS.family,
    transition: 'border-color 0.3s',
  },
  focus: {
    outline: 'none',
    borderColor: COLORS.primary,
    boxShadow: `0 0 5px rgba(102, 126, 234, 0.2)`,
  },
};

// Exportar para uso em componentes
export {
  COLORS,
  GRADIENTS,
  SHADOWS,
  FONTS,
  SPACING,
  BORDER_RADIUS,
  BREAKPOINTS,
  BUTTONS,
  CARDS,
  INPUTS,
};

// Exemplo de uso em HTML/CSS
/*
  body {
    font-family: FONTS.family;
    background: GRADIENTS.main;
  }

  .btn-primary {
    background: COLORS.primary;
    color: COLORS.white;
    padding: SPACING.lg;
    border-radius: BORDER_RADIUS.md;
  }

  .card {
    background: COLORS.white;
    box-shadow: SHADOWS.medium;
    border-radius: BORDER_RADIUS.lg;
    padding: SPACING.lg;
  }
*/

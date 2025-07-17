// Theme color palette for light and dark mode
export const getThemeColors = (theme) => ({
  background: theme === 'light' ? '#f4f6fb' : '#181f2a',
  card: theme === 'light' ? '#fff' : '#232b3b',
  text: theme === 'light' ? '#23272f' : '#e3e6ed',
  textSecondary: theme === 'light' ? '#5a6270' : '#a0aec0',
  border: theme === 'light' ? '#e5e7eb' : '#2d3748',
  primary: theme === 'light' ? '#2563eb' : '#60a5fa',
  success: theme === 'light' ? '#22c55e' : '#4ade80',
  warning: theme === 'light' ? '#f59e42' : '#fbbf24',
  danger: theme === 'light' ? '#ef4444' : '#f87171',
  info: theme === 'light' ? '#3b82f6' : '#60a5fa',
});

// Helper function to get comprehensive component styles
export const getComponentStyles = (theme) => {
  const colors = getThemeColors(theme);
  
  return {
    mainContainer: {
      background: colors.background,
      color: colors.text,
      minHeight: '100vh',
      width: '100%',
    },
    
    card: {
      background: colors.card,
      color: colors.text,
      border: `1px solid ${colors.border}`,
      boxShadow: theme === 'light' 
        ? '0 4px 24px rgba(37,99,235,0.08)' 
        : '0 4px 24px rgba(30,41,59,0.25)',
      borderRadius: '8px',
    },
    
    cardHeader: {
      background: colors.card,
      color: colors.text,
      borderBottom: `1px solid ${colors.border}`,
      padding: '1rem',
      borderRadius: '8px 8px 0 0',
    },
    
    cardBody: {
      background: colors.card,
      color: colors.text,
      padding: '1rem',
    },
    
    table: {
      background: colors.card,
      color: colors.text,
      border: `1px solid ${colors.border}`,
      width: '100%',
    },
    
    tableHeader: {
      background: theme === 'light' ? '#f8fafc' : '#1e293b',
      color: colors.text,
      borderBottom: `1px solid ${colors.border}`,
    },
    
    tableRow: {
      background: colors.card,
      color: colors.text,
      borderBottom: `1px solid ${colors.border}`,
    },
    
    input: {
      background: theme === 'light' ? '#fff' : '#232b3b',
      color: colors.text,
      border: `1px solid ${colors.border}`,
      borderRadius: '6px',
      padding: '0.5rem 0.75rem',
    },
    
    buttonPrimary: {
      background: colors.primary,
      color: '#fff',
      border: 'none',
      borderRadius: '6px',
      padding: '0.5rem 1rem',
      cursor: 'pointer',
    },
    
    buttonSecondary: {
      background: colors.border,
      color: colors.text,
      border: 'none',
      borderRadius: '6px',
      padding: '0.5rem 1rem',
      cursor: 'pointer',
    },
    
    alertSuccess: {
      background: colors.success,
      color: '#fff',
      border: 'none',
      borderRadius: '6px',
      padding: '0.75rem 1rem',
    },
    
    alertDanger: {
      background: colors.danger,
      color: '#fff',
      border: 'none',
      borderRadius: '6px',
      padding: '0.75rem 1rem',
    },
    
    alertInfo: {
      background: colors.info,
      color: '#fff',
      border: 'none',
      borderRadius: '6px',
      padding: '0.75rem 1rem',
    },
    
    // Override Bootstrap classes that might interfere
    overrideStyles: {
      '.card': {
        background: `${colors.card} !important`,
        color: `${colors.text} !important`,
        border: `1px solid ${colors.border} !important`,
      },
      '.table': {
        background: `${colors.card} !important`,
        color: `${colors.text} !important`,
      },
      '.form-control': {
        background: `${theme === 'light' ? '#fff' : '#232b3b'} !important`,
        color: `${colors.text} !important`,
        border: `1px solid ${colors.border} !important`,
      },
      '.btn-primary': {
        background: `${colors.primary} !important`,
        color: '#fff !important',
        border: 'none !important',
      },
      '.alert-primary': {
        background: `${colors.primary} !important`,
        color: '#fff !important',
        border: 'none !important',
      },
      '.alert-success': {
        background: `${colors.success} !important`,
        color: '#fff !important',
        border: 'none !important',
      },
      '.alert-danger': {
        background: `${colors.danger} !important`,
        color: '#fff !important',
        border: 'none !important',
      },
    }
  };
}; 
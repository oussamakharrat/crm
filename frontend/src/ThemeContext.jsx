import React, { createContext, useContext, useState, useEffect } from "react";

const ThemeContext = createContext();

export const AppSettingsContext = createContext();

export const AppSettingsProvider = ({ children }) => {
  const [settings, setSettings] = useState({});
  const [loading, setLoading] = useState(true);

  // Fetch settings from backend
  const fetchSettings = async () => {
    setLoading(true);
    try {
      const res = await fetch("/settings");
      const data = await res.json();
      const settingsObj = {};
      data.forEach(s => { settingsObj[s.key] = s.value; });
      setSettings(settingsObj);
    } catch {
      setSettings({});
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchSettings(); }, []);

  // Update a setting (e.g., after logo upload)
  const updateSetting = (key, value) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  return (
    <AppSettingsContext.Provider value={{ settings, loading, fetchSettings, updateSetting }}>
      {children}
    </AppSettingsContext.Provider>
  );
};

export const useAppSettings = () => useContext(AppSettingsContext);

export const ThemeProvider = ({ children }) => {
  // Set initial theme from localStorage or default to 'light'
  const [theme, setTheme] = useState(() => {
    const stored = localStorage.getItem('theme');
    return stored === 'dark' ? 'dark' : 'light';
  });

  // Apply theme and persist in localStorage and Phoenix config
  useEffect(() => {
    console.log("[ThemeContext] Current theme:", theme);
    localStorage.setItem('theme', theme);
    if (window.config && window.config.config) {
      window.config.config.phoenixTheme = theme;
    }
    document.documentElement.setAttribute('data-theme', theme);

    // Expanded Phoenix CSS variables for full theme switching
    const lightVars = {
      '--phoenix-body-bg': '#f5f7fa',
      '--phoenix-body-color': '#31374a',
      '--phoenix-emphasis-bg': '#fff',
      '--phoenix-emphasis-color': '#141824',
      '--phoenix-navbar-vertical-bg-color': '#fff',
      '--phoenix-navbar-top-bg-color': '#fff',
      '--phoenix-card-bg': '#fff',
      '--phoenix-card-color': '#31374a',
      '--phoenix-card-border-color': '#e3e6ed',
      '--phoenix-table-bg': '#fff',
      '--phoenix-table-color': '#31374a',
      '--phoenix-table-border-color': '#e3e6ed',
      '--phoenix-secondary-bg': '#e3e6ed',
      '--phoenix-secondary-color': '#3e465b',
      '--phoenix-tertiary-bg': '#cbd0dd',
      '--phoenix-tertiary-color': '#525b75',
      '--phoenix-link-color': '#3874ff',
      '--phoenix-link-hover-color': '#003cc7',
      '--phoenix-border-color': '#cbd0dd',
      '--phoenix-highlight-bg': '#fff3cd',
      '--phoenix-highlight-color': '#31374a',
    };
    const darkVars = {
      '--phoenix-body-bg': '#0f1419',
      '--phoenix-body-color': '#e8eaed',
      '--phoenix-emphasis-bg': '#1a1f2e',
      '--phoenix-emphasis-color': '#f8f9fa',
      '--phoenix-navbar-vertical-bg-color': '#1a1f2e',
      '--phoenix-navbar-top-bg-color': '#1a1f2e',
      '--phoenix-card-bg': '#1a1f2e',
      '--phoenix-card-color': '#e8eaed',
      '--phoenix-card-border-color': '#2d3748',
      '--phoenix-card-header-bg': '#2d3748',
      '--phoenix-card-header-color': '#f8f9fa',
      '--phoenix-table-bg': '#1a1f2e',
      '--phoenix-table-color': '#e8eaed',
      '--phoenix-table-border-color': '#2d3748',
      '--phoenix-secondary-bg': '#2d3748',
      '--phoenix-secondary-color': '#a0aec0',
      '--phoenix-tertiary-bg': '#2d3748',
      '--phoenix-tertiary-color': '#718096',
      '--phoenix-link-color': '#63b3ed',
      '--phoenix-link-hover-color': '#90cdf4',
      '--phoenix-border-color': '#2d3748',
      '--phoenix-highlight-bg': '#2d3748',
      '--phoenix-highlight-color': '#e8eaed',
      '--phoenix-primary': '#4299e1',
      '--phoenix-success': '#48bb78',
      '--phoenix-warning': '#ed8936',
      '--phoenix-danger': '#f56565',
      '--phoenix-info': '#38b2ac',
      '--phoenix-text-primary': '#f7fafc',
      '--phoenix-text-secondary': '#a0aec0',
      '--phoenix-text-muted': '#718096',
      '--phoenix-text-emphasis': '#ffffff',
      '--phoenix-bg-primary': '#1a1f2e',
      '--phoenix-bg-secondary': '#2d3748',
      '--phoenix-bg-tertiary': '#2d3748',
      '--phoenix-bg-elevated': '#4a5568',
      '--phoenix-bg-overlay': '#0f1419',
      '--phoenix-bg-gradient': 'linear-gradient(135deg, #1a1f2e 0%, #2d3748 100%)',
      '--phoenix-bg-card-gradient': 'linear-gradient(145deg, #1a1f2e 0%, #2d3748 100%)',
      '--phoenix-shadow-light': '0 4px 6px -1px rgba(0, 0, 0, 0.3), 0 2px 4px -1px rgba(0, 0, 0, 0.2)',
      '--phoenix-shadow-medium': '0 10px 15px -3px rgba(0, 0, 0, 0.4), 0 4px 6px -2px rgba(0, 0, 0, 0.3)',
      '--phoenix-shadow-heavy': '0 20px 25px -5px rgba(0, 0, 0, 0.5), 0 10px 10px -5px rgba(0, 0, 0, 0.4)',
      '--phoenix-glow-primary': '0 0 20px rgba(66, 153, 225, 0.3)',
      '--phoenix-glow-success': '0 0 20px rgba(72, 187, 120, 0.3)',
      '--phoenix-glow-warning': '0 0 20px rgba(237, 137, 54, 0.3)',
      '--phoenix-glow-danger': '0 0 20px rgba(245, 101, 101, 0.3)',
    };
    const vars = theme === 'dark' ? darkVars : lightVars;
    for (const [key, value] of Object.entries(vars)) {
      document.documentElement.style.setProperty(key, value);
    }
    // Debug: log the value after setting
    console.log('Set --phoenix-card-bg:', document.documentElement.style.getPropertyValue('--phoenix-card-bg'));

    // Add a resize event listener to re-apply theme variables
    const handleResize = () => {
      const vars = theme === 'dark' ? darkVars : lightVars;
      for (const [key, value] of Object.entries(vars)) {
        document.documentElement.style.setProperty(key, value);
      }
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => {
      const next = prev === 'dark' ? 'light' : 'dark';
      localStorage.setItem('theme', next);
      if (window.config && window.config.config) {
        window.config.config.phoenixTheme = next;
      }
      document.documentElement.setAttribute('data-theme', next);
      // window.location.reload(); // Remove this line to avoid page refresh
      return next;
    });
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export { ThemeContext }; 
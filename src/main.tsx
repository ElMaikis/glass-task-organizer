
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Script para inicializar o tema antes da renderização
const initializeTheme = () => {
  const savedTheme = localStorage.getItem('theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  
  // Define o tema inicial com base na preferência salva ou padrão do sistema
  const isDark = savedTheme ? savedTheme === 'dark' : prefersDark;
  
  // Aplica o tema ao elemento HTML
  document.documentElement.classList.toggle('dark', isDark);
  document.documentElement.classList.toggle('light', !isDark);
  document.documentElement.style.colorScheme = isDark ? 'dark' : 'light';
};

// Executa antes da renderização
initializeTheme();

createRoot(document.getElementById("root")!).render(<App />);


import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";

export function ThemeToggle() {
  const [isDark, setIsDark] = useState(true);

  // Inicializa o tema com base no localStorage ou padrão para dark
  useEffect(() => {
    // Primeiro, verifica se já existe uma preferência salva
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    // Usa o tema salvo, recorre à preferência do sistema ou define como dark
    const initialDark = savedTheme ? savedTheme === 'dark' : prefersDark;
    
    setIsDark(initialDark);
    applyTheme(initialDark);
    
    console.log('Theme initialized:', initialDark ? 'dark' : 'light');
  }, []);

  const toggleTheme = () => {
    const newIsDark = !isDark;
    setIsDark(newIsDark);
    applyTheme(newIsDark);
    
    // Salva a preferência
    localStorage.setItem('theme', newIsDark ? 'dark' : 'light');
    
    console.log('Theme toggled to:', newIsDark ? 'dark' : 'light');
  };
  
  const applyTheme = (dark: boolean) => {
    // Garantindo que estamos acessando diretamente o elemento HTML
    const html = document.documentElement;
    
    if (dark) {
      html.classList.add('dark');
      html.classList.remove('light');
    } else {
      html.classList.remove('dark');
      html.classList.add('light');
    }
    
    // Define explicitamente o esquema de cores
    html.style.colorScheme = dark ? 'dark' : 'light';
    
    // Força uma atualização visual completa
    document.body.style.opacity = '0.99';
    setTimeout(() => {
      document.body.style.opacity = '1';
    }, 10);
  };

  return (
    <Button 
      variant="ghost" 
      size="icon" 
      onClick={toggleTheme}
      className="rounded-full transition-all"
      aria-label={isDark ? "Mudar para tema claro" : "Mudar para tema escuro"}
    >
      {isDark ? (
        <Sun className="h-5 w-5 text-yellow-200" />
      ) : (
        <Moon className="h-5 w-5" />
      )}
      <span className="sr-only">Alternar tema</span>
    </Button>
  );
}

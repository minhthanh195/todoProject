import { useEffect, useState } from "react";
import { useLocalStorage } from "./useLocalStorage";
export default function useDarkMode() {

  const [isDark, setIsDark] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [theme, setTheme] = useLocalStorage('theme','light')
  useEffect(() => {
    
    // const dark = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

    if(theme === 'dark' || !theme && prefersDark) {
        document.documentElement.classList.add('dark');
        setIsDark(true);
    } else {
        document.documentElement.classList.remove('dark');
        setIsDark(false);
    }

    setIsReady(true);
  },[]);

  const toggleDark = () => {
    const html = document.documentElement;

    if(html.classList.contains('dark')){
        html.classList.remove('dark');
        setTheme('light')
        // localStorage.setItem('theme','light');
        setIsDark(false);
    } else {
        html.classList.add('dark');
        // localStorage.setItem('theme','dark');
        setTheme('dark')
        setIsDark(true);
    }
  }

  return { isDark, toggleDark, isReady};
}
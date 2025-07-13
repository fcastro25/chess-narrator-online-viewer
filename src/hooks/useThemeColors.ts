
import { useEffect } from "react";
import { useTheme } from "next-themes";

interface ThemeColors {
  background: string;
  foreground: string;
  muted: string;
  mutedForeground: string;
  border: string;
  card: string;
  primary: string;
  secondary: string;
}

export const useThemeColors = (boardStyle: string) => {
  const { theme } = useTheme();
  
  const getBoardThemeColors = (style: string, isDark: boolean): ThemeColors => {
    const baseColors = {
      classic: {
        light: { h: 25, s: 5, l: 95 },
        dark: { h: 25, s: 10, l: 35 }
      },
      modern: {
        light: { h: 210, s: 40, l: 96 },
        dark: { h: 215, s: 28, l: 35 }
      },
      wood: {
        light: { h: 55, s: 92, l: 95 },
        dark: { h: 30, s: 80, l: 25 }
      },
      green: {
        light: { h: 120, s: 100, l: 97 },
        dark: { h: 142, s: 71, l: 25 }
      },
      blue: {
        light: { h: 214, s: 100, l: 97 },
        dark: { h: 221, s: 83, l: 35 }
      },
      purple: {
        light: { h: 270, s: 100, l: 98 },
        dark: { h: 263, s: 70, l: 35 }
      }
    };

    const colorScheme = baseColors[style as keyof typeof baseColors] || baseColors.classic;
    const base = isDark ? colorScheme.dark : colorScheme.light;
    
    return {
      background: `${base.h} ${base.s}% ${isDark ? base.l : base.l}%`,
      foreground: `${base.h} ${base.s + 10}% ${isDark ? 95 : 10}%`,
      muted: `${base.h} ${base.s}% ${isDark ? Math.max(base.l - 8, 15) : Math.min(base.l - 5, 90)}%`,
      mutedForeground: `${base.h} ${Math.max(base.s - 10, 5)}% ${isDark ? 65 : 45}%`,
      border: `${base.h} ${base.s}% ${isDark ? Math.max(base.l - 5, 20) : Math.min(base.l - 8, 85)}%`,
      card: `${base.h} ${base.s}% ${isDark ? Math.max(base.l - 3, 18) : Math.min(base.l + 2, 98)}%`,
      primary: `${base.h} ${Math.min(base.s + 20, 80)}% ${isDark ? Math.min(base.l + 15, 50) : Math.max(base.l - 25, 25)}%`,
      secondary: `${base.h} ${base.s}% ${isDark ? Math.max(base.l - 10, 12) : Math.min(base.l - 3, 92)}%`
    };
  };

  useEffect(() => {
    const colors = getBoardThemeColors(boardStyle, theme === "dark");
    const root = document.documentElement;
    
    root.style.setProperty('--background', colors.background);
    root.style.setProperty('--foreground', colors.foreground);
    root.style.setProperty('--muted', colors.muted);
    root.style.setProperty('--muted-foreground', colors.mutedForeground);
    root.style.setProperty('--border', colors.border);
    root.style.setProperty('--card', colors.card);
    root.style.setProperty('--primary', colors.primary);
    root.style.setProperty('--secondary', colors.secondary);
  }, [boardStyle, theme]);
};

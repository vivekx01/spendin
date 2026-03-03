import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { ColorSchemeName, useColorScheme } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

type ThemeMode = "light" | "dark";

type ThemeColors = {
  background: string;
  card: string;
  header: string;
  text: string;
  textSecondary: string;
  border: string;
  accent: string;
  muted: string;
  tabBarBackground: string;
  income: string;
  expense: string;
};

export type AppTheme = {
  mode: ThemeMode;
  colors: ThemeColors;
};

type ThemeContextValue = {
  theme: AppTheme;
  toggleTheme: () => void;
};

const THEME_STORAGE_KEY = "@theme";

const lightTheme: AppTheme = {
  mode: "light",
  colors: {
    background: "#ffffff",
    card: "#ffffff",
    header: "#ffffff",
    text: "#111111",
    textSecondary: "#555555",
    border: "#e2e2e2",
    accent: "#1f6feb",
    muted: "#9ca3af",
    tabBarBackground: "#ffffff",
    income: "#16a34a",
    expense: "#dc2626",
  },
};

const darkTheme: AppTheme = {
  mode: "dark",
  colors: {
    background: "#000000",
    card: "#050505",
    header: "#000000",
    text: "#f9fafb",
    textSecondary: "#9ca3af",
    border: "#27272a",
    accent: "#60a5fa",
    muted: "#6b7280",
    tabBarBackground: "#000000",
    income: "#22c55e",
    expense: "#f97373",
  },
};

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const systemScheme: ColorSchemeName = useColorScheme();
  const [mode, setMode] = useState<ThemeMode>("light");

  useEffect(() => {
    const loadStoredTheme = async () => {
      try {
        const stored = await AsyncStorage.getItem(THEME_STORAGE_KEY);
        if (stored === "light" || stored === "dark") {
          setMode(stored);
        } else if (systemScheme === "dark") {
          setMode("dark");
        } else {
          setMode("light");
        }
      } catch {
        if (systemScheme === "dark") {
          setMode("dark");
        } else {
          setMode("light");
        }
      }
    };
    loadStoredTheme();
  }, [systemScheme]);

  const toggleTheme = () => {
    setMode((prev) => {
      const next: ThemeMode = prev === "light" ? "dark" : "light";
      AsyncStorage.setItem(THEME_STORAGE_KEY, next).catch(() => {});
      return next;
    });
  };

  const theme = useMemo<AppTheme>(() => {
    return mode === "dark" ? darkTheme : lightTheme;
  }, [mode]);

  const value = useMemo(
    () => ({
      theme,
      toggleTheme,
    }),
    [theme]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

export const useTheme = () => {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error("useTheme must be used within ThemeProvider");
  }
  return ctx;
};


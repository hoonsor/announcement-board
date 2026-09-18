"use client";

import { useCallback, useSyncExternalStore } from "react";

/**
 * 佈景主題偏好（淺色／深色／跟隨系統）。
 *
 * 儲存方式與 useLocalStorageJSON 相同，改用 useSyncExternalStore 訂閱
 * localStorage，避免「先渲染一次預設值、再於 effect 中改回實際值」的
 * 閃爍與雙重渲染問題。實際套用到 <html data-theme="..."> 的副作用則交由
 * ThemeToggle 元件的 useEffect 處理（DOM 副作用本來就該放在 effect 中）。
 */

export type ThemeMode = "light" | "dark" | "system";

export const THEME_STORAGE_KEY = "theme-preference";

function isThemeMode(value: string | null): value is ThemeMode {
  return value === "light" || value === "dark" || value === "system";
}

type Listener = () => void;

const listeners = new Set<Listener>();
let cache: string | null | undefined;

function getSnapshot(): string | null {
  if (typeof window === "undefined") return null;
  if (cache === undefined) {
    try {
      cache = window.localStorage.getItem(THEME_STORAGE_KEY);
    } catch {
      cache = null;
    }
  }
  return cache ?? null;
}

function getServerSnapshot(): string | null {
  return null;
}

function subscribe(listener: Listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function writeRaw(value: ThemeMode) {
  try {
    window.localStorage.setItem(THEME_STORAGE_KEY, value);
  } catch {
    // 忽略寫入失敗（例如無痕模式或容量已滿）
  }
  cache = value;
  listeners.forEach((listener) => listener());
}

/** 依偏好解析出實際套用的淺色／深色主題（"system" 需參照系統設定）。 */
export function resolveTheme(mode: ThemeMode): "light" | "dark" {
  if (mode === "system") {
    if (typeof window === "undefined") return "light";
    return window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  }
  return mode;
}

export function useThemeMode() {
  const raw = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const mode: ThemeMode = isThemeMode(raw) ? raw : "system";

  const setMode = useCallback((next: ThemeMode) => writeRaw(next), []);

  return [mode, setMode] as const;
}

"use client";

import { useCallback, useMemo, useSyncExternalStore } from "react";

/**
 * localStorage 為瀏覽器端專屬的外部資料來源，若在 useEffect 中直接呼叫
 * setState 讀取初始值，會產生「先渲染一次空狀態、再渲染一次實際狀態」的
 * 連鎖重繪，也是新版 react-hooks/set-state-in-effect 規則要避免的寫法。
 *
 * 這裡改用 React 官方針對「訂閱外部資料來源」設計的 useSyncExternalStore：
 * - getSnapshot 於用戶端讀取當前字串快照（並快取，避免每次渲染重新讀取）
 * - getServerSnapshot 於伺服器端一律回傳 null，避免 SSR 期間存取 window
 * - subscribe 讓同頁多個元件共用同一把 key 時，寫入後彼此即時同步
 */

type Listener = () => void;

const listenersByKey = new Map<string, Set<Listener>>();
const snapshotCache = new Map<string, string | null>();

function getSnapshot(key: string): string | null {
  if (typeof window === "undefined") return null;
  if (!snapshotCache.has(key)) {
    let value: string | null = null;
    try {
      value = window.localStorage.getItem(key);
    } catch {
      value = null;
    }
    snapshotCache.set(key, value);
  }
  return snapshotCache.get(key) ?? null;
}

function getServerSnapshot(): string | null {
  return null;
}

function subscribe(key: string, listener: Listener) {
  let set = listenersByKey.get(key);
  if (!set) {
    set = new Set();
    listenersByKey.set(key, set);
  }
  set.add(listener);
  return () => {
    set?.delete(listener);
  };
}

function writeRaw(key: string, value: string | null) {
  try {
    if (value === null) {
      window.localStorage.removeItem(key);
    } else {
      window.localStorage.setItem(key, value);
    }
  } catch {
    // 忽略寫入失敗（例如無痕模式或容量已滿）
  }
  snapshotCache.set(key, value);
  listenersByKey.get(key)?.forEach((listener) => listener());
}

export function useLocalStorageJSON<T extends Record<string, unknown>>(
  key: string,
  fallback: T
) {
  const raw = useSyncExternalStore(
    useCallback((listener) => subscribe(key, listener), [key]),
    () => getSnapshot(key),
    getServerSnapshot
  );

  const value = useMemo<T>(() => {
    if (!raw) return fallback;
    try {
      return { ...fallback, ...(JSON.parse(raw) as T) };
    } catch {
      return fallback;
    }
    // fallback is expected to be structurally stable per call site (a data-derived default)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [raw]);

  const setValue = useCallback(
    (next: T) => writeRaw(key, JSON.stringify(next)),
    [key]
  );

  const clear = useCallback(() => writeRaw(key, null), [key]);

  return [value, setValue, clear] as const;
}

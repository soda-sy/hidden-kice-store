import { useSyncExternalStore } from "react";
import { vi } from "vitest";

const BASE_URL = "http://localhost";
const DEFAULT_PATH = "/store";

let currentUrl = new URL(DEFAULT_PATH, BASE_URL);
let currentSearchParams = new URLSearchParams(currentUrl.search);
const listeners = new Set<() => void>();

function setUrl(href: string) {
  currentUrl = new URL(href, BASE_URL);
  currentSearchParams = new URLSearchParams(currentUrl.search);
  listeners.forEach((listener) => listener());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export const mockRouter = {
  push: vi.fn(setUrl),
  replace: vi.fn(setUrl),
  back: vi.fn(),
  forward: vi.fn(),
  refresh: vi.fn(),
  prefetch: vi.fn(),
};

export function setMockUrl(href: string) {
  setUrl(href);
}

export function getMockUrl() {
  return `${currentUrl.pathname}${currentUrl.search}`;
}

export function resetMockNavigation() {
  setUrl(DEFAULT_PATH);
  Object.values(mockRouter).forEach((mockFunction) => mockFunction.mockClear());
}

export function useRouter() {
  return mockRouter;
}

export function usePathname() {
  return useSyncExternalStore(subscribe, () => currentUrl.pathname);
}

export function useSearchParams() {
  return useSyncExternalStore(subscribe, () => currentSearchParams);
}

"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from "react";

export const TOAST_DURATION_MS = 2500;
export const TOAST_EXIT_MS = 200;
const MAX_VISIBLE_TOASTS = 3;

type ToastItem = {
  id: number;
  message: string;
  isLeaving: boolean;
};

type ToastContextValue = {
  showToast: (message: string) => void;
};

const ToastContext = createContext<ToastContextValue | null>(null);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const nextIdRef = useRef(0);
  const timersRef = useRef(new Set<ReturnType<typeof setTimeout>>());

  const schedule = useCallback((callback: () => void, delayMs: number) => {
    const timer = setTimeout(() => {
      timersRef.current.delete(timer);
      callback();
    }, delayMs);
    timersRef.current.add(timer);
  }, []);

  useEffect(() => {
    const timers = timersRef.current;
    return () => timers.forEach(clearTimeout);
  }, []);

  const dismissToast = useCallback(
    (id: number) => {
      setToasts((current) => current.map((toast) => (toast.id === id ? { ...toast, isLeaving: true } : toast)));
      schedule(() => setToasts((current) => current.filter((toast) => toast.id !== id)), TOAST_EXIT_MS);
    },
    [schedule],
  );

  const showToast = useCallback(
    (message: string) => {
      const id = nextIdRef.current++;
      setToasts((current) => [
        ...current.filter((toast) => toast.message !== message).slice(-(MAX_VISIBLE_TOASTS - 1)),
        { id, message, isLeaving: false },
      ]);
      schedule(() => dismissToast(id), TOAST_DURATION_MS);
    },
    [dismissToast, schedule],
  );

  const contextValue = useMemo(() => ({ showToast }), [showToast]);

  return (
    <ToastContext.Provider value={contextValue}>
      {children}
      <div
        role="status"
        aria-live="polite"
        className="pointer-events-none fixed inset-x-0 bottom-8 z-50 flex flex-col items-center gap-2 px-4"
      >
        {toasts.map(({ id, message, isLeaving }) => (
          <p
            key={id}
            className={`max-w-full rounded-full bg-gray-800/95 px-5 py-3 text-body-sm font-semibold text-white shadow-[0_8px_24px_rgba(0,0,0,0.18)] backdrop-blur ${
              isLeaving ? "motion-safe:animate-toast-out" : "motion-safe:animate-toast-in"
            }`}
          >
            {message}
          </p>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) throw new Error("useToast는 ToastProvider 안에서만 사용할 수 있습니다.");
  return context;
}

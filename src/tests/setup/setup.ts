import "@testing-library/jest-dom/vitest";
import { cleanup } from "@testing-library/react";
import { afterAll, afterEach, beforeAll, vi } from "vitest";
import { resetMockNavigation } from "@/tests/utils/mockNavigation";
import { resetProductRequests } from "@/tests/utils/supabaseHandlers";
import { server } from "./server";

vi.mock("next/navigation", () => import("@/tests/utils/mockNavigation"));

if (!window.matchMedia) {
  window.matchMedia = (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => false,
  });
}

if (!Element.prototype.scrollIntoView) {
  Element.prototype.scrollIntoView = () => {};
}

beforeAll(function startMockServer() {
  server.listen({ onUnhandledRequest: "error" });
});

afterEach(function resetTestState() {
  cleanup();
  server.resetHandlers();
  resetMockNavigation();
  resetProductRequests();
});

afterAll(function stopMockServer() {
  server.close();
});

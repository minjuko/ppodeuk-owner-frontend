import "@testing-library/jest-dom/vitest";
import React from "react";
import { cleanup } from "@testing-library/react";
import { afterEach, vi } from "vitest";

vi.mock("react-router-dom", async (importOriginal) => {
  const router = await importOriginal();

  return {
    ...router,
    MemoryRouter: ({ future, ...props }) =>
      React.createElement(router.MemoryRouter, {
        ...props,
        future: {
          v7_startTransition: true,
          v7_relativeSplatPath: true,
          ...future,
        },
      }),
  };
});

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
  localStorage.clear();
});

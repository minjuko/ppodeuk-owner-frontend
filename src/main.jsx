import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Provider } from "react-redux";
import store from "./store/store.js";
import { ToastProvider } from "./components/feedback/ToastProvider.jsx";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      throwOnError: true,
      retry: false,
    },
  },
});

const prepareDemo = async () => {
  if (!__DEMO_BUILD__) return;

  const { worker } = await import("../demoWorker.js");
  const timeout = new Promise((resolve) => {
    window.setTimeout(resolve, 2000);
  });

  await Promise.race([worker.start({ onUnhandledRequest: "bypass" }), timeout]);
};

prepareDemo()
  .catch((error) => {
    console.error("Demo API could not be initialized.", error);
  })
  .finally(() => {
    ReactDOM.createRoot(document.getElementById("root")).render(
      <React.StrictMode>
        <Provider store={store}>
          <QueryClientProvider client={queryClient}>
            <ToastProvider>
              <App />
            </ToastProvider>
          </QueryClientProvider>
        </Provider>
      </React.StrictMode>,
    );
  });

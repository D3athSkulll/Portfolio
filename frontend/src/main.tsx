import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "./theme";
import App from "./App";
import { dismissBoot } from "./boot";
import "./index.css";

const qc = new QueryClient({
  defaultOptions: { queries: { staleTime: 30_000, retry: 1 } },
});

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={qc}>
      <ThemeProvider>
        <App />
      </ThemeProvider>
    </QueryClientProvider>
  </StrictMode>,
);

// Layout dismisses the boot loader as soon as profile data arrives; this is the
// safety fallback in case that never happens.
setTimeout(dismissBoot, 6000);

import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, ".", "VITE_");
  return {
    plugins: [react()],
    server: {
      proxy: {
        ...(env.VITE_API_URL
          ? Object.fromEntries(
              ["/api", "/sexos"].map((path) => [
                path,
                {
                  target: env.VITE_API_URL,
                  changeOrigin: true,
                },
              ]),
            )
          : {}),
      },
    },
  };
});

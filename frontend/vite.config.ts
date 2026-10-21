import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import { createRequire } from "node:module";
import { networkInterfaces } from "node:os";

const require = createRequire(import.meta.url);
const qrcode = require("qrcode-terminal") as typeof import("qrcode-terminal");

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, ".", "VITE_");
  return {
    plugins: [
      react(),
      {
        name: "terminal-network-qr",
        configureServer(server) {
          server.httpServer?.once("listening", () => {
            const address = server.httpServer?.address();
            if (!address || typeof address === "string") return;

            const urls = new Set<string>();
            for (const interfaces of Object.values(networkInterfaces())) {
              for (const network of interfaces ?? []) {
                if (network.family !== "IPv4" || network.internal) continue;
                urls.add(new URL(server.config.base, `http://${network.address}:${address.port}`).toString());
              }
            }

            if (urls.size === 0) {
              urls.add(new URL(server.config.base, `http://localhost:${address.port}`).toString());
            }

            console.log("\nEscaneie o QR Code para abrir o frontend na rede:");
            for (const url of urls) {
              console.log(`\n${url}`);
              qrcode.generate(url, { small: true }, console.log);
            }
          });
        },
      },
    ],
    server: {
      host: "0.0.0.0",
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

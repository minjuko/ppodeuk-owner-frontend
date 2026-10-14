import { loadEnv } from "vite";
import { createHtmlPlugin } from "vite-plugin-html";
import react from "@vitejs/plugin-react-swc";

export default ({ mode }) => {
  const env = loadEnv(mode, ".");

  return {
    plugins: [
      react(),
      createHtmlPlugin({
        minify: true,
        inject: {
          data: {
            kakaomapApiKey: env.VITE_KAKAOMAP_API_KEY,
          },
        },
      }),
    ],
    test: {
      environment: "jsdom",
      globals: true,
      setupFiles: "./vitest.setup.js",
    },
  };
};

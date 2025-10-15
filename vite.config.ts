import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import path from "path";
import dts from "vite-plugin-dts";

// Vite library mode configuration
export default defineConfig({
  plugins: [
    vue(),
    dts({
      entryRoot: ".",
      outDir: "build",
      insertTypesEntry: true,
      copyDtsFiles: true,
      include: ["index.ts", "lib", "components", "types"], // ✅ 这里要包含 components 与 types
      exclude: ["scripts", "build"],
    }),
  ],
  build: {
    lib: {
      // 打包入口文件（你的 index.ts）
      entry: path.resolve(__dirname, "index.ts"),
      name: "ThreeSceneVue3",
      // 输出文件名
      fileName: (format) => `index.${format}.js`,
      formats: ["es", "cjs"],
    },
    rollupOptions: {
      // three 和 vue 都作为外部依赖，不打进包里
      external: ["vue", "three"],
      output: {
        globals: {
          vue: "Vue",
          three: "THREE",
        },
      },
    },
    outDir: "build", // 输出目录
    sourcemap: false, // 可选：生成 sourcemap 方便调试
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./"),
    },
  },
});

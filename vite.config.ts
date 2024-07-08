import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import tailwind from 'tailwindcss';
import autoprefixer from 'autoprefixer';
import path from 'node:path';
import VueI18nPlugin from '@intlify/unplugin-vue-i18n/vite';

// https://vitejs.dev/config/
export default defineConfig(async () => ({
    plugins: [
        vue(),
        VueI18nPlugin({
            /* options */
            // locale messages resource pre-compile option
            include: [path.resolve(__dirname, './src/locales/**')],
            escapeHtml: false,
            strictMessage: false,
        }),
    ],
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './src'),
        },
    },
    css: {
        postcss: {
            plugins: [tailwind(), autoprefixer()],
        },
    },

    // Vite options tailored for Tauri development and only applied in `tauri dev` or `tauri build`
    //
    // 1. prevent vite from obscuring rust errors
    clearScreen: false,
    // 2. tauri expects a fixed port, fail if that port is not available
    server: {
        port: 1420,
        strictPort: true,
        watch: {
            // 3. tell vite to ignore watching `src-tauri`
            ignored: ["**/src-tauri/**"],
        },
    },
}));

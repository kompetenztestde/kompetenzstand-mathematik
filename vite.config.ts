import { fileURLToPath, URL } from 'node:url'

import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import svgLoader from 'vite-svg-loader'

// https://vite.dev/config/
const env = loadEnv('', process.cwd(), '')

export default defineConfig({
    plugins: [vue(), vueDevTools(), svgLoader()],
    build: {
        outDir: env.VITE_BUILD_DIR || 'dist',
    },
    server: {
        proxy: {
            '/api-proxy': {
                target: 'https://apps.indibit.eu/tba3-api/',
                changeOrigin: true,
                secure: false,
                rewrite: (path) => path.replace(/^\/api-proxy/, ''),
            },
            '/api-inio': {
                target: 'https://127.0.0.1',
                changeOrigin: false,
                secure: false,
                headers: { Host: 'api.inio.localhost' },
                rewrite: (path) => path.replace(/^\/api-inio/, '/report_data_tba3'),
            },
            '/api-auth': {
                target: 'https://127.0.0.1',
                changeOrigin: false,
                secure: false,
                headers: { Host: 'api.inio.localhost' },
                rewrite: (path) => path.replace(/^\/api-auth/, '/auth'),
            },
        },
        host: true,
        port: 3000,
    },
    preview: {
        host: true,
        port: 4173,
        proxy: {
            '/api-proxy': {
                target: 'https://apps.indibit.eu/tba3-api/',
                changeOrigin: true,
                secure: false,
                rewrite: (path) => path.replace(/^\/api-proxy/, ''),
            },
            '/api-inio': {
                target: 'https://api.inio.de/report_data_tba3',
                changeOrigin: true,
                rewrite: (path) => path.replace(/^\/api-inio/, ''),
            },
            '/api-auth': {
                target: 'https://api.inio.de/report_data_tba3',
                changeOrigin: true,
                rewrite: (path) => path.replace(/^\/api-auth/, ''),
            },
        },
    },
    resolve: {
        alias: {
            '@': fileURLToPath(new URL('./src', import.meta.url)),
        },
    },
})

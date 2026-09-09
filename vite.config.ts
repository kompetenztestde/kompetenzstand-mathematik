import { fileURLToPath, URL } from 'node:url'

import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import svgLoader from 'vite-svg-loader'
import license, { type Dependency } from 'rollup-plugin-license'

// Beim Minifizieren entfernt esbuild alle Kommentare und damit auch die
// Copyright-Hinweise der Abhaengigkeiten. MIT, BSD, ISC und Apache-2.0
// verlangen aber, dass diese Hinweise mit ausgeliefert werden. Deshalb sammelt
// rollup-plugin-license sie beim Build in dist/THIRD-PARTY-NOTICES.txt.

// Lizenzen, die mit der MIT-Lizenzierung dieses Projekts vertraeglich sind.
// Eine Abhaengigkeit mit Copyleft-Lizenz (GPL, LGPL, AGPL, MPL, SSPL) laesst
// den Build fehlschlagen, statt unbemerkt im Bundle zu landen.
const ALLOWED_LICENSES = [
    'MIT',
    'MIT-0',
    'ISC',
    'Apache-2.0',
    'BSD-2-Clause',
    'BSD-3-Clause',
    '0BSD',
    'BlueOak-1.0.0',
    'CC0-1.0',
    'Unlicense',
    'Python-2.0',
].join(' OR ')

// Die Schrift kommt nicht ueber npm und taucht deshalb nicht in der
// Abhaengigkeitsliste auf. Der vollstaendige Lizenztext liegt in
// src/themes/fonts/OFL.txt.
const FONT_NOTICE = `League Spartan (src/themes/fonts/*.woff2)
Copyright 2020 The League Spartan Project Authors
(https://github.com/theleagueof/league-spartan)
Lizenz: SIL Open Font License, Version 1.1 — vollstaendiger Text in OFL.txt`

const SEPARATOR = '-'.repeat(78)

function renderThirdPartyNotices(dependencies: Dependency[]): string {
    const sections = dependencies
        .slice()
        .sort((a, b) => (a.name ?? '').localeCompare(b.name ?? ''))
        .map((dep) => {
            const title = `${dep.name ?? 'unbekannt'}@${dep.version ?? '?'} — ${dep.license ?? 'Lizenz nicht angegeben'}`
            const fallback = `Kein Lizenztext im Paket hinterlegt. Siehe ${dep.homepage ?? 'https://www.npmjs.com/package/' + dep.name}.`
            const body = dep.licenseText?.trim() || fallback
            const notice = dep.noticeText?.trim()
            return [SEPARATOR, title, SEPARATOR, '', body, notice ? `\nNOTICE:\n${notice}` : ''].join('\n')
        })

    return [
        'Diese Anwendung enthaelt Software Dritter. Nachfolgend die Lizenzen und',
        'Copyright-Hinweise aller im Bundle enthaltenen Pakete sowie der',
        'verwendeten Schriftart.',
        '',
        SEPARATOR,
        'Schriftarten',
        SEPARATOR,
        '',
        FONT_NOTICE,
        '',
        ...sections,
    ].join('\n')
}

// https://vite.dev/config/
const env = loadEnv('', process.cwd(), '')

export default defineConfig({
    plugins: [vue(), vueDevTools(), svgLoader()],
    base: env.VITE_BASE_PATH || '/',
    build: {
        outDir: env.VITE_BUILD_DIR || 'dist',
        rollupOptions: {
            plugins: [
                license({
                    thirdParty: {
                        allow: {
                            test: ALLOWED_LICENSES,
                            failOnUnlicensed: false,
                            failOnViolation: true,
                        },
                        output: {
                            file: fileURLToPath(new URL('./dist/THIRD-PARTY-NOTICES.txt', import.meta.url)),
                            template: renderThirdPartyNotices,
                        },
                    },
                }),
            ],
        },
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

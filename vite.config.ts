//* Libraries imports
import inertia from '@inertiajs/vite';
import { wayfinder } from '@laravel/vite-plugin-wayfinder';
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import laravel from 'laravel-vite-plugin';
import { defineConfig, loadEnv } from 'vite';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, process.cwd(), '');
    const useFilePolling =
        env.VITE_USE_FILE_POLLING === 'true' || env.VITE_USE_FILE_POLLING === '1';
    const hmrClientPortRaw = env.VITE_HMR_CLIENT_PORT;
    const hmrClientPort =
        hmrClientPortRaw !== undefined && hmrClientPortRaw !== ''
            ? Number.parseInt(hmrClientPortRaw, 10)
            : Number.NaN;
    const hmrClientPortResolved =
        Number.isFinite(hmrClientPort) && hmrClientPort > 0 ? hmrClientPort : undefined;

    return {
        server: {
            host: true,
            port: 5173,
            strictPort: true,
            watch: useFilePolling
                ? {
                      usePolling: true,
                      interval: 1000,
                  }
                : undefined,
            hmr: {
                host: 'localhost',
                port: 5173,
                ...(hmrClientPortResolved !== undefined
                    ? { clientPort: hmrClientPortResolved }
                    : {}),
            },
        },
        plugins: [
            laravel({
                input: ['resources/css/app.css', 'resources/js/app.tsx'],
                refresh: true,
            }),
            inertia(),
            react({
                babel: {
                    plugins: ['babel-plugin-react-compiler'],
                },
            }),
            tailwindcss(),
            wayfinder({
                formVariants: true,
            }),
        ],
    };
});

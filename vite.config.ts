import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react-swc';
import path from 'path';
import { viteSourceLocator } from '@metagptx/vite-plugin-source-locator';

// https://vitejs.dev/config/
export default defineConfig(({ command, mode }) => {
  // Load environment variables based on current mode (development, production, etc.)
  const env = loadEnv(mode, process.cwd(), '');

  return {
    plugins: [
      viteSourceLocator({
        prefix: 'mgx',
      }),
      react(),
    ],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
    server: {
      port: 5173,
      host: true, // Use `true` to expose on network; use `localhost` for local-only
      strictPort: false,
      // Only needed if you're tunneling via ngrok
      allowedHosts: ['f41963dbda2f.ngrok-free.app'],
    },
    // Optional: Enable preview server host access
    preview: {
      host: true,
    },
    // Recommended: Define global constants (e.g., for env in code)
    define: {
      __APP_ENV__: JSON.stringify(env.APP_ENV),
      'process.env': env, // Optional: simulate process.env in code
    },
    // Optional: For better debugging (if using breakpoints in config)
    // See: https://vitejs.dev/config/#debugging-the-config-file-on-vs-code
  };
});
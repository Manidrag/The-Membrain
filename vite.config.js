import { defineConfig ,loadEnv} from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';


export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  return {
  plugins: [react(), tailwindcss()],
  server: {
    port: 5173,
    headers: {
      'Service-Worker-Allowed': '/'
    },
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '')
      }
    }
  },
  define: {
    // Define global constants
    __API_URL__: JSON.stringify('http://localhost:3000'),
    __SOCKET_URL__: JSON.stringify('ws://localhost:3000'),
    // Environment variables
    'process.env.VITE_API_URL': JSON.stringify(env.VITE_API_URL),
    'process.env.VITE_APP_NAME': JSON.stringify(env.VITE_APP_NAME),
    'process.env.NODE_ENV': JSON.stringify(mode)
  }
};
});
 

   
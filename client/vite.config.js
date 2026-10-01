import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { nodePolyfills } from 'vite-plugin-node-polyfills';
import fs from 'fs';
import path from 'path';

function configApiPlugin() {
  const baseDir = typeof import.meta.dirname !== 'undefined' ? import.meta.dirname : path.resolve('');
  const configFile = path.resolve(baseDir, '../server/config.json');
  return {
    name: 'config-api-plugin',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        if (req.url === '/api/config' && req.method === 'GET') {
          try {
            if (fs.existsSync(configFile)) {
              const data = fs.readFileSync(configFile, 'utf8');
              res.setHeader('Content-Type', 'application/json');
              res.end(data);
              return;
            }
          } catch (e) {}
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ success: true, ca: '', twitter: '' }));
          return;
        }
        if (req.url === '/api/config' && req.method === 'POST') {
          let body = '';
          req.on('data', (chunk) => {
            body += chunk;
          });
          req.on('end', () => {
            try {
              const parsed = JSON.parse(body);
              if (parsed.password !== '!123!123!') {
                res.statusCode = 401;
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({ error: 'Unauthorized: Invalid password.' }));
                return;
              }
              if (parsed.adminWallet && parsed.adminWallet !== '7jMX3CSDvXu3DfKewrepvAyYTGZ4h1VWRzuDB14tPau4') {
                res.statusCode = 403;
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({ error: 'Forbidden: Unauthorized wallet address.' }));
                return;
              }
              let current = { ca: '', twitter: '' };
              if (fs.existsSync(configFile)) {
                try {
                  current = JSON.parse(fs.readFileSync(configFile, 'utf8'));
                } catch (e) {}
              }
              const updated = {
                ...current,
                ca: typeof parsed.ca === 'string' ? parsed.ca.trim() : (current.ca || ''),
                twitter: typeof parsed.twitter === 'string' ? parsed.twitter.trim() : (current.twitter || ''),
                ...(typeof parsed.pinataJwt === 'string' ? { pinataJwt: parsed.pinataJwt.trim() } : {}),
                updatedAt: new Date().toISOString()
              };
              fs.writeFileSync(configFile, JSON.stringify(updated, null, 2), 'utf8');
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ success: true, ...updated }));
              return;
            } catch (err) {
              res.statusCode = 500;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ error: err.message }));
              return;
            }
          });
          return;
        }
        next();
      });
    }
  };
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    configApiPlugin(),
    nodePolyfills({
      globals: {
        Buffer: true,
        global: true,
        process: true,
      },
      protocolImports: true,
    }),
  ],
  define: {
    'process.env': {},
  },
  optimizeDeps: {
    include: [
      '@solana/web3.js',
      '@solana/wallet-adapter-react',
      '@solana/wallet-adapter-react-ui',
      'buffer',
      'framer-motion',
      'gsap',
      'canvas-confetti',
      'clsx',
      'tailwind-merge'
    ]
  },
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:5001',
        changeOrigin: true,
        timeout: 60000,
      },
      '/uploads': {
        target: 'http://127.0.0.1:5001',
        changeOrigin: true,
        timeout: 60000,
      }
    }
  }
});

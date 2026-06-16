import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig} from 'vite';

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      port: 3000,
      host: '0.0.0.0',
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
      configureServer(server) {
        server.middlewares.use(async (req, res, next) => {
          if (req.url === '/api/subscribe' || (req.url && req.url.startsWith('/api/subscribe?')) || (req.url && req.url.startsWith('/api/subscribe/'))) {
            try {
              const { default: handler } = await server.ssrLoadModule('./api/subscribe.ts');
              
              let body = '';
              req.on('data', chunk => {
                body += chunk;
              });
              
              req.on('end', async () => {
                let parsedBody = {};
                if (body) {
                  try {
                    parsedBody = JSON.parse(body);
                  } catch (e) {
                    console.error('Could not parse req body', e);
                  }
                }
                
                const vercelReq = Object.assign(req, { body: parsedBody }) as any;
                const vercelRes = {
                  statusCode: 200,
                  status(code: number) {
                    res.statusCode = code;
                    return this;
                  },
                  json(data: any) {
                    res.setHeader('Content-Type', 'application/json');
                    res.end(JSON.stringify(data));
                    return this;
                  },
                  setHeader(name: string, value: string) {
                    res.setHeader(name, value);
                    return this;
                  },
                  end(data?: any) {
                    res.end(data);
                    return this;
                  }
                } as any;
                
                try {
                  await handler(vercelReq, vercelRes);
                } catch (err) {
                  console.error('Handler execution error:', err);
                  res.statusCode = 500;
                  res.end(JSON.stringify({ status: 'error', message: 'Internal Handler Error' }));
                }
              });
            } catch (error) {
              console.error('Error running subscribe handler:', error);
              res.statusCode = 500;
              res.end(JSON.stringify({ status: 'error', message: 'Internal Server Error' }));
            }
          } else {
            next();
          }
        });
      },
    },
  };
});

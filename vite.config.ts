import react from '@vitejs/plugin-react'
import { defineConfig, type Plugin, type ViteDevServer } from 'vite'
import type { IncomingMessage, ServerResponse } from 'http'

interface MockRequest extends IncomingMessage {
  body?: any;
}

interface MockResponse extends ServerResponse {
  status?: (code: number) => MockResponse;
  json?: (data: any) => void;
}

// Custom Vite plugin to emulate Vercel's serverless environment locally
const vercelApiMock = (): Plugin => ({
  name: 'vercel-api-mock',
  configureServer(server: ViteDevServer) {
    server.middlewares.use('/api/quote', async (req: MockRequest, res: MockResponse) => {
      let body = '';
      req.on('data', (chunk: any) => {
        body += chunk.toString();
      });
      req.on('end', async () => {
        try {
          if (body) req.body = JSON.parse(body);
          
          // Dynamically load the API handler (supports TypeScript)
          const { default: handler } = await server.ssrLoadModule('/api/quote.ts');
          
          // Mock Vercel's helper methods
          res.status = (code: number) => {
            res.statusCode = code;
            return res;
          };
          res.json = (data: any) => {
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify(data));
          };
          
          await handler(req, res);
        } catch (error) {
          console.error("API Mock Error:", error);
          res.statusCode = 500;
          res.end(JSON.stringify({ error: 'Internal Server Error' }));
        }
      });
    });
  }
})

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), vercelApiMock()],
})

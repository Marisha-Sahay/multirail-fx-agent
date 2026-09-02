import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// Custom Vite plugin to emulate Vercel's serverless environment locally
// This allows us to run the backend API directly inside Vite without needing Vercel CLI
const vercelApiMock = () => ({
  name: 'vercel-api-mock',
  configureServer(server) {
    server.middlewares.use('/api/quote', async (req, res) => {
      let body = '';
      req.on('data', chunk => {
        body += chunk.toString();
      });
      req.on('end', async () => {
        try {
          if (body) req.body = JSON.parse(body);
          
          // Dynamically load the API handler (supports TypeScript)
          const { default: handler } = await server.ssrLoadModule('/api/quote.ts');
          
          // Mock Vercel's helper methods
          res.status = (code) => {
            res.statusCode = code;
            return res;
          };
          res.json = (data) => {
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

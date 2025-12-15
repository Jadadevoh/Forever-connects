import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = process.env.PORT || 8080;
const PUBLIC_DIR = path.join(__dirname, 'dist');

const getContentType = (filePath) => {
  const extname = path.extname(filePath);
  switch (extname) {
    case '.html': return 'text/html';
    case '.js': return 'text/javascript';
    case '.css': return 'text/css';
    case '.json': return 'application/json';
    case '.png': return 'image/png';
    case '.jpg': return 'image/jpg';
    case '.jpeg': return 'image/jpeg';
    case '.gif': return 'image/gif';
    case '.svg': return 'image/svg+xml';
    case '.ico': return 'image/x-icon';
    case '.woff': return 'font/woff';
    case '.woff2': return 'font/woff2';
    case '.ttf': return 'font/ttf';
    default: return 'application/octet-stream';
  }
};

const server = http.createServer((req, res) => {
  // Health check endpoint for Cloud Run
  if (req.url === '/healthz' || req.url === '/health') {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('OK');
    return;
  }

  // Normalize path and remove query string
  const safeUrl = req.url.split('?')[0];
  
  // Default to index.html for root, otherwise use the requested path
  let filePath = path.join(PUBLIC_DIR, safeUrl === '/' ? 'index.html' : safeUrl);

  // Security check to prevent directory traversal
  if (!filePath.startsWith(PUBLIC_DIR)) {
     res.writeHead(403);
     res.end('Forbidden');
     return;
  }

  // Check if file exists
  fs.stat(filePath, (err, stats) => {
    if (err || !stats.isFile()) {
      // SPA Fallback: If file doesn't exist and it's not a specific asset request (no extension),
      // serve index.html to let React Router handle the route.
      if (!path.extname(safeUrl) || safeUrl.indexOf('.') === -1) {
         fs.readFile(path.join(PUBLIC_DIR, 'index.html'), (err, content) => {
            if (err) {
               console.error('Error serving index.html:', err);
               // Don't crash, just serve simple error
               res.writeHead(500, { 'Content-Type': 'text/plain' });
               res.end('Server Error: index.html not found. Deployment might be in progress.');
            } else {
               res.writeHead(200, { 'Content-Type': 'text/html' });
               res.end(content);
            }
         });
      } else {
         res.writeHead(404);
         res.end('Not Found');
      }
    } else {
      // Serve the static file
      fs.readFile(filePath, (err, content) => {
        if (err) {
          res.writeHead(500);
          res.end('Server Error');
        } else {
          res.writeHead(200, { 'Content-Type': getContentType(filePath) });
          res.end(content);
        }
      });
    }
  });
});

// Explicitly bind to 0.0.0.0 to ensure Docker container exposes port correctly
server.listen(PORT, '0.0.0.0', () => {
  console.log(`Server listening on port ${PORT}`);
});
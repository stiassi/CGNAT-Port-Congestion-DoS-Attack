const fs = require('fs');
const path = require('path');
const http = require('http');
const WebSocket = require('ws');

// config 
const PORT = process.env.PORT || 8080;
const HOLD_DURATION_MS = 10_000_000;

const MIME_TYPES = {
  '.html': 'text/html',
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.ico': 'image/x-icon',
  '.json': 'application/json'
};

function setCorsHeaders(res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
}

function serveFile(res, filePath) {
  fs.readFile(filePath, (err, data) => {
    if (err) {
      const status = err.code === 'ENOENT' ? 404 : 500;
      const message = err.code === 'ENOENT' ? '404 Not Found' : `Server Error: ${err.code}`;
      res.writeHead(status, { 'Content-Type': 'text/plain' });
      return res.end(message);
    }

    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';
    res.writeHead(200, { 'Content-Type': contentType });
    res.end(data);
  });
}

// http requests 
function handleRequest(req, res) {
  setCorsHeaders(res);

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    return res.end();
  }

  const urlPath = req.url.split('?')[0];

  if (urlPath === '/health') {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    return res.end('OK\n');
  }

  // endpoint for holding connections
  if (urlPath === '/hold') {
    console.log(`[HOLD] ${req.method} ${req.url} from ${req.socket.remoteAddress}:${req.socket.remotePort}`);
    res.writeHead(200, {
      'Content-Type': 'text/plain',
      'Cache-Control': 'no-store'
    });

    const timeout = setTimeout(() => {
      res.end('Done holding.\n');
    }, HOLD_DURATION_MS);

    req.on('close', () => {
      clearTimeout(timeout);
    });

    return;
  }

  // path to the html files
  let filePath;
  if (urlPath === '/') {
    filePath = path.join(__dirname, 'menu.html');
  }
  else if (urlPath === '/websocket') {
    filePath = path.join(__dirname, 'websockets/websocket.html');
  } else if (urlPath === '/fetch') {
    filePath = path.join(__dirname, 'http1/fetch.html');
  } else {
    filePath = path.join(__dirname, urlPath);
  }

  serveFile(res, filePath);
}

// create server
const server = http.createServer(handleRequest);
const wss = new WebSocket.Server({ server });

let connectionId = 0;

wss.on('connection', (ws, req) => {
  const id = ++connectionId;
  console.log(`[WS] #${id} connected from ${req.socket.remoteAddress}`);

  ws.send(JSON.stringify({ type: 'welcome', id }));

  ws.on('message', (msg) => {
    try {
      ws.send(JSON.stringify({ type: 'echo', id, data: msg.toString() }));
    } catch (err) {
      console.error(`[WS] #${id} send error:`, err.message);
    }
  });

  ws.on('close', () => console.log(`[WS] #${id} closed`));
  ws.on('error', (err) => console.error(`[WS] #${id} error:`, err.message));
});

// start server
server.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Menu:       http://doszilla:${PORT}/`);
  console.log(`WebSocket: http://doszilla:${PORT}/websocket`);
  console.log(`HTTP fetchh erquests:  http://doszilla:${PORT}/fetch`);
});

process.on('SIGTERM', () => {
  console.log('Exit');
  wss.clients.forEach((client) => client.close(1001, 'Exiting server'));
  server.close(() => process.exit(0));
});
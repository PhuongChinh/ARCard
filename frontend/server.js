const http = require('http');
const https = require('https');
const { parse } = require('url');
const next = require('next');
const fs = require('fs');
const path = require('path');

const dev = process.env.NODE_ENV !== 'production';
const hostname = 'localhost';
const port = parseInt(process.env.PORT || '3000', 10);

const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  // Read the SSL certificates
  const certPath = path.join(__dirname, 'scripts', 'cert');
  const keyPath = path.join(__dirname, 'scripts', 'key');
  
  let httpsOptions = {};
  
  if (fs.existsSync(certPath) && fs.existsSync(keyPath)) {
    httpsOptions = {
      key: fs.readFileSync(keyPath),
      cert: fs.readFileSync(certPath),
    };
    console.log('🔒 HTTPS enabled');
  } else {
    console.log('⚠️ SSL certificates not found. Run: npm run generate-certs');
    console.log('Using HTTP instead...');
  }

  const requestHandler = (req, res) => {
    const parsedUrl = parse(req.url, true);
    handle(req, res, parsedUrl);
  };
  const server = httpsOptions.key
    ? https.createServer(httpsOptions, requestHandler)
    : http.createServer(requestHandler);

  server.listen(port, (err) => {
    if (err) throw err;
    console.log(`> Ready on ${httpsOptions.key ? 'https' : 'http'}://${hostname}:${port}`);
  });
});

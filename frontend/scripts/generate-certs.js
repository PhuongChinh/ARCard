const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const dir = __dirname;
const keyPath = path.join(dir, 'key');
const certPath = path.join(dir, 'cert');

// Check if certs already exist
if (fs.existsSync(keyPath) && fs.existsSync(certPath)) {
  console.log('✅ Certificates already exist!');
  process.exit(0);
}

console.log('Generating self-signed certificates...');

// Try using openssl if available
try {
  execSync('openssl req -x509 -newkey rsa:2048 -keyout key -out cert -days 365 -nodes -subj "/CN=localhost"', 
    { cwd: dir, stdio: 'pipe' });
  console.log('✅ SSL certificates generated with OpenSSL!');
  console.log('   - key: ./key');
  console.log('   - cert: ./cert');
} catch (e) {
  // Fallback: create minimal cert using Node.js
  console.log('OpenSSL not available, creating minimal certificates...');
  
  const crypto = require('crypto');
  const { privateKey, publicKey } = crypto.generateKeyPairSync('rsa', { modulusLength: 2048 });
  
  // Create a basic self-signed certificate
  const cert = crypto.createCertificate({
    publicKey,
    privateKey,
    days: 365,
    subject: { commonName: 'localhost' },
    extensions: [
      { name: 'basicConstraints', cA: false },
      { name: 'subjectAltName', altNames: [{ type: 2, value: 'localhost' }] }
    ]
  });
  
  fs.writeFileSync(keyPath, privateKey);
  fs.writeFileSync(certPath, cert);
  
  console.log('✅ SSL certificates generated!');
  console.log('   - key: ./key');
  console.log('   - cert: ./cert');
}

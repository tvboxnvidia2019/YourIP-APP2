import { build } from 'esbuild';
import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

// Create necessary directories
console.log('Creating directories...');
fs.mkdirSync('dist/public', { recursive: true });

// Create a minimal index.html for production
console.log('Creating production index.html...');
const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Your IP - IP Address Tracker</title>
    <meta name="description" content="Track your IP address and get detailed geolocation information including ISP, location, and security details.">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'Inter', sans-serif; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); min-height: 100vh; display: flex; align-items: center; justify-content: center; }
        .container { background: white; padding: 2rem; border-radius: 10px; box-shadow: 0 10px 30px rgba(0,0,0,0.1); text-align: center; max-width: 600px; width: 90%; }
        h1 { color: #333; margin-bottom: 1rem; }
        .loading { color: #666; margin: 1rem 0; }
        .error { color: #e74c3c; margin: 1rem 0; }
    </style>
</head>
<body>
    <div class="container">
        <h1>Your IP Address Tracker</h1>
        <div class="loading">Loading IP information...</div>
        <div id="ip-info"></div>
    </div>
    <script>
        fetch('/api/ip-info')
            .then(res => res.json())
            .then(data => {
                document.getElementById('ip-info').innerHTML = \`
                    <div style="margin: 1rem 0;">
                        <h2>Your IP: \${data.ip}</h2>
                        <p>Location: \${data.city}, \${data.region}, \${data.country}</p>
                        <p>ISP: \${data.isp}</p>
                        <p>Timezone: \${data.timezone}</p>
                    </div>
                \`;
                document.querySelector('.loading').style.display = 'none';
            })
            .catch(err => {
                document.querySelector('.loading').style.display = 'none';
                document.getElementById('ip-info').innerHTML = '<div class="error">Error loading IP information</div>';
            });
    </script>
</body>
</html>`;

fs.writeFileSync('dist/public/index.html', htmlContent);

// Build the frontend first
console.log('Building frontend...');
execSync('npx vite build', { stdio: 'inherit' });

// Build the backend with proper externals for SQLite
console.log('Building backend...');
await build({
  entryPoints: ['server/index.prod.ts'],
  bundle: true,
  format: 'esm',
  platform: 'node',
  outfile: 'dist/index.js',
  packages: 'external',
  minify: true,
  sourcemap: false,
  external: ['better-sqlite3'], // SQLite3 needs to be external for proper loading
});

console.log('Build complete!');
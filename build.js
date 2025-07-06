import { build } from 'esbuild';
import { execSync } from 'child_process';

// Build the frontend first
console.log('Building frontend...');
execSync('npx vite build --outDir dist/public', { stdio: 'inherit' });

// Build the backend with proper externals
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
});

console.log('Build complete!');
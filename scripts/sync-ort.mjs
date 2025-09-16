// Script to sync ONNX Runtime WASM files
import { copyFileSync, existsSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const publicOrtDir = join(__dirname, '..', 'public', 'ort');
const nodeModulesOrtDir = join(__dirname, '..', 'node_modules', 'onnxruntime-web', 'dist');

console.log('Syncing ONNX Runtime WASM files...');

// Ensure directory exists
if (!existsSync(publicOrtDir)) {
  mkdirSync(publicOrtDir, { recursive: true });
}

// Files to copy
const filesToCopy = [
  'ort-wasm-simd-threaded.mjs',
  'ort-wasm-simd-threaded.wasm',
  'ort-wasm-simd.mjs',
  'ort-wasm-simd.wasm',
  'ort-wasm.mjs',
  'ort-wasm.wasm'
];

let copiedCount = 0;
let errorCount = 0;

for (const file of filesToCopy) {
  const srcPath = join(nodeModulesOrtDir, file);
  const destPath = join(publicOrtDir, file);
  
  try {
    if (existsSync(srcPath)) {
      copyFileSync(srcPath, destPath);
      console.log(`✓ Copied ${file}`);
      copiedCount++;
    } else {
      console.warn(`⚠ Source file not found: ${file}`);
      errorCount++;
    }
  } catch (error) {
    console.error(`✗ Failed to copy ${file}:`, error.message);
    errorCount++;
  }
}

console.log(`\nSync complete: ${copiedCount} files copied, ${errorCount} errors`);

if (errorCount > 0) {
  console.warn('Some files could not be copied. The application may fall back to CDN versions.');
} else {
  console.log('All ONNX Runtime WASM files successfully vendored to public/ort/');
}
import * as ort from 'onnxruntime-web';

let ortInitialized = false;
let ortInfo = {
  backend: 'wasm',
  threads: 1,
  wasmPaths: '/ort',
  filesPresent: [] as string[],
  filesMissing: [] as string[]
};

/**
 * Check if ORT WASM files are present via HEAD requests
 */
async function ensureOrtFilesPresent(): Promise<void> {
  const base = (import.meta as any).env?.BASE_URL || '/';
  const ortPath = base + 'ort';
  
  const requiredFiles = [
    'ort-wasm.wasm',
    'ort-wasm.mjs',
    'ort-wasm-simd.wasm', 
    'ort-wasm-simd.mjs',
    'ort-wasm-simd-threaded.wasm',
    'ort-wasm-simd-threaded.mjs'
  ];

  ortInfo.filesPresent = [];
  ortInfo.filesMissing = [];

  for (const file of requiredFiles) {
    try {
      const response = await fetch(`${ortPath}/${file}`, { method: 'HEAD' });
      if (response.ok) {
        ortInfo.filesPresent.push(file);
      } else {
        ortInfo.filesMissing.push(file);
        console.warn(`ORT file missing: ${file} (${response.status})`);
      }
    } catch (error) {
      ortInfo.filesMissing.push(file);
      console.warn(`ORT file check failed: ${file}`, error);
    }
  }

  if (ortInfo.filesMissing.length > 0) {
    console.warn('Missing ORT files:', ortInfo.filesMissing);
    console.warn('Run "npm run sync:ort" to copy WASM files');
  }
}

/**
 * Setup ONNX Runtime with conservative fallbacks - never throws
 */
export async function setupOrt(): Promise<typeof ortInfo> {
  if (ortInitialized) {
    return ortInfo;
  }

  try {
    const base = (import.meta as any).env?.BASE_URL || '/';
    const wasmPaths = base + 'ort';
    
    // Set WASM paths to local vendored files
    ort.env.wasm.wasmPaths = wasmPaths;
    
    // Conservative threading: only if crossOriginIsolated
    if (!crossOriginIsolated) {
      ort.env.wasm.numThreads = 1;
      console.warn('Cross-origin isolation not available, falling back to single-threaded WASM');
    }
    
    // Check file presence
    await ensureOrtFilesPresent();
    
    // Update ortInfo
    ortInfo = {
      backend: 'wasm',
      threads: ort.env.wasm.numThreads ?? 1,
      wasmPaths,
      filesPresent: ortInfo.filesPresent,
      filesMissing: ortInfo.filesMissing
    };
    
    ortInitialized = true;
    console.log('✓ ORT initialized conservatively:', ortInfo);
    
  } catch (error) {
    console.warn('ORT setup encountered issues, using defaults:', error);
    // Ensure we always return valid info even on error
    ortInfo.backend = 'wasm';
    ortInfo.threads = 1;
  }
  
  return ortInfo;
}

/**
 * Get current ORT information
 */
export function getOrtInfo(): typeof ortInfo {
  return { ...ortInfo };
}

/**
 * Check if ORT is ready for use
 */
export function isOrtReady(): boolean {
  return ortInitialized && ortInfo.filesPresent.length >= 2; // At least basic wasm files
}

/**
 * Log comprehensive ORT diagnostics
 */
export function logOrtDiag(): void {
  console.group('🔧 ORT Diagnostics');
  console.log('Cross-origin isolated:', crossOriginIsolated);
  console.log('WASM paths:', ortInfo.wasmPaths);
  console.log('Thread count:', ortInfo.threads);
  console.log('Backend:', ortInfo.backend);
  console.log('Files present:', ortInfo.filesPresent);
  console.log('Files missing:', ortInfo.filesMissing);
  console.log('SharedArrayBuffer available:', typeof SharedArrayBuffer !== 'undefined');
  console.log('WebAssembly available:', typeof WebAssembly !== 'undefined');
  console.groupEnd();
}
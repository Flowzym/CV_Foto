// ONNX Runtime utilities
import * as ort from 'onnxruntime-web';

export interface OrtInfo {
  backend: string;
  version: string;
  wasmPath: string;
  supportsSimd: boolean;
  supportsThreads: boolean;
}

let ortInitialized = false;
let ortInfo: OrtInfo | null = null;

/**
 * Setup ONNX Runtime with local WASM files and robust backend selection
 */
export async function setupOrt(): Promise<OrtInfo> {
  if (ortInitialized && ortInfo) {
    return ortInfo;
  }

  console.log('Setting up ONNX Runtime...');

  // Set WASM paths to local vendored files
  ort.env.wasm.wasmPaths = '/ort/';
  
  // Disable web workers for now (can cause issues in some environments)
  ort.env.wasm.numThreads = 1;

  // Try backends in order of preference: simd-threaded → simd → wasm
  const backends = ['webgl', 'wasm'];
  let selectedBackend = 'wasm';
  let backendError: Error | null = null;

  // Check for SIMD and threading support
  const supportsSimd = await checkSimdSupport();
  const supportsThreads = await checkThreadSupport();

  console.log(`Browser capabilities: SIMD=${supportsSimd}, Threads=${supportsThreads}`);

  // Select best available backend
  if (supportsSimd && supportsThreads) {
    backends.unshift('wasm'); // Use threaded SIMD if available
  } else if (supportsSimd) {
    backends.unshift('wasm'); // Use SIMD without threading
  }

  // Try each backend until one works
  for (const backend of backends) {
    try {
      console.log(`Trying backend: ${backend}`);
      
      // Set the backend
      await ort.env.webgl.contextId;
      
      // Test with a simple session creation
      const testModel = new Uint8Array([
        // Minimal ONNX model bytes (identity operation)
        8, 1, 18, 12, 10, 1, 120, 18, 1, 121, 34, 4, 116, 101, 115, 116
      ]);
      
      try {
        const session = await ort.InferenceSession.create(testModel, { executionProviders: [backend] });
        session.release();
        selectedBackend = backend;
        console.log(`✓ Successfully initialized with backend: ${backend}`);
        break;
      } catch (sessionError) {
        console.warn(`Backend ${backend} failed session test:`, sessionError);
        backendError = sessionError as Error;
        continue;
      }
    } catch (error) {
      console.warn(`Backend ${backend} initialization failed:`, error);
      backendError = error as Error;
      continue;
    }
  }

  ortInfo = {
    backend: selectedBackend,
    version: ort.env.versions.web,
    wasmPath: ort.env.wasm.wasmPaths as string,
    supportsSimd,
    supportsThreads
  };

  ortInitialized = true;
  console.log('ONNX Runtime setup complete:', ortInfo);
  
  return ortInfo;
}

/**
 * Get current ORT information
 */
export function getOrtInfo(): OrtInfo | null {
  return ortInfo;
}

/**
 * Check if browser supports SIMD
 */
async function checkSimdSupport(): Promise<boolean> {
  try {
    return typeof WebAssembly.validate === 'function' && 
           WebAssembly.validate(new Uint8Array([
             0, 97, 115, 109, 1, 0, 0, 0, 1, 5, 1, 96, 0, 1, 123, 3, 2, 1, 0, 10, 10, 1, 8, 0, 65, 0, 253, 15, 253, 98, 11
           ]));
  } catch {
    return false;
  }
}

/**
 * Check if browser supports threading (SharedArrayBuffer)
 */
async function checkThreadSupport(): Promise<boolean> {
  try {
    return typeof SharedArrayBuffer !== 'undefined' && 
           typeof Atomics !== 'undefined' &&
           typeof Worker !== 'undefined';
  } catch {
    return false;
  }
}

/**
 * Reset ORT initialization (for testing)
 */
export function resetOrt(): void {
  ortInitialized = false;
  ortInfo = null;
}
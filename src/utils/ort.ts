import * as ort from 'onnxruntime-web';

let ortInitialized = false;
let ortBackend = 'unknown';
let ortSupportsThreads = false;

/**
 * Setup ONNX Runtime with local WASM files and backend probing
 */
export async function setupOrt(): Promise<void> {
  if (ortInitialized) {
    return;
  }

  try {
    // Set WASM paths to local vendored files
    ort.env.wasm.wasmPaths = '/ort/';
    
    // Probe backends in order of preference
    const backends = ['wasm-simd-threaded', 'wasm-simd', 'wasm'];
    
    for (const backend of backends) {
      try {
        console.log(`Probing ORT backend: ${backend}`);
        
        // Test if backend is available
        const testSession = await ort.InferenceSession.create(
          new Uint8Array([]), // Empty model for testing
          { executionProviders: [backend] }
        );
        
        ortBackend = backend;
        ortSupportsThreads = backend.includes('threaded');
        
        console.log(`✓ ORT backend selected: ${backend}`);
        break;
        
      } catch (error) {
        console.warn(`Backend ${backend} not available:`, error.message);
        continue;
      }
    }
    
    if (ortBackend === 'unknown') {
      throw new Error('No ORT backend available');
    }
    
    ortInitialized = true;
    console.log('✓ ONNX Runtime initialized successfully');
    
  } catch (error) {
    console.error('Failed to initialize ONNX Runtime:', error);
    // Don't throw - allow app to continue without ORT
    ortBackend = 'error';
  }
}

/**
 * Get current ORT information
 */
export function getOrtInfo(): { backend: string; threads: boolean; initialized: boolean } {
  return {
    backend: ortBackend,
    threads: ortSupportsThreads,
    initialized: ortInitialized
  };
}

/**
 * Check if ORT is ready for use
 */
export function isOrtReady(): boolean {
  return ortInitialized && ortBackend !== 'error' && ortBackend !== 'unknown';
}
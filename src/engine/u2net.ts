import * as ort from 'onnxruntime-web';

let u2netSession: ort.InferenceSession | null = null;

/**
 * Load U²-Net model with strict WASM execution provider
 */
export async function loadU2NetModel(): Promise<ort.InferenceSession> {
  if (u2netSession) {
    return u2netSession;
  }

  try {
    // Strict WASM execution provider - let ORT choose the right bundle
    const session = await ort.InferenceSession.create('/models/u2netp.onnx', {
      executionProviders: ['wasm']
    });
    
    u2netSession = session;
    console.log('✓ U²-Net model loaded successfully');
    return session;
    
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    
    // Friendly error mapping
    if (errorMessage.includes('no available backend') || 
        errorMessage.includes('dynamic import') ||
        errorMessage.includes('Failed to load')) {
      throw new Error(
        'ORT-Bundles nicht gefunden. Bitte npm run sync:ort (oder Bolt-Build) ausführen. ' +
        'Erwartet: /public/ort/*.'
      );
    }
    
    if (errorMessage.includes('MODEL_PLACEHOLDER') || 
        errorMessage.includes('Not found') ||
        errorMessage.includes('404')) {
      throw new Error(
        'U²-Net Modell nicht gefunden. Benötigt echte ~5-7 MB u2netp.onnx in public/models/.'
      );
    }
    
    // Re-throw with original error for other cases
    throw error;
  }
}

/**
 * Process image with U²-Net for background removal
 */
export async function processU2Net(imageData: ImageData): Promise<ImageData> {
  try {
    const session = await loadU2NetModel();
    
    // TODO: Implement actual U²-Net inference
    console.log('U²-Net processing placeholder - session ready:', !!session);
    
    // Return placeholder alpha mask for now
    const alphaData = new ImageData(imageData.width, imageData.height);
    for (let i = 0; i < alphaData.data.length; i += 4) {
      alphaData.data[i] = 255;     // R
      alphaData.data[i + 1] = 255; // G  
      alphaData.data[i + 2] = 255; // B
      alphaData.data[i + 3] = 255; // A
    }
    
    return alphaData;
    
  } catch (error) {
    console.error('U²-Net processing failed:', error);
    throw error;
  }
}

/**
 * Cleanup U²-Net resources
 */
export function disposeU2Net(): void {
  if (u2netSession) {
    u2netSession.release();
    u2netSession = null;
    console.log('✓ U²-Net model disposed');
  }
}
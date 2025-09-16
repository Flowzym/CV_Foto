import { useState } from 'react';
import { getOrtInfo, logOrtDiag } from '../utils/ort';

export const Diagnostics = () => {
  const [showSyncHint, setShowSyncHint] = useState(false);
  const ortInfo = getOrtInfo();
  
  const requiredFiles = [
    'ort-wasm.wasm',
    'ort-wasm.mjs', 
    'ort-wasm-simd.wasm',
    'ort-wasm-simd.mjs',
    'ort-wasm-simd-threaded.wasm',
    'ort-wasm-simd-threaded.mjs'
  ];
  
  return (
    <div className="bg-white rounded-lg border p-4 space-y-4">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-gray-700">ONNX Runtime Status</span>
        <span className={`px-2 py-1 rounded text-xs font-medium ${
          ortInfo.filesPresent.length >= 2
            ? 'bg-green-100 text-green-800' 
            : 'bg-yellow-100 text-yellow-800'
        }`}>
          {ortInfo.filesPresent.length >= 2 ? 'Ready' : 'Limited'}
        </span>
      </div>
      
      {/* Environment Info */}
      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-gray-600">Cross-Origin Isolated:</span>
          <span className={`font-mono ${crossOriginIsolated ? 'text-green-600' : 'text-yellow-600'}`}>
            {crossOriginIsolated ? '✓ Yes' : '✗ No'}
          </span>
        </div>
        
        <div className="flex justify-between">
          <span className="text-gray-600">WASM Paths:</span>
          <span className="font-mono text-xs text-gray-500">{ortInfo.wasmPaths}</span>
        </div>
        
        <div className="flex justify-between">
          <span className="text-gray-600">Threads:</span>
          <span className="font-mono">{ortInfo.threads}</span>
        </div>
        
        <div className="flex justify-between">
          <span className="text-gray-600">Backend:</span>
          <span className="font-mono">{ortInfo.backend}</span>
        </div>
      </div>
      
      {/* File Presence Check */}
      <div className="border-t pt-3">
        <div className="text-sm font-medium text-gray-700 mb-2">ORT Files ({ortInfo.filesPresent.length}/6)</div>
        <div className="grid grid-cols-1 gap-1 text-xs">
          {requiredFiles.map(file => {
            const isPresent = ortInfo.filesPresent.includes(file);
            return (
              <div key={file} className="flex justify-between items-center">
                <span className="font-mono text-gray-600">{file}</span>
                <span className={isPresent ? 'text-green-600' : 'text-red-600'}>
                  {isPresent ? '✓' : '✗'}
                </span>
              </div>
            );
          })}
        </div>
      </div>
      
      {/* Action Buttons */}
      <div className="border-t pt-3 space-y-2">
        <button
          onClick={() => logOrtDiag()}
          className="w-full px-3 py-2 text-sm bg-blue-50 text-blue-700 rounded hover:bg-blue-100 transition-colors"
        >
          📊 Log Detailed Diagnostics
        </button>
        
        <button
          onClick={() => setShowSyncHint(!showSyncHint)}
          className="w-full px-3 py-2 text-sm bg-gray-50 text-gray-700 rounded hover:bg-gray-100 transition-colors"
        >
          🔄 Re-Sync ORT Hinweis
        </button>
      </div>
      
      {/* Sync Instructions */}
      {showSyncHint && (
        <div className="border-t pt-3 bg-yellow-50 -m-4 mt-3 p-4 rounded-b-lg">
          <div className="text-sm text-yellow-800">
            <div className="font-medium mb-2">ORT-Bundles synchronisieren:</div>
            <div className="space-y-1 font-mono text-xs bg-yellow-100 p-2 rounded">
              <div>npm run sync:ort</div>
              <div className="text-yellow-600"># oder bei Bolt-Build automatisch</div>
            </div>
            <div className="mt-2 text-xs text-yellow-700">
              Kopiert WASM-Dateien von node_modules nach public/ort/
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
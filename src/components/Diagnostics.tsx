import { getOrtInfo } from '../utils/ort';

export const Diagnostics = () => {
  const ortInfo = getOrtInfo();
  
  return (
    <div className="bg-white rounded-lg border p-4 space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-gray-700">ONNX Runtime</span>
        <span className={`px-2 py-1 rounded text-xs font-medium ${
          ortInfo.initialized 
            ? 'bg-green-100 text-green-800' 
            : 'bg-yellow-100 text-yellow-800'
        }`}>
          {ortInfo.initialized ? 'Ready' : 'Loading'}
        </span>
      </div>
      
      <div className="text-sm text-gray-600 space-y-1">
        <div>Backend: <span className="font-mono">{ortInfo.backend}</span></div>
        <div>Threads: <span className="font-mono">{ortInfo.threads ? 'Yes' : 'No'}</span></div>
      </div>
      
      <div className="pt-2 border-t">
        <div className="text-xs text-gray-500">
          Browser: {navigator.userAgent.split(' ').pop()}
        </div>
      </div>
    </div>
  );
};
import { getOrtInfo } from '../utils/ort';

export const Diagnostics = () => {
  const ortInfo = getOrtInfo();

  return (
    <div className="bg-gray-100 rounded-lg p-4">
      <h3 className="font-semibold text-gray-800 mb-3">System Status</h3>
      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-gray-600">ONNX Runtime:</span>
          <span className={ortInfo ? 'text-green-600' : 'text-red-600'}>
            {ortInfo ? 'Ready' : 'Not Ready'}
          </span>
        </div>
        {ortInfo && (
          <>
            <div className="flex justify-between">
              <span className="text-gray-600">Backend:</span>
              <span className="text-gray-800">{ortInfo.backend}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Version:</span>
              <span className="text-gray-800">{ortInfo.version}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">SIMD Support:</span>
              <span className={ortInfo.supportsSimd ? 'text-green-600' : 'text-yellow-600'}>
                {ortInfo.supportsSimd ? 'Yes' : 'No'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Threading:</span>
              <span className={ortInfo.supportsThreads ? 'text-green-600' : 'text-yellow-600'}>
                {ortInfo.supportsThreads ? 'Yes' : 'No'}
              </span>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
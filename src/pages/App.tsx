import { useEffect, useState } from 'react';
import { UploadArea } from '../components/UploadArea';
import { Cropper } from '../components/Cropper';
import { BGPicker } from '../components/BGPicker';
import { ExportBar } from '../components/ExportBar';
import { ProgressBar } from '../components/ProgressBar';
import { Diagnostics } from '../components/Diagnostics';
import { setupOrt, getOrtInfo, type OrtInfo } from '../utils/ort';

function App() {
  const [ortStatus, setOrtStatus] = useState<'loading' | 'ready' | 'error'>('loading');
  const [ortInfo, setOrtInfo] = useState<OrtInfo | null>(null);
  const [ortError, setOrtError] = useState<string | null>(null);

  useEffect(() => {
    const initializeOrt = async () => {
      try {
        console.log('Initializing ONNX Runtime...');
        const info = await setupOrt();
        setOrtInfo(info);
        setOrtStatus('ready');
        console.log('ONNX Runtime ready:', info);
      } catch (error) {
        console.error('Failed to initialize ONNX Runtime:', error);
        setOrtError(error instanceof Error ? error.message : 'Unknown error');
        setOrtStatus('error');
        
        // Always fallback gracefully - app should still work without ORT
        console.warn('Continuing without ONNX Runtime - some features may be limited');
      }
    };

    initializeOrt();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <h1 className="text-3xl font-bold text-gray-900">CV-Photo Studio</h1>
            <div className="flex items-center space-x-2">
              <div className={`w-3 h-3 rounded-full ${
                ortStatus === 'loading' ? 'bg-yellow-400' :
                ortStatus === 'ready' ? 'bg-green-400' : 'bg-red-400'
              }`} />
              <span className="text-sm text-gray-600">
                ORT: {ortStatus === 'loading' ? 'Loading...' : 
                      ortStatus === 'ready' ? `Ready (${ortInfo?.backend})` : 'Error'}
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Step Progress */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            {[1, 2, 3, 4, 5].map((step) => (
              <div key={step} className="flex items-center">
                <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center text-sm font-medium">
                  {step}
                </div>
                {step < 5 && <div className="w-16 h-0.5 bg-gray-200 mx-2" />}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">
            <section>
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Upload & Edit</h2>
              <UploadArea />
            </section>
            
            <section>
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Crop & Adjust</h2>
              <Cropper />
            </section>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            <section>
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Background</h2>
              <BGPicker />
            </section>
            
            <section>
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Export</h2>
              <ExportBar />
            </section>
            
            <section>
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Progress</h2>
              <ProgressBar />
            </section>
            
            <section>
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Diagnostics</h2>
              <Diagnostics />
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
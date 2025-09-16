import { useEffect } from 'react';
import { UploadArea } from '../components/UploadArea';
import { Cropper } from '../components/Cropper';
import { BGPicker } from '../components/BGPicker';
import { ExportBar } from '../components/ExportBar';
import { ProgressBar } from '../components/ProgressBar';
import { Diagnostics } from '../components/Diagnostics';
import { setupOrt, logOrtDiag } from '../utils/ort';

function App() {
  useEffect(() => {
    // Initialize ONNX Runtime on app start - no throws, always fallback
    const initOrt = async () => {
      const ortInfo = await setupOrt();
      
      if (ortInfo.filesMissing.length > 0) {
        console.warn('⚠️ ORT fällt auf single-thread wasm zurück');
      }
      
      // Log diagnostics in development
      if (import.meta.env.DEV) {
        logOrtDiag();
      }
    };
    
    initOrt();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <h1 className="text-3xl font-bold text-gray-900">CV-Photo Studio</h1>
          </div>
        </div>
      </header>

      {/* Step Progress */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            {['Upload', 'Crop', 'Freistellen', 'Hintergrund', 'Export'].map((step, index) => (
              <div key={step} className="flex items-center">
                <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center text-sm font-medium">
                  {index + 1}
                </div>
                <span className="ml-2 text-sm text-gray-600">{step}</span>
                {index < 4 && <div className="w-16 h-0.5 bg-gray-200 mx-4" />}
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
ONNX Runtime WASM Bundles
==========================

Diese Dateien sind vendored copies aus onnxruntime-web/dist/:

- ort-wasm.mjs / ort-wasm.wasm (Basis WASM)
- ort-wasm-simd.mjs / ort-wasm-simd.wasm (SIMD optimiert)  
- ort-wasm-simd-threaded.mjs / ort-wasm-simd-threaded.wasm (SIMD + Threading)

WICHTIG: Nicht löschen! Diese Dateien ermöglichen offline PWA-Betrieb.

Aktualisierung: npm run sync:ort
Automatisch: postinstall hook
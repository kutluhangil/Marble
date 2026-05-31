/**
 * Detect WebGL support. Returns true during SSR (assume capable; the
 * client re-checks before mounting the canvas).
 */
export function hasWebGL(): boolean {
  if (typeof window === 'undefined') return true;
  try {
    const canvas = document.createElement('canvas');
    return !!(
      window.WebGLRenderingContext &&
      (canvas.getContext('webgl') || canvas.getContext('experimental-webgl'))
    );
  } catch {
    return false;
  }
}

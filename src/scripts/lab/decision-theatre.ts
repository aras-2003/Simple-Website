/** All editorial content exists before JavaScript; only the decorative world loads here. */
const root = document.querySelector<HTMLElement>('[data-theatre]');
if (root) {
  const media = window.matchMedia('(prefers-reduced-motion: reduce)');
  let dispose: (() => void) | undefined;
  let generation = 0;
  const reset = () => {
    root.classList.remove('dt-webgl');
    root.dataset['renderMode'] = media.matches ? 'reduced-motion' : 'fallback';
  };
  const start = async () => {
    const current = ++generation;
    dispose?.();
    dispose = undefined;
    reset();
    if (media.matches) return;
    try {
      const { mountTheatre } = await import('./theatre-scene');
      if (generation !== current) return;
      dispose = mountTheatre(root, reset);
    } catch {
      if (generation === current) reset();
    }
  };
  media.addEventListener('change', start);
  window.addEventListener('pagehide', () => { generation++; dispose?.(); });
  window.addEventListener('pageshow', (event) => { if (event.persisted) void start(); });
  void start();
}

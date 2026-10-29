// Event backend selection.
//   • "supabase": VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are set at build time.
//     (The anon key is a public, browser-safe key; all rules are enforced server-side.)
//   • "dev": local development only (`npm run dev`), a clearly labelled in-browser simulation.
//   • null: no event backend → event features are hidden; solo play is unaffected.

export function eventsMode() {
  const env = import.meta.env ?? {};
  if (env.VITE_SUPABASE_URL && env.VITE_SUPABASE_ANON_KEY) return 'supabase';
  if (env.DEV && env.VITE_EVENTS_DEV !== 'false') return 'dev';
  return null;
}

let apiPromise = null;
export function getApi() {
  if (!apiPromise) {
    const mode = eventsMode();
    if (mode === 'supabase') apiPromise = import('./supabaseAdapter.js').then((m) => m.createSupabaseApi(import.meta.env.VITE_SUPABASE_URL, import.meta.env.VITE_SUPABASE_ANON_KEY));
    // import.meta.env.DEV is replaced by `false` in production builds, so the simulation is not shipped.
    else if (mode === 'dev' && import.meta.env.DEV) apiPromise = import('./devAdapter.js').then((m) => m.createDevApi());
    else apiPromise = Promise.resolve(null);
  }
  return apiPromise;
}

export class ApiError extends Error {
  constructor(code, detail) {
    super(code);
    this.code = code;
    this.detail = detail;
  }
}

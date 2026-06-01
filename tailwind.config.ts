import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        paper: 'var(--paper)',
        'paper-soft': 'var(--paper-soft)',
        'paper-edge': 'var(--paper-edge)',
        surface: 'var(--surface)',
        'surface-soft': 'var(--surface-soft)',
        'border-hair': 'var(--border-hair)',
        'border-soft': 'var(--border-soft)',
        'border-ink': 'var(--border-ink)',
        ink: 'var(--ink)',
        'ink-soft': 'var(--ink-soft)',
        'ink-muted': 'var(--ink-muted)',
        'ink-faint': 'var(--ink-faint)',
        accent: 'var(--accent)',
        'accent-warm': 'var(--accent-warm)',
        'data-quake': 'var(--data-quake)',
        'data-iss': 'var(--data-iss)',
        'data-flight': 'var(--data-flight)',
        'data-weather': 'var(--data-weather)',
        'data-volcano': 'var(--data-volcano)',
        'data-fire': 'var(--data-fire)',
        'atmo-tint': 'var(--atmo-tint)',
      },
      fontFamily: {
        display: ['var(--font-display)', 'Georgia', 'serif'],
        sans: ['var(--font-sans)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-mono)', 'monospace'],
      },
      borderRadius: {
        card: 'var(--radius-card)',
        pill: 'var(--radius-pill)',
      },
      boxShadow: {
        card: 'var(--shadow-card)',
        float: 'var(--shadow-float)',
      },
      maxWidth: {
        container: 'var(--container)',
      },
      letterSpacing: {
        display: 'var(--ls-display)',
      },
    },
  },
  plugins: [],
};

export default config;

// Merge this into your tailwind.config.ts (theme.extend).
// Tokens are namespaced (acid/navy/deep/paper) so they don't clobber Tailwind's
// default color scales.
import type { Config } from 'tailwindcss';

const config: Partial<Config> = {
  theme: {
    extend: {
      colors: {
        acid: '#00FF00',   // brand green — CTAs, ampersand, highlights
        navy: '#121B54',   // primary background
        deep: '#0B1140',   // alt background / ink on green
        paper: '#F2F3FA',  // body text on navy
      },
      fontFamily: {
        // Display/body matches the reference (system Helvetica).
        display: ['"Helvetica Neue"', 'Helvetica', 'Arial', 'sans-serif'],
        // Wire --font-mono from next/font Space_Mono in layout.tsx.
        mono: ['var(--font-mono)', '"Space Mono"', 'monospace'],
      },
    },
  },
};

export default config;

import satori from 'satori';
import { Resvg } from '@resvg/resvg-js';
import sharp from 'sharp';
import fs from 'node:fs/promises';
import existsSync from 'node:fs';
import path from 'node:path';

// ── Shared System Design Tokens ─────────────────────────────────────────────
export const OG_TOKENS = {
  BG_COLOR: '#0d091a',
  BG_GRADIENT: 'radial-gradient(circle at 50% 50%, #171033 0%, #0d091a 100%)',
  PANEL_BORDER: '#231942',
  ACCENT_PURPLE: '#9f87ff',
  GLOW_PURPLE: '#c084fc',
  BORDER_ACCENT: '#7c5cff',
  TEXT_PRIMARY: '#f0ede6',
  TEXT_MUTED: '#6c6289',
  OUTER_BORDER: '12px solid #231942',
};

// ── Editable Top-Level Constants for About Page Dossier ──────────────────────
export const ABOUT_THREAT_RATING = 'CURIOUS';
export const ABOUT_LOCATION_COORDINATES = '13.0827° N / 80.2707° E';
export const ABOUT_LOCATION_NAME = 'CHENNAI, IN';

export interface OgImageOptions {
  title: string;
  type: string;
  subtitle?: string;
  date?: string;
  tags?: string[];
  outputPath: string; // e.g. "public/og/writing/blog/grid-layout-notes.png"
}

let fontBoldCache: Buffer | null = null;
let fontRegCache: Buffer | null = null;

// Native SVG Logo with Baked-in Peak-Glow SVG Filter
export const LOGO_SVG = `<svg viewBox="-10 -10 56 56" width="48" height="48" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <filter id="edgeGlow" x="-100%" y="-100%" width="300%" height="300%">
      <feGaussianBlur stdDeviation="1.5" result="blur"/>
      <feMerge>
        <feMergeNode in="blur"/>
        <feMergeNode in="SourceGraphic"/>
      </feMerge>
    </filter>
    <filter id="nodeGlow" x="-150%" y="-150%" width="400%" height="400%">
      <feGaussianBlur in="SourceGraphic" stdDeviation="2.5" result="blur1"/>
      <feGaussianBlur in="SourceGraphic" stdDeviation="5" result="blur2"/>
      <feMerge>
        <feMergeNode in="blur2"/>
        <feMergeNode in="blur1"/>
        <feMergeNode in="SourceGraphic"/>
      </feMerge>
    </filter>
  </defs>
  <line x1="6" y1="28" x2="18" y2="10" stroke="#6e55d6" stroke-width="1.5" filter="url(#edgeGlow)"/>
  <line x1="18" y1="10" x2="30" y2="28" stroke="#6e55d6" stroke-width="1.5" filter="url(#edgeGlow)"/>
  <line x1="6" y1="28" x2="30" y2="28" stroke="#6e55d6" stroke-width="1.5" filter="url(#edgeGlow)"/>
  <circle cx="6" cy="28" r="3.5" fill="#c084fc" filter="url(#nodeGlow)"/>
  <circle cx="18" cy="10" r="3.5" fill="#c084fc" filter="url(#nodeGlow)"/>
  <circle cx="30" cy="28" r="3.5" fill="#c084fc" filter="url(#nodeGlow)"/>
</svg>`;

const LOGO_BASE64 = Buffer.from(LOGO_SVG).toString('base64');

async function loadFonts() {
  if (!fontBoldCache) {
    fontBoldCache = await fs.readFile(path.resolve('src/assets/fonts/JetBrainsMono-Bold.ttf'));
  }
  if (!fontRegCache) {
    fontRegCache = await fs.readFile(path.resolve('src/assets/fonts/JetBrainsMono-Regular.ttf'));
  }
  return { fontBold: fontBoldCache, fontReg: fontRegCache };
}

// ── Reusable Component Helpers for Satori Templates ─────────────────────────

// 1. Bracket-corner Accent Elements Generator
function createBracketCorners() {
  return [
    { type: 'div', props: { style: { position: 'absolute', top: '12px', left: '14px', color: '#7c5cff', fontSize: '14px', fontFamily: 'JetBrains Mono', opacity: 0.8 }, children: '+' } },
    { type: 'div', props: { style: { position: 'absolute', top: '12px', right: '14px', color: '#7c5cff', fontSize: '14px', fontFamily: 'JetBrains Mono', opacity: 0.8 }, children: '+' } },
    { type: 'div', props: { style: { position: 'absolute', bottom: '12px', left: '14px', color: '#7c5cff', fontSize: '14px', fontFamily: 'JetBrains Mono', opacity: 0.8 }, children: '+' } },
    { type: 'div', props: { style: { position: 'absolute', bottom: '12px', right: '14px', color: '#7c5cff', fontSize: '14px', fontFamily: 'JetBrains Mono', opacity: 0.8 }, children: '+' } },
  ];
}

// 2. Status Indicator Component Renderer
function createStatusIndicator(text: string = 'ONLINE // DISPATCH READY') {
  return {
    type: 'div',
    props: {
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        fontSize: '15px',
        fontWeight: '700',
        color: '#9f87ff',
        letterSpacing: '0.08em',
      },
      children: [
        { type: 'div', props: { style: { color: '#c084fc', fontSize: '12px' }, children: '●' } },
        { type: 'div', props: { style: { display: 'flex' }, children: text } },
      ],
    },
  };
}

// 3. Hairline Divider Component Renderer
function createHairlineDivider() {
  return {
    type: 'div',
    props: {
      style: {
        width: '100%',
        height: '1px',
        backgroundColor: '#231942',
      },
    },
  };
}

// 4. Header Bar Renderer
function createHeaderBar(statusText: string, typeBadge?: string) {
  return {
    type: 'div',
    props: {
      style: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
      },
      children: [
        {
          type: 'div',
          props: {
            style: { display: 'flex', alignItems: 'center', gap: '16px' },
            children: [
              {
                type: 'img',
                props: {
                  src: `data:image/svg+xml;base64,${LOGO_BASE64}`,
                  width: 80,
                  height: 80,
                  style: { width: '80px', height: '80px' },
                },
              },
              {
                type: 'div',
                props: {
                  style: { display: 'flex', flexDirection: 'column', gap: '4px' },
                  children: [
                    {
                      type: 'div',
                      props: {
                        style: { fontSize: '26px', fontWeight: '700', color: '#9f87ff', letterSpacing: '0.05em' },
                        children: 'MANIKANDANX0',
                      },
                    },
                    createStatusIndicator(statusText),
                  ],
                },
              },
            ],
          },
        },
        typeBadge
          ? {
              type: 'div',
              props: {
                style: {
                  display: 'flex',
                  padding: '6px 16px',
                  backgroundColor: '#231942',
                  border: '1px solid #7c5cff',
                  borderRadius: '4px',
                  fontSize: '16px',
                  fontWeight: '700',
                  color: '#9f87ff',
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                },
                children: typeBadge,
              },
            }
          : null,
      ].filter(Boolean),
    },
  };
}

// ── Multi-Format File Saver (PNG, SVG, WebP) ─────────────────────────────────
async function saveMultiFormatOutput(svgStr: string, relPath: string): Promise<string> {
  const pngPublicPath = path.resolve('public/og', relPath);
  const svgPublicPath = path.resolve('public/og-src', relPath.replace(/\.png$/, '.svg'));
  const webpPublicPath = path.resolve('public/og-webp', relPath.replace(/\.png$/, '.webp'));

  const resvg = new Resvg(svgStr, { fitTo: { mode: 'width', value: 1200 } });
  const pngData = resvg.render().asPng();
  const webpData = await sharp(pngData).webp({ quality: 90 }).toBuffer();

  // Save to public/
  await fs.mkdir(path.dirname(pngPublicPath), { recursive: true });
  await fs.writeFile(pngPublicPath, pngData);

  await fs.mkdir(path.dirname(svgPublicPath), { recursive: true });
  await fs.writeFile(svgPublicPath, svgStr);

  await fs.mkdir(path.dirname(webpPublicPath), { recursive: true });
  await fs.writeFile(webpPublicPath, webpData);

  // Mirror to dist/ if dist directory exists
  if (existsSync.existsSync(path.resolve('dist'))) {
    const pngDistPath = path.resolve('dist/og', relPath);
    const svgDistPath = path.resolve('dist/og-src', relPath.replace(/\.png$/, '.svg'));
    const webpDistPath = path.resolve('dist/og-webp', relPath.replace(/\.png$/, '.webp'));

    await fs.mkdir(path.dirname(pngDistPath), { recursive: true });
    await fs.writeFile(pngDistPath, pngData);

    await fs.mkdir(path.dirname(svgDistPath), { recursive: true });
    await fs.writeFile(svgDistPath, svgStr);

    await fs.mkdir(path.dirname(webpDistPath), { recursive: true });
    await fs.writeFile(webpDistPath, webpData);
  }

  return pngPublicPath;
}

// Fallback image generator
async function ensureDefaultOgImage(): Promise<string> {
  const defaultRelPath = 'default.png';
  const fullPath = path.resolve('public/og', defaultRelPath);
  try {
    if (!existsSync.existsSync(fullPath)) {
      const { fontBold, fontReg } = await loadFonts();
      const svg = await satori(
        {
          type: 'div',
          props: {
            style: {
              height: '100%',
              width: '100%',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              backgroundColor: OG_TOKENS.BG_COLOR,
              backgroundImage: OG_TOKENS.BG_GRADIENT,
              color: OG_TOKENS.TEXT_PRIMARY,
              padding: '50px',
              fontFamily: 'JetBrains Mono',
              boxSizing: 'border-box',
              border: OG_TOKENS.OUTER_BORDER,
              position: 'relative',
            },
            children: [
              ...createBracketCorners(),
              createHeaderBar('ONLINE // DISPATCH READY', 'PORTFOLIO'),
              {
                type: 'div',
                props: {
                  style: { display: 'flex', flexDirection: 'column', gap: '12px' },
                  children: [
                    { type: 'div', props: { style: { fontSize: '18px', color: OG_TOKENS.TEXT_MUTED }, children: '// MANIKANDAN // RECONNAISSANCE & SYSTEMS' } },
                    { type: 'div', props: { style: { fontSize: '44px', fontWeight: '700', color: '#ffffff' }, children: "Mani's Portfolio & Writing" } },
                  ],
                },
              },
              {
                type: 'div',
                props: {
                  style: { display: 'flex', justifyContent: 'space-between', borderTop: '1px solid #231942', paddingTop: '16px', fontSize: '16px', color: OG_TOKENS.TEXT_MUTED },
                  children: [
                    { type: 'div', props: { style: { display: 'flex' }, children: '// SYSTEM READY' } },
                    { type: 'div', props: { style: { display: 'flex', color: OG_TOKENS.ACCENT_PURPLE }, children: 'https://manikandanx0.tech' } },
                  ],
                },
              },
            ],
          },
        },
        {
          width: 1200,
          height: 630,
          fonts: [
            { name: 'JetBrains Mono', data: fontBold, weight: 700, style: 'normal' },
            { name: 'JetBrains Mono', data: fontReg, weight: 400, style: 'normal' },
          ],
        }
      );
      await saveMultiFormatOutput(svg, defaultRelPath);
    }
  } catch (err) {
    console.warn('[OG Image] Failed to create default fallback image:', err);
  }
  return fullPath;
}

// ─────────────────────────────────────────────────────────────────────────────
// 1. SLUG-PAGE OG IMAGE GENERATOR (Retrofitted Template)
// ─────────────────────────────────────────────────────────────────────────────
export async function generateOgImage(options: OgImageOptions): Promise<string> {
  const { title, type, subtitle, date, tags, outputPath } = options;
  const fullPublicPath = path.resolve(outputPath);
  const relPath = path.relative(path.resolve('public/og'), fullPublicPath);

  // Caching check: skip regeneration if PNG exists
  if (
    existsSync.existsSync(fullPublicPath) &&
    existsSync.existsSync(path.resolve('public/og-src', relPath.replace(/\.png$/, '.svg'))) &&
    existsSync.existsSync(path.resolve('public/og-webp', relPath.replace(/\.png$/, '.webp')))
  ) {
    return fullPublicPath;
  }

  try {
    const { fontBold, fontReg } = await loadFonts();

    const element = {
      type: 'div',
      props: {
        style: {
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          backgroundColor: OG_TOKENS.BG_COLOR,
          backgroundImage: OG_TOKENS.BG_GRADIENT,
          color: OG_TOKENS.TEXT_PRIMARY,
          padding: '48px 56px',
          fontFamily: 'JetBrains Mono',
          boxSizing: 'border-box',
          border: OG_TOKENS.OUTER_BORDER,
          position: 'relative',
        },
        children: [
          // Bracket Corner Ticks
          ...createBracketCorners(),

          // Top Header Bar
          createHeaderBar('ONLINE // DISPATCH READY', type),

          // Main HUD Content Box
          {
            type: 'div',
            props: {
              style: {
                display: 'flex',
                flexDirection: 'column',
                gap: '14px',
                border: '1px solid #231942',
                backgroundColor: 'rgba(10, 10, 20, 0.75)',
                padding: '28px 32px',
                borderRadius: '4px',
                marginTop: 'auto',
                marginBottom: 'auto',
              },
              children: [
                {
                  type: 'div',
                  props: {
                    style: {
                      fontSize: '15px',
                      color: OG_TOKENS.ACCENT_PURPLE,
                      letterSpacing: '0.12em',
                      fontWeight: '700',
                    },
                    children: `// ${type.toUpperCase()} :: TRANSMISSION`,
                  },
                },
                {
                  type: 'div',
                  props: {
                    style: {
                      fontSize: '44px',
                      fontWeight: '700',
                      lineHeight: '1.2',
                      color: '#ffffff',
                      letterSpacing: '-0.02em',
                    },
                    children: title,
                  },
                },
                subtitle
                  ? {
                      type: 'div',
                      props: {
                        style: {
                          fontSize: '20px',
                          color: '#a099c0',
                          lineHeight: '1.4',
                          maxHeight: '56px',
                          overflow: 'hidden',
                        },
                        children: subtitle,
                      },
                    }
                  : null,
                // Telemetry / Tag Metadata Row
                date || (tags && tags.length > 0)
                  ? {
                      type: 'div',
                      props: {
                        style: {
                          display: 'flex',
                          alignItems: 'center',
                          gap: '12px',
                          paddingTop: '8px',
                          fontSize: '15px',
                          color: OG_TOKENS.TEXT_MUTED,
                        },
                        children: [
                          date ? { type: 'div', props: { style: { display: 'flex' }, children: `// DATE: ${date}` } } : null,
                          tags && tags.length > 0
                            ? {
                                type: 'div',
                                props: {
                                  style: { display: 'flex', gap: '6px', marginLeft: 'auto' },
                                  children: tags.slice(0, 3).map((tag) => ({
                                    type: 'div',
                                    props: {
                                      style: {
                                        padding: '2px 8px',
                                        backgroundColor: '#231942',
                                        border: '1px solid #7c5cff',
                                        borderRadius: '3px',
                                        fontSize: '13px',
                                        color: OG_TOKENS.ACCENT_PURPLE,
                                      },
                                      children: tag,
                                    },
                                  })),
                                },
                              }
                            : null,
                        ].filter(Boolean),
                      },
                    }
                  : null,
              ].filter(Boolean),
            },
          },

          // Footer Bar
          {
            type: 'div',
            props: {
              style: {
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                width: '100%',
                borderTop: '1px solid #231942',
                paddingTop: '16px',
                fontSize: '16px',
                color: OG_TOKENS.TEXT_MUTED,
              },
              children: [
                { type: 'div', props: { style: { display: 'flex' }, children: '// SYS_ID: MANI-2026-DX' } },
                { type: 'div', props: { style: { display: 'flex', color: OG_TOKENS.ACCENT_PURPLE }, children: 'https://manikandanx0.tech' } },
              ],
            },
          },
        ],
      },
    };

    const svgStr = await satori(element, {
      width: 1200,
      height: 630,
      fonts: [
        { name: 'JetBrains Mono', data: fontBold, weight: 700, style: 'normal' },
        { name: 'JetBrains Mono', data: fontReg, weight: 400, style: 'normal' },
      ],
    });

    await saveMultiFormatOutput(svgStr, relPath);
    return fullPublicPath;
  } catch (err) {
    console.warn(`[OG Image Warning] Failed generating card for "${title}":`, err);
    const defaultPath = await ensureDefaultOgImage();
    try {
      await fs.mkdir(path.dirname(fullPublicPath), { recursive: true });
      await fs.copyFile(defaultPath, fullPublicPath);
    } catch (copyErr) {
      console.warn(`[OG Image Warning] Failed to copy fallback image:`, copyErr);
    }
    return fullPublicPath;
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// 2. HOME / INDEX TEMPLATE
// ─────────────────────────────────────────────────────────────────────────────
export async function generateHomeOgImage(): Promise<string> {
  const relPath = 'home.png';
  const fullPublicPath = path.resolve('public/og', relPath);

  try {
    const { fontBold, fontReg } = await loadFonts();

    const element = {
      type: 'div',
      props: {
        style: {
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          backgroundColor: OG_TOKENS.BG_COLOR,
          backgroundImage: OG_TOKENS.BG_GRADIENT,
          color: OG_TOKENS.TEXT_PRIMARY,
          padding: '44px 50px',
          fontFamily: 'JetBrains Mono',
          boxSizing: 'border-box',
          border: OG_TOKENS.OUTER_BORDER,
          position: 'relative',
        },
        children: [
          ...createBracketCorners(),

          // Top Header Bar
          createHeaderBar('ONLINE // DISPATCH READY', 'PORTFOLIO'),

          // Main Hero Grid Container
          {
            type: 'div',
            props: {
              style: {
                display: 'flex',
                gap: '24px',
                width: '100%',
                alignItems: 'stretch',
                marginTop: 'auto',
                marginBottom: 'auto',
              },
              children: [
                // Left Hero Main Content Panel
                {
                  type: 'div',
                  props: {
                    style: {
                      display: 'flex',
                      flexDirection: 'column',
                      flex: 1,
                      backgroundColor: 'rgba(10, 10, 20, 0.75)',
                      border: '1px solid #231942',
                      padding: '24px 28px',
                      borderRadius: '4px',
                      justifyContent: 'space-between',
                    },
                    children: [
                      {
                        type: 'div',
                        props: {
                          style: { fontSize: '14px', color: OG_TOKENS.TEXT_MUTED, letterSpacing: '0.1em' },
                          children: '// SYS_ID: MANI-2026-DX · ● ONLINE // DISPATCH READY',
                        },
                      },
                      {
                        type: 'div',
                        props: {
                          style: { display: 'flex', flexDirection: 'column', gap: '6px', margin: '12px 0' },
                          children: [
                            { type: 'div', props: { style: { fontSize: '42px', fontWeight: '700', color: '#ffffff', lineHeight: '1.1' }, children: 'BUILDING THINGS.' } },
                            { type: 'div', props: { style: { fontSize: '42px', fontWeight: '700', color: '#c084fc', lineHeight: '1.1' }, children: 'BREAKING THINGS.' } },
                          ],
                        },
                      },
                      {
                        type: 'div',
                        props: {
                          style: { fontSize: '17px', color: '#a099c0', lineHeight: '1.45' },
                          children: 'AI & Data Science student specializing in practical machine learning, systems architecture, and security research.',
                        },
                      },
                    ],
                  },
                },

                // Right Telemetry Status Panel
                {
                  type: 'div',
                  props: {
                    style: {
                      display: 'flex',
                      flexDirection: 'column',
                      width: '320px',
                      backgroundColor: 'rgba(10, 10, 20, 0.85)',
                      border: '1px solid #231942',
                      padding: '20px 22px',
                      borderRadius: '4px',
                      gap: '14px',
                    },
                    children: [
                      { type: 'div', props: { style: { fontSize: '13px', color: OG_TOKENS.TEXT_MUTED, letterSpacing: '0.15em' }, children: 'TELEMETRY' } },
                      createHairlineDivider(),
                      {
                        type: 'div',
                        props: {
                          style: { display: 'flex', flexDirection: 'column', gap: '4px' },
                          children: [
                            { type: 'div', props: { style: { fontSize: '12px', color: OG_TOKENS.TEXT_MUTED }, children: 'STATUS' } },
                            { type: 'div', props: { style: { fontSize: '15px', color: '#c084fc', fontWeight: '700' }, children: '● ACTIVE' } },
                          ],
                        },
                      },
                      {
                        type: 'div',
                        props: {
                          style: { display: 'flex', flexDirection: 'column', gap: '4px' },
                          children: [
                            { type: 'div', props: { style: { fontSize: '12px', color: OG_TOKENS.TEXT_MUTED }, children: 'DOMAINS' } },
                            {
                              type: 'div',
                              props: {
                                style: { display: 'flex', gap: '6px', flexWrap: 'wrap' },
                                children: ['AI / DS', 'SECURITY', 'SYSTEMS'].map((dom) => ({
                                  type: 'div',
                                  props: {
                                    style: {
                                      padding: '2px 8px',
                                      backgroundColor: '#231942',
                                      border: '1px solid #7c5cff',
                                      borderRadius: '3px',
                                      fontSize: '12px',
                                      color: OG_TOKENS.ACCENT_PURPLE,
                                      fontWeight: '700',
                                    },
                                    children: dom,
                                  },
                                })),
                              },
                            },
                          ],
                        },
                      },
                      createHairlineDivider(),
                      {
                        type: 'div',
                        props: {
                          style: { display: 'flex', justifyContent: 'space-between', gap: '12px' },
                          children: [
                            {
                              type: 'div',
                              props: {
                                style: { display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1, backgroundColor: '#171033', padding: '8px', borderRadius: '3px' },
                                children: [
                                  { type: 'div', props: { style: { fontSize: '24px', fontWeight: '700', color: '#ffffff' }, children: '01' } },
                                  { type: 'div', props: { style: { fontSize: '11px', color: OG_TOKENS.TEXT_MUTED }, children: 'PROJECTS' } },
                                ],
                              },
                            },
                            {
                              type: 'div',
                              props: {
                                style: { display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1, backgroundColor: '#171033', padding: '8px', borderRadius: '3px' },
                                children: [
                                  { type: 'div', props: { style: { fontSize: '24px', fontWeight: '700', color: '#ffffff' }, children: '03' } },
                                  { type: 'div', props: { style: { fontSize: '11px', color: OG_TOKENS.TEXT_MUTED }, children: 'LOGS' } },
                                ],
                              },
                            },
                          ],
                        },
                      },
                      createHairlineDivider(),
                      {
                        type: 'div',
                        props: {
                          style: { fontSize: '12px', color: OG_TOKENS.ACCENT_PURPLE, letterSpacing: '0.1em' },
                          children: 'LEVEL 3 // AUTHORIZED',
                        },
                      },
                    ],
                  },
                },
              ],
            },
          },

          // Footer Bar
          {
            type: 'div',
            props: {
              style: {
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                width: '100%',
                borderTop: '1px solid #231942',
                paddingTop: '14px',
                fontSize: '15px',
                color: OG_TOKENS.TEXT_MUTED,
              },
              children: [
                { type: 'div', props: { style: { display: 'flex' }, children: `LOCATION: ${ABOUT_LOCATION_NAME}` } },
                { type: 'div', props: { style: { display: 'flex', color: OG_TOKENS.ACCENT_PURPLE }, children: ABOUT_LOCATION_COORDINATES } },
              ],
            },
          },
        ],
      },
    };

    const svgStr = await satori(element, {
      width: 1200,
      height: 630,
      fonts: [
        { name: 'JetBrains Mono', data: fontBold, weight: 700, style: 'normal' },
        { name: 'JetBrains Mono', data: fontReg, weight: 400, style: 'normal' },
      ],
    });

    await saveMultiFormatOutput(svgStr, relPath);
    return fullPublicPath;
  } catch (err) {
    console.warn('[OG Image Warning] Failed generating home card:', err);
    return ensureDefaultOgImage();
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// 3. WRITING INDEX TEMPLATE
// ─────────────────────────────────────────────────────────────────────────────
export async function generateWritingIndexOgImage(): Promise<string> {
  const relPath = 'writing-index.png';
  const fullPublicPath = path.resolve('public/og', relPath);

  try {
    const { fontBold, fontReg } = await loadFonts();

    const element = {
      type: 'div',
      props: {
        style: {
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          backgroundColor: OG_TOKENS.BG_COLOR,
          backgroundImage: OG_TOKENS.BG_GRADIENT,
          color: OG_TOKENS.TEXT_PRIMARY,
          padding: '44px 50px',
          fontFamily: 'JetBrains Mono',
          boxSizing: 'border-box',
          border: OG_TOKENS.OUTER_BORDER,
          position: 'relative',
        },
        children: [
          ...createBracketCorners(),

          // Top Header Bar
          createHeaderBar('LOG FEED // ACTIVE', 'INDEX'),

          // Main Content Section
          {
            type: 'div',
            props: {
              style: {
                display: 'flex',
                flexDirection: 'column',
                gap: '16px',
                marginTop: 'auto',
                marginBottom: 'auto',
              },
              children: [
                {
                  type: 'div',
                  props: {
                    style: {
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '8px',
                    },
                    children: [
                      { type: 'div', props: { style: { fontSize: '15px', color: OG_TOKENS.ACCENT_PURPLE, letterSpacing: '0.12em', fontWeight: '700' }, children: '// TRANSMISSION LOG' } },
                      { type: 'div', props: { style: { fontSize: '42px', fontWeight: '700', color: '#ffffff' }, children: 'WRITING & RECONNAISSANCE' } },
                      { type: 'div', props: { style: { fontSize: '18px', color: '#a099c0' }, children: 'Technical writeups, security lab analysis, and engineering notes.' } },
                    ],
                  },
                },

                // Decorative Log Feed Rows (UI texture, no real post titles)
                {
                  type: 'div',
                  props: {
                    style: {
                      display: 'flex',
                      flexDirection: 'column',
                      backgroundColor: 'rgba(10, 10, 20, 0.85)',
                      border: '1px solid #231942',
                      borderRadius: '4px',
                      overflow: 'hidden',
                    },
                    children: [
                      {
                        type: 'div',
                        props: {
                          style: {
                            display: 'flex',
                            justifyContent: 'space-between',
                            padding: '12px 18px',
                            borderBottom: '1px solid #231942',
                            fontSize: '15px',
                            color: '#6c6289',
                          },
                          children: [
                            { type: 'div', props: { style: { display: 'flex' }, children: 'LOG_ENTRY_01 // TRANSMISSIONS' } },
                            { type: 'div', props: { style: { display: 'flex', color: OG_TOKENS.ACCENT_PURPLE }, children: '// BLOG' } },
                          ],
                        },
                      },
                      {
                        type: 'div',
                        props: {
                          style: {
                            display: 'flex',
                            justifyContent: 'space-between',
                            padding: '12px 18px',
                            borderBottom: '1px solid #231942',
                            fontSize: '15px',
                            color: '#6c6289',
                          },
                          children: [
                            { type: 'div', props: { style: { display: 'flex' }, children: 'LOG_ENTRY_02 // SECURITY_RESEARCH' } },
                            { type: 'div', props: { style: { display: 'flex', color: OG_TOKENS.ACCENT_PURPLE }, children: '// CTF' } },
                          ],
                        },
                      },
                      {
                        type: 'div',
                        props: {
                          style: {
                            display: 'flex',
                            justifyContent: 'space-between',
                            padding: '12px 18px',
                            fontSize: '15px',
                            color: '#6c6289',
                          },
                          children: [
                            { type: 'div', props: { style: { display: 'flex' }, children: 'LOG_ENTRY_03 // ALGO_SYSTEMS' } },
                            { type: 'div', props: { style: { display: 'flex', color: OG_TOKENS.ACCENT_PURPLE }, children: '// LEETCODE' } },
                          ],
                        },
                      },
                    ],
                  },
                },
              ],
            },
          },

          // Footer Bar
          {
            type: 'div',
            props: {
              style: {
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                width: '100%',
                borderTop: '1px solid #231942',
                paddingTop: '14px',
                fontSize: '15px',
                color: OG_TOKENS.TEXT_MUTED,
              },
              children: [
                { type: 'div', props: { style: { display: 'flex' }, children: '// FEED STATUS: RECORDING' } },
                { type: 'div', props: { style: { display: 'flex', color: OG_TOKENS.ACCENT_PURPLE }, children: 'https://manikandanx0.tech/writing' } },
              ],
            },
          },
        ],
      },
    };

    const svgStr = await satori(element, {
      width: 1200,
      height: 630,
      fonts: [
        { name: 'JetBrains Mono', data: fontBold, weight: 700, style: 'normal' },
        { name: 'JetBrains Mono', data: fontReg, weight: 400, style: 'normal' },
      ],
    });

    await saveMultiFormatOutput(svgStr, relPath);
    return fullPublicPath;
  } catch (err) {
    console.warn('[OG Image Warning] Failed generating writing index card:', err);
    return ensureDefaultOgImage();
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// 4. WORKS / PROJECTS INDEX TEMPLATE
// ─────────────────────────────────────────────────────────────────────────────
export async function generateWorksIndexOgImage(): Promise<string> {
  const relPath = 'works-index.png';
  const fullPublicPath = path.resolve('public/og', relPath);

  try {
    const { fontBold, fontReg } = await loadFonts();

    const element = {
      type: 'div',
      props: {
        style: {
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          backgroundColor: OG_TOKENS.BG_COLOR,
          backgroundImage: OG_TOKENS.BG_GRADIENT,
          color: OG_TOKENS.TEXT_PRIMARY,
          padding: '44px 50px',
          fontFamily: 'JetBrains Mono',
          boxSizing: 'border-box',
          border: OG_TOKENS.OUTER_BORDER,
          position: 'relative',
        },
        children: [
          ...createBracketCorners(),

          // Top Header Bar
          createHeaderBar('OP-REGISTRY // ONLINE', 'WORKS'),

          // Main Section
          {
            type: 'div',
            props: {
              style: {
                display: 'flex',
                flexDirection: 'column',
                gap: '16px',
                marginTop: 'auto',
                marginBottom: 'auto',
              },
              children: [
                {
                  type: 'div',
                  props: {
                    style: {
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '8px',
                    },
                    children: [
                      { type: 'div', props: { style: { fontSize: '15px', color: OG_TOKENS.ACCENT_PURPLE, letterSpacing: '0.12em', fontWeight: '700' }, children: '// OP-REGISTRY // FEATURED OPERATIONS' } },
                      { type: 'div', props: { style: { fontSize: '42px', fontWeight: '700', color: '#ffffff' }, children: 'PROJECTS & SYSTEMS' } },
                      { type: 'div', props: { style: { fontSize: '18px', color: '#a099c0' }, children: 'Open source tools, security prototypes, and interactive web applications.' } },
                    ],
                  },
                },

                // Featured Operation Panel (Decorative HUD Registry - no hardcoded real project names)
                {
                  type: 'div',
                  props: {
                    style: {
                      display: 'flex',
                      flexDirection: 'column',
                      backgroundColor: 'rgba(10, 10, 20, 0.85)',
                      border: '1px solid #231942',
                      borderRadius: '4px',
                      padding: '20px 24px',
                      gap: '12px',
                    },
                    children: [
                      {
                        type: 'div',
                        props: {
                          style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
                          children: [
                            { type: 'div', props: { style: { fontSize: '14px', color: OG_TOKENS.ACCENT_PURPLE, fontWeight: '700' }, children: 'OP_SYSTEMS // REGISTRY_MAP' } },
                            {
                              type: 'div',
                              props: {
                                style: { display: 'flex', gap: '6px' },
                                children: ['AI / DS', 'SECURITY', 'SYSTEMS'].map((domain) => ({
                                  type: 'div',
                                  props: {
                                    style: {
                                      padding: '2px 8px',
                                      backgroundColor: '#231942',
                                      border: '1px solid #7c5cff',
                                      borderRadius: '3px',
                                      fontSize: '12px',
                                      color: OG_TOKENS.ACCENT_PURPLE,
                                      fontWeight: '700',
                                    },
                                    children: domain,
                                  },
                                })),
                              },
                            },
                          ],
                        },
                      },
                      createHairlineDivider(),
                      {
                        type: 'div',
                        props: {
                          style: { fontSize: '15px', color: '#6c6289', lineHeight: '1.4' },
                          children: '[ SYSTEM REGISTRY :: ACTIVE ENGINEERING & SECURITY PROJECTS ]',
                        },
                      },
                    ],
                  },
                },
              ],
            },
          },

          // Footer Bar
          {
            type: 'div',
            props: {
              style: {
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                width: '100%',
                borderTop: '1px solid #231942',
                paddingTop: '14px',
                fontSize: '15px',
                color: OG_TOKENS.TEXT_MUTED,
              },
              children: [
                { type: 'div', props: { style: { display: 'flex' }, children: '// OPERATIONS CLEARANCE: LEVEL 3' } },
                { type: 'div', props: { style: { display: 'flex', color: OG_TOKENS.ACCENT_PURPLE }, children: 'https://manikandanx0.tech/projects' } },
              ],
            },
          },
        ],
      },
    };

    const svgStr = await satori(element, {
      width: 1200,
      height: 630,
      fonts: [
        { name: 'JetBrains Mono', data: fontBold, weight: 700, style: 'normal' },
        { name: 'JetBrains Mono', data: fontReg, weight: 400, style: 'normal' },
      ],
    });

    await saveMultiFormatOutput(svgStr, relPath);
    return fullPublicPath;
  } catch (err) {
    console.warn('[OG Image Warning] Failed generating works index card:', err);
    return ensureDefaultOgImage();
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// 5. ABOUT PAGE TEMPLATE (Dossier Format)
// ─────────────────────────────────────────────────────────────────────────────
export async function generateAboutOgImage(): Promise<string> {
  const relPath = 'about.png';
  const fullPublicPath = path.resolve('public/og', relPath);

  try {
    const { fontBold, fontReg } = await loadFonts();

    const element = {
      type: 'div',
      props: {
        style: {
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          backgroundColor: OG_TOKENS.BG_COLOR,
          backgroundImage: OG_TOKENS.BG_GRADIENT,
          color: OG_TOKENS.TEXT_PRIMARY,
          padding: '44px 50px',
          fontFamily: 'JetBrains Mono',
          boxSizing: 'border-box',
          border: OG_TOKENS.OUTER_BORDER,
          position: 'relative',
        },
        children: [
          ...createBracketCorners(),

          // Top Header Bar
          createHeaderBar('DOSSIER // ACTIVE', 'ABOUT'),

          // Dossier Body Block
          {
            type: 'div',
            props: {
              style: {
                display: 'flex',
                flexDirection: 'column',
                gap: '16px',
                backgroundColor: 'rgba(10, 10, 20, 0.85)',
                border: '1px solid #231942',
                borderRadius: '4px',
                padding: '24px 28px',
                marginTop: 'auto',
                marginBottom: 'auto',
              },
              children: [
                {
                  type: 'div',
                  props: {
                    style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
                    children: [
                      { type: 'div', props: { style: { fontSize: '14px', color: OG_TOKENS.ACCENT_PURPLE, fontWeight: '700' }, children: '// SUBJECT DOSSIER // EXECUTIVE BRIEFING' } },
                      {
                        type: 'div',
                        props: {
                          style: {
                            padding: '3px 10px',
                            backgroundColor: '#231942',
                            border: '1px solid #7c5cff',
                            borderRadius: '3px',
                            fontSize: '12px',
                            color: OG_TOKENS.ACCENT_PURPLE,
                            fontWeight: '700',
                          },
                          children: 'LEVEL 3 // AUTHORIZED',
                        },
                      },
                    ],
                  },
                },
                {
                  type: 'div',
                  props: {
                    style: { fontSize: '42px', fontWeight: '700', color: '#ffffff' },
                    children: 'TARGET ANALYSIS',
                  },
                },
                createHairlineDivider(),
                {
                  type: 'div',
                  props: {
                    style: { display: 'flex', justifyContent: 'space-between', gap: '16px' },
                    children: [
                      {
                        type: 'div',
                        props: {
                          style: { display: 'flex', flexDirection: 'column', gap: '4px' },
                          children: [
                            { type: 'div', props: { style: { fontSize: '12px', color: OG_TOKENS.TEXT_MUTED }, children: 'CODENAME' } },
                            { type: 'div', props: { style: { fontSize: '16px', color: '#ffffff', fontWeight: '700' }, children: 'MANI' } },
                          ],
                        },
                      },
                      {
                        type: 'div',
                        props: {
                          style: { display: 'flex', flexDirection: 'column', gap: '4px' },
                          children: [
                            { type: 'div', props: { style: { fontSize: '12px', color: OG_TOKENS.TEXT_MUTED }, children: 'SPEC' } },
                            { type: 'div', props: { style: { fontSize: '16px', color: '#ffffff', fontWeight: '700' }, children: 'AI & DATA SCIENCE' } },
                          ],
                        },
                      },
                      {
                        type: 'div',
                        props: {
                          style: { display: 'flex', flexDirection: 'column', gap: '4px' },
                          children: [
                            { type: 'div', props: { style: { fontSize: '12px', color: OG_TOKENS.TEXT_MUTED }, children: 'THREAT RATING' } },
                            { type: 'div', props: { style: { fontSize: '16px', color: OG_TOKENS.ACCENT_PURPLE, fontWeight: '700' }, children: ABOUT_THREAT_RATING } },
                          ],
                        },
                      },
                      {
                        type: 'div',
                        props: {
                          style: { display: 'flex', flexDirection: 'column', gap: '4px' },
                          children: [
                            { type: 'div', props: { style: { fontSize: '12px', color: OG_TOKENS.TEXT_MUTED }, children: 'STATUS' } },
                            { type: 'div', props: { style: { fontSize: '16px', color: '#c084fc', fontWeight: '700' }, children: '● ACTIVE DEPLOYMENT' } },
                          ],
                        },
                      },
                    ],
                  },
                },
                createHairlineDivider(),
                {
                  type: 'div',
                  props: {
                    style: { fontSize: '16px', color: '#a099c0', lineHeight: '1.45' },
                    children: 'Subject builds digital architectures, tests system boundaries, and documents security findings.',
                  },
                },
              ],
            },
          },

          // Footer Bar
          {
            type: 'div',
            props: {
              style: {
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                width: '100%',
                borderTop: '1px solid #231942',
                paddingTop: '14px',
                fontSize: '15px',
                color: OG_TOKENS.TEXT_MUTED,
              },
              children: [
                { type: 'div', props: { style: { display: 'flex' }, children: `LOCATION: ${ABOUT_LOCATION_NAME} · ${ABOUT_LOCATION_COORDINATES}` } },
                { type: 'div', props: { style: { display: 'flex', color: OG_TOKENS.ACCENT_PURPLE }, children: 'https://manikandanx0.tech/about' } },
              ],
            },
          },
        ],
      },
    };

    const svgStr = await satori(element, {
      width: 1200,
      height: 630,
      fonts: [
        { name: 'JetBrains Mono', data: fontBold, weight: 700, style: 'normal' },
        { name: 'JetBrains Mono', data: fontReg, weight: 400, style: 'normal' },
      ],
    });

    await saveMultiFormatOutput(svgStr, relPath);
    return fullPublicPath;
  } catch (err) {
    console.warn('[OG Image Warning] Failed generating about card:', err);
    return ensureDefaultOgImage();
  }
}

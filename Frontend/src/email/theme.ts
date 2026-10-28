// Prisim Wellness email design tokens — change colours/fonts here and every template updates.

export const colors = {
  canvas: '#E8EDF3', // outer background
  paper: '#FAFBFD', // email body
  ink: '#0E2236', // deep navy: headlines, buttons, footer
  body: '#4A5868', // paragraph text
  muted: '#7D8A99', // small print, labels
  accent: '#1B8EC4', // brand blue: eyebrows, rules, links, numerals
  accentLight: '#7CC6EC', // blue on dark backgrounds
  line: '#DAE3EC', // hairlines
  panel: '#EEF4F9', // soft panels
  footerLine: '#22384F',
  footerDot: '#3A5068',
  footerText: '#8797AA',
} as const;

export const fonts = {
  serif: "'Cormorant Garamond', 'Playfair Display', Georgia, 'Times New Roman', serif",
  sans: "'Jost', 'Helvetica Neue', Helvetica, Arial, sans-serif",
} as const;

export const brand: { name: string; siteUrl: string; accountUrl: string; supportEmail: string } = {
  name: 'Prisim Wellness',
  siteUrl: 'https://prisimwellness.com/',
  accountUrl: 'https://prisimwellness.com/account',
  supportEmail: 'info@prisimwellness.com',
};

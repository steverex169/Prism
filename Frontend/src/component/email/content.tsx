import * as React from 'react';
import { brand, colors, fonts } from '../../email/theme';
import { Row } from './Table';

export const linkStyle: React.CSSProperties = { color: colors.accent, textDecoration: 'underline' };

/** Small tracked uppercase label in brand blue. */
export function Label({ children, color = colors.accent }: { children: React.ReactNode; color?: string }) {
  return (
    <div
      className="sans"
      style={{ fontFamily: fonts.sans, fontSize: 10, lineHeight: '14px', letterSpacing: 3, color, textTransform: 'uppercase' }}
    >
      {children}
    </div>
  );
}

export interface HeroProps {
  eyebrow: string;
  /** Use <br /> for the intended two-line break. */
  headline: React.ReactNode;
  paragraphs: React.ReactNode[];
}

/** Centered eyebrow + serif headline + intro paragraphs. */
export function Hero({ eyebrow, headline, paragraphs }: HeroProps) {
  return (
    <Row align="center" className="px" style={{ padding: '44px 64px 0', textAlign: 'center' }}>
      <div
        className="sans"
        style={{ fontFamily: fonts.sans, fontSize: 10, lineHeight: '10px', letterSpacing: 4, color: colors.accent, textTransform: 'uppercase' }}
      >
        {eyebrow}
      </div>
      <h1
        className="h1"
        style={{ margin: '20px 0 24px', fontFamily: fonts.serif, fontSize: 40, lineHeight: '46px', fontWeight: 400, color: colors.ink }}
      >
        {headline}
      </h1>
      {paragraphs.map((p, i) => (
        <p key={i} className="sans" style={{ margin: '0 0 18px', fontFamily: fonts.sans, fontSize: 15, lineHeight: '26px', color: colors.body }}>
          {p}
        </p>
      ))}
    </Row>
  );
}

/** "Questions? Simply reply…" line, used above the sign-off. */
export function HelpLine({ supportEmail = brand.supportEmail }: { supportEmail?: string }) {
  return (
    <div className="sans" style={{ fontFamily: fonts.sans, fontSize: 13, lineHeight: '22px', color: colors.body, paddingBottom: 30 }}>
      Questions? Simply reply to this email or write to{' '}
      <a href={`mailto:${supportEmail}`} style={linkStyle}>
        {supportEmail}
      </a>
      .
    </div>
  );
}

/** "With care, The Prisim Wellness Team". Optional content (e.g. HelpLine) above it. */
export function Signoff({ children }: { children?: React.ReactNode }) {
  return (
    <Row align="center" className="px" style={{ padding: '48px 64px 56px', textAlign: 'center' }}>
      {children}
      <div style={{ fontFamily: fonts.serif, fontSize: 20, lineHeight: '26px', fontStyle: 'italic', color: colors.ink }}>With care,</div>
      <div
        className="sans"
        style={{ fontFamily: fonts.sans, fontSize: 10, letterSpacing: 4, color: colors.muted, textTransform: 'uppercase', paddingTop: 8 }}
      >
        The {brand.name} Team
      </div>
    </Row>
  );
}

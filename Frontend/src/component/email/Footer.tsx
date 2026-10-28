import * as React from 'react';
import { brand, colors, fonts } from '../../email/theme';
import { NBSP, Row, Table } from './Table';

export interface FooterProps {
  /** Why the recipient got this email, e.g. "You're receiving this because you placed an order…" */
  reason: string;
  accountUrl?: string;
  supportEmail?: string;
  year?: number;
}

/** Dark navy footer with wordmark, links and legal line. Shared by every email. */
export function Footer({
  reason,
  accountUrl = brand.accountUrl,
  supportEmail = brand.supportEmail,
  year = new Date().getFullYear(),
}: FooterProps) {
  const link: React.CSSProperties = { color: colors.accentLight, textDecoration: 'none' };
  const shopUrl = new URL('/catalog', brand.siteUrl).toString();
  const dot = <span style={{ color: colors.footerDot }}>{`${NBSP}${NBSP}·${NBSP}${NBSP}`}</span>;

  return (
    <Row align="center" className="px" style={{ backgroundColor: colors.ink, padding: '44px 56px 40px' }}>
      <div
        style={{
          fontFamily: fonts.serif,
          fontSize: 18,
          lineHeight: '18px',
          fontWeight: 500,
          letterSpacing: 8,
          color: colors.paper,
          paddingLeft: 8,
        }}
      >
        PRISIM
      </div>
      <div
        className="sans"
        style={{
          fontFamily: fonts.sans,
          fontSize: 8,
          lineHeight: '8px',
          letterSpacing: 6,
          color: colors.accentLight,
          padding: '10px 0 0 6px',
        }}
      >
        WELLNESS
      </div>

      <div className="sans" style={{ fontFamily: fonts.sans, fontSize: 11, lineHeight: '11px', letterSpacing: 2, paddingTop: 28 }}>
        <a href={shopUrl} style={link}>SHOP</a>
        {dot}
        <a href={accountUrl} style={link}>ACCOUNT</a>
        {dot}
        <a href={`mailto:${supportEmail}`} style={link}>SUPPORT</a>
      </div>

      <Table style={{ marginTop: 30 }}>
        <tr>
          <td style={{ height: 1, lineHeight: '1px', fontSize: 0, backgroundColor: colors.footerLine }}>{NBSP}</td>
        </tr>
      </Table>

      <div className="sans" style={{ fontFamily: fonts.sans, fontSize: 11, lineHeight: '18px', color: colors.footerText, paddingTop: 24 }}>
        {reason}
        <br />© {year} {brand.name}. All rights reserved.
      </div>
    </Row>
  );
}

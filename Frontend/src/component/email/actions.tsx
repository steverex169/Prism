import * as React from 'react';
import { colors, fonts } from '../../email/theme';
import { linkStyle } from './content';
import { Row } from './Table';

/** Square navy call-to-action button (table-based so it renders in Outlook). */
export function CtaButton({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Row align="center" className="px" style={{ padding: '18px 64px 0' }}>
      <table role="presentation" className="btn" cellPadding={0} cellSpacing={0} border={0} style={{ margin: '0 auto' }}>
        <tbody>
          <tr>
            <td align="center" style={{ backgroundColor: colors.ink }}>
              <a
                href={href}
                target="_blank"
                className="sans"
                style={{
                  display: 'inline-block',
                  padding: '19px 46px',
                  fontFamily: fonts.sans,
                  fontSize: 11,
                  lineHeight: '16px',
                  fontWeight: 500,
                  letterSpacing: 3.5,
                  color: colors.paper,
                  textTransform: 'uppercase',
                  textDecoration: 'none',
                  border: `1px solid ${colors.ink}`,
                }}
              >
                {children}
              </a>
            </td>
          </tr>
        </tbody>
      </table>
    </Row>
  );
}

/** "Button not working? Paste this link…" with optional expiry line. */
export function FallbackLink({ href, expiry }: { href: string; expiry?: string }) {
  return (
    <Row
      align="center"
      className="px sans"
      style={{ padding: '22px 64px 0', fontFamily: fonts.sans, fontSize: 12, lineHeight: '20px', color: colors.muted, textAlign: 'center' }}
    >
      {expiry ? (
        <>
          This link expires in {expiry}.<br />
        </>
      ) : null}
      Button not working? Paste this link into your browser:
      <br />
      <a href={href} style={{ ...linkStyle, wordBreak: 'break-all' }}>
        {href}
      </a>
    </Row>
  );
}

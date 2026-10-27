import * as React from 'react';
import { colors, fonts } from '../../email/theme';
import { NBSP, Row } from './Table';

/** Brand header: blue top rule, PRISIM wordmark, diamond ornament. Shared by every email. */
export function Header() {
  const rule: React.CSSProperties = {
    height: 1,
    lineHeight: '1px',
    fontSize: 0,
    borderTop: `1px solid ${colors.accent}`,
    opacity: 0.55,
  };
  return (
    <>
      <tr>
        <td style={{ height: 3, lineHeight: '3px', fontSize: 0, backgroundColor: colors.accent }}>{NBSP}</td>
      </tr>

      <Row align="center" style={{ padding: '46px 24px 0' }}>
        <div
          style={{
            fontFamily: fonts.serif,
            fontSize: 30,
            lineHeight: '30px',
            fontWeight: 500,
            letterSpacing: 12,
            color: colors.ink,
            paddingLeft: 12,
          }}
        >
          PRISIM
        </div>
        <div
          className="sans"
          style={{
            fontFamily: fonts.sans,
            fontSize: 9,
            lineHeight: '9px',
            letterSpacing: 7,
            color: colors.accent,
            padding: '12px 0 0 7px',
          }}
        >
          WELLNESS
        </div>
      </Row>

      <Row align="center" style={{ padding: '30px 0 0' }}>
        <table role="presentation" cellPadding={0} cellSpacing={0} border={0} style={{ margin: '0 auto' }}>
          <tbody>
            <tr>
              <td width={56} style={{ width: 56, verticalAlign: 'middle' }}>
                <div style={rule}>{NBSP}</div>
              </td>
              <td
                style={{
                  padding: '0 12px',
                  fontFamily: fonts.serif,
                  fontSize: 10,
                  lineHeight: '10px',
                  color: colors.accent,
                  verticalAlign: 'middle',
                }}
              >
                ◆
              </td>
              <td width={56} style={{ width: 56, verticalAlign: 'middle' }}>
                <div style={rule}>{NBSP}</div>
              </td>
            </tr>
          </tbody>
        </table>
      </Row>
    </>
  );
}

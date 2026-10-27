import * as React from 'react';
import { colors, fonts } from '../../email/theme';
import { Label } from './content';
import { NBSP, Row, Table } from './Table';

export interface DetailRow {
  label: string;
  value: React.ReactNode;
}

/** Ruled label/value table (order details, shipment, refund, etc.). */
export function DetailsTable({ title, rows }: { title: string; rows: DetailRow[] }) {
  return (
    <Row className="px" style={{ padding: '40px 64px 0' }}>
      <Table style={{ borderTop: `1px solid ${colors.ink}`, borderBottom: `1px solid ${colors.ink}` }}>
        <tr>
          <td colSpan={2} style={{ padding: '18px 0 6px' }}>
            <Label>{title}</Label>
          </td>
        </tr>
        {rows.map((r, i) => {
          const border = i ? { borderTop: `1px solid ${colors.line}` } : {};
          return (
            <tr key={r.label}>
              <td
                className="sans"
                valign="top"
                style={{
                  ...border,
                  padding: '14px 0',
                  width: '42%',
                  fontFamily: fonts.sans,
                  fontSize: 10,
                  lineHeight: '16px',
                  letterSpacing: 2.5,
                  color: colors.muted,
                  textTransform: 'uppercase',
                  verticalAlign: 'top',
                }}
              >
                {r.label}
              </td>
              <td
                valign="top"
                style={{ ...border, padding: '14px 0', fontFamily: fonts.serif, fontSize: 17, lineHeight: '22px', color: colors.ink, textAlign: 'right', verticalAlign: 'top' }}
              >
                {r.value}
              </td>
            </tr>
          );
        })}
      </Table>
    </Row>
  );
}

/** Soft panel with a blue left rule — security notes, "what happens next", etc. */
export function Note({ title = 'A note on security', children }: { title?: string; children: React.ReactNode }) {
  return (
    <Row className="px" style={{ padding: '40px 64px 0' }}>
      <Table bgcolor={colors.panel}>
        <tr>
          <td width={3} style={{ width: 3, backgroundColor: colors.accent, fontSize: 0, lineHeight: 0 }}>{NBSP}</td>
          <td style={{ padding: '22px 26px' }}>
            <div
              className="sans"
              style={{ fontFamily: fonts.sans, fontSize: 10, letterSpacing: 3, color: colors.ink, textTransform: 'uppercase', paddingBottom: 8 }}
            >
              {title}
            </div>
            <div className="sans" style={{ fontFamily: fonts.sans, fontSize: 13, lineHeight: '21px', color: colors.body }}>
              {children}
            </div>
          </td>
        </tr>
      </Table>
    </Row>
  );
}

/** Italic serif quotation between ink rules (customer note, contact message). */
export function QuoteBlock({ title, children, ruled = true }: { title: string; children: React.ReactNode; ruled?: boolean }) {
  const rules = ruled ? { borderTop: `1px solid ${colors.ink}`, borderBottom: `1px solid ${colors.ink}` } : {};
  return (
    <Row className="px" style={{ padding: ruled ? '36px 64px 0' : '30px 64px 0' }}>
      <Table style={rules}>
        <tr>
          <td style={{ padding: ruled ? '24px 0' : 0 }}>
            <Label color={ruled ? colors.accent : colors.muted}>{title}</Label>
            <div style={{ fontFamily: fonts.serif, fontSize: ruled ? 20 : 18, lineHeight: ruled ? '30px' : '28px', fontStyle: 'italic', color: ruled ? colors.ink : colors.body, paddingTop: 12 }}>
              “{children}”
            </div>
          </td>
        </tr>
      </Table>
    </Row>
  );
}

export interface NumberedItem {
  title: string;
  text: React.ReactNode;
}

/** Three-column 01 / 02 / 03 feature row; stacks on mobile. */
export function Numbered({ title, items }: { title: string; items: NumberedItem[] }) {
  return (
    <Row className="px" style={{ padding: '52px 54px 0' }}>
      <Table>
        <tr>
          <td align="center" style={{ borderTop: `1px solid ${colors.line}`, padding: '40px 0 30px' }}>
            <Label>{title}</Label>
          </td>
        </tr>
        <tr>
          <td>
            <Table>
              <tr>
                {items.map((it, i) => (
                  <td key={it.title} className="stack" width="33%" valign="top" style={{ width: '33%', padding: '0 10px', textAlign: 'center', verticalAlign: 'top' }}>
                    <div style={{ fontFamily: fonts.serif, fontSize: 30, lineHeight: '30px', fontStyle: 'italic', color: colors.accent }}>
                      {String(i + 1).padStart(2, '0')}
                    </div>
                    <div style={{ fontFamily: fonts.serif, fontSize: 19, lineHeight: '24px', color: colors.ink, padding: '12px 0 6px' }}>{it.title}</div>
                    <div className="sans" style={{ fontFamily: fonts.sans, fontSize: 13, lineHeight: '20px', color: colors.body }}>
                      {it.text}
                    </div>
                  </td>
                ))}
              </tr>
            </Table>
          </td>
        </tr>
      </Table>
    </Row>
  );
}

/** Large one-time code between rules. */
export function OtpBox({ code, validFor = '10 minutes' }: { code: string; validFor?: string }) {
  return (
    <Row align="center" className="px" style={{ padding: '20px 64px 0' }}>
      <table
        role="presentation"
        cellPadding={0}
        cellSpacing={0}
        border={0}
        style={{ margin: '0 auto', borderTop: `1px solid ${colors.ink}`, borderBottom: `1px solid ${colors.ink}` }}
      >
        <tbody>
          <tr>
            <td align="center" style={{ padding: '30px 36px 8px' }}>
              <div
                className="otp"
                style={{ fontFamily: fonts.serif, fontSize: 50, lineHeight: '56px', fontWeight: 500, letterSpacing: 16, color: colors.ink, paddingLeft: 16 }}
              >
                {code}
              </div>
            </td>
          </tr>
          <tr>
            <td align="center" style={{ padding: '0 36px 26px' }}>
              <Label>Valid for {validFor}</Label>
            </td>
          </tr>
        </tbody>
      </table>
    </Row>
  );
}

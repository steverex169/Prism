import * as React from 'react';
import { colors, fonts } from '../../email/theme';
import { CtaButton } from './actions';
import { Label } from './content';
import { NBSP, Row, Spacer, Table } from './Table';

export interface LineItem {
  name: string;
  variant?: string;
  quantity: number;
  /** Pre-formatted line total, e.g. "$118.00" */
  total: string;
  imageUrl: string;
}

export interface OrderTotals {
  subtotal: string;
  shipping: string;
  discount?: string;
  tax?: string;
  total: string;
}

/** Line items with optional totals block. Loops over `items`. */
export function OrderItems({ title = 'Order summary', items, totals }: { title?: string; items: LineItem[]; totals?: OrderTotals }) {
  const cellBorder = { borderBottom: `1px solid ${colors.line}` };
  const totalRow = (k: string, v: string) => (
    <tr key={k}>
      <td className="sans" style={{ padding: '0 0 10px', fontFamily: fonts.sans, fontSize: 13, color: colors.body }}>{k}</td>
      <td align="right" className="sans" style={{ padding: '0 0 10px', fontFamily: fonts.sans, fontSize: 13, color: colors.body, textAlign: 'right' }}>{v}</td>
    </tr>
  );

  return (
    <Row className="px" style={{ padding: '40px 64px 0' }}>
      <Table>
        <tr>
          <td colSpan={3} style={{ borderBottom: `1px solid ${colors.ink}`, paddingBottom: 14 }}>
            <Label>{title}</Label>
          </td>
        </tr>
        {items.map((it, i) => (
          <tr key={`${it.name}-${i}`}>
            <td width={72} valign="top" style={{ width: 72, padding: '18px 0', verticalAlign: 'top', ...cellBorder }}>
              <img
                src={it.imageUrl}
                width={64}
                height={64}
                alt={it.name}
                style={{ display: 'block', width: 64, height: 64, objectFit: 'cover', backgroundColor: colors.panel }}
              />
            </td>
            <td valign="top" style={{ padding: '18px 0 18px 16px', verticalAlign: 'top', ...cellBorder }}>
              <div style={{ fontFamily: fonts.serif, fontSize: 18, lineHeight: '22px', color: colors.ink }}>{it.name}</div>
              <div className="sans" style={{ fontFamily: fonts.sans, fontSize: 12, lineHeight: '20px', color: colors.muted, paddingTop: 4 }}>
                {it.variant ? `${it.variant}${NBSP}${NBSP}·${NBSP}${NBSP}` : ''}Qty {it.quantity}
              </div>
            </td>
            <td
              valign="top"
              align="right"
              style={{ padding: '18px 0', verticalAlign: 'top', fontFamily: fonts.serif, fontSize: 18, lineHeight: '22px', color: colors.ink, whiteSpace: 'nowrap', textAlign: 'right', ...cellBorder }}
            >
              {it.total}
            </td>
          </tr>
        ))}
        {totals ? (
          <tr>
            <td colSpan={3} style={{ padding: '22px 0 0' }}>
              <Table>
                {totalRow('Subtotal', totals.subtotal)}
                {totalRow('Shipping', totals.shipping)}
                {totals.discount ? totalRow('Discount', totals.discount) : null}
                {totals.tax ? totalRow('Tax', totals.tax) : null}
                <tr>
                  <td colSpan={2} style={{ height: 8, fontSize: 0, lineHeight: 0 }}>{NBSP}</td>
                </tr>
                <tr>
                  <td
                    className="sans"
                    style={{ padding: '16px 0 0', borderTop: `1px solid ${colors.ink}`, fontFamily: fonts.sans, fontSize: 11, letterSpacing: 3, color: colors.ink, textTransform: 'uppercase' }}
                  >
                    Total
                  </td>
                  <td
                    align="right"
                    style={{ padding: '16px 0 0', borderTop: `1px solid ${colors.ink}`, fontFamily: fonts.serif, fontSize: 24, lineHeight: '26px', color: colors.ink, textAlign: 'right' }}
                  >
                    {totals.total}
                  </td>
                </tr>
              </Table>
            </td>
          </tr>
        ) : null}
      </Table>
    </Row>
  );
}

/** Shipping address and (optionally) payment method, side by side; stacks on mobile. */
export function Addresses({
  shippingAddress,
  paymentMethod,
  billingAddress,
}: {
  shippingAddress: string[];
  paymentMethod?: string;
  billingAddress?: string[];
}) {
  const col = (title: string, lines: string[]) => (
    <td className="stack" width="50%" valign="top" style={{ width: '50%', paddingRight: 16, verticalAlign: 'top' }}>
      <Label>{title}</Label>
      <div className="sans" style={{ fontFamily: fonts.sans, fontSize: 13, lineHeight: '21px', color: colors.body, paddingTop: 10 }}>
        {lines.map((l, i) => (
          <React.Fragment key={i}>
            {i ? <br /> : null}
            {l}
          </React.Fragment>
        ))}
      </div>
    </td>
  );
  return (
    <Row className="px" style={{ padding: '36px 64px 0' }}>
      <Table style={{ borderTop: `1px solid ${colors.line}` }}>
        <tr>
          <td style={{ paddingTop: 28 }}>
            <Table>
              <tr>
                {col('Shipping to', shippingAddress)}
                {paymentMethod ? col('Payment', [paymentMethod, ...(billingAddress ?? [])]) : null}
              </tr>
            </Table>
          </td>
        </tr>
      </Table>
    </Row>
  );
}

export type TrackerStep = 1 | 2 | 3 | 4;
const STEPS = ['Ordered', 'Dispatched', 'Out for delivery', 'Delivered'];

/** 4-step shipping progress bar. `step` is the current stage. */
export function Tracker({ step }: { step: TrackerStep }) {
  return (
    <Row className="px" style={{ padding: '36px 61px 0' }}>
      <Table>
        <tr>
          {STEPS.map((s, idx) => {
            const i = idx + 1;
            const done = i <= step;
            const bar = i === step ? colors.ink : done ? colors.accent : colors.line;
            return (
              <td key={s} width="25%" valign="top" style={{ width: '25%', padding: '0 3px', verticalAlign: 'top' }}>
                <div style={{ height: 3, lineHeight: '3px', fontSize: 0, backgroundColor: bar }}>{NBSP}</div>
                <div
                  className="sans"
                  style={{
                    fontFamily: fonts.sans,
                    fontSize: 10,
                    lineHeight: '14px',
                    letterSpacing: 1.5,
                    color: done ? colors.ink : colors.muted,
                    fontWeight: i === step ? 500 : 400,
                    textTransform: 'uppercase',
                    paddingTop: 12,
                  }}
                >
                  {s}
                </div>
              </td>
            );
          })}
        </tr>
      </Table>
    </Row>
  );
}

/** Large product card with CTA (back-in-stock). */
export function ProductFeature({
  name,
  price,
  imageUrl,
  href,
  cta = 'Shop now',
}: {
  name: string;
  price: string;
  imageUrl: string;
  href: string;
  cta?: string;
}) {
  return (
    <>
      <Row align="center" className="px" style={{ padding: '36px 64px 0' }}>
        <Table bgcolor={colors.panel}>
          <tr>
            <td align="center" style={{ padding: '36px 30px 34px' }}>
              <img
                src={imageUrl}
                width={200}
                height={200}
                alt={name}
                style={{ display: 'block', width: 200, height: 200, objectFit: 'cover', backgroundColor: colors.paper, margin: '0 auto' }}
              />
              <div style={{ fontFamily: fonts.serif, fontSize: 24, lineHeight: '30px', color: colors.ink, paddingTop: 24 }}>{name}</div>
              <div className="sans" style={{ fontFamily: fonts.sans, fontSize: 13, letterSpacing: 2, color: colors.accent, paddingTop: 6 }}>
                {price}
              </div>
            </td>
          </tr>
        </Table>
      </Row>
      <Spacer height={32} />
      <CtaButton href={href}>{cta}</CtaButton>
    </>
  );
}

/** Five tappable stars; each links to `${reviewUrl}?rating=N`. */
export function StarRating({ reviewUrl }: { reviewUrl: string }) {
  const sep = reviewUrl.includes('?') ? '&' : '?';
  return (
    <Row align="center" style={{ padding: '28px 0 0' }}>
      {[1, 2, 3, 4, 5].map((n) => (
        <a
          key={n}
          href={`${reviewUrl}${sep}rating=${n}`}
          style={{ fontFamily: 'Georgia, serif', fontSize: 30, lineHeight: '30px', color: colors.accent, textDecoration: 'none', padding: '0 5px' }}
        >
          ★
        </a>
      ))}
      <div style={{ paddingTop: 10 }}>
        <Label color={colors.muted}>Tap a star to rate</Label>
      </div>
    </Row>
  );
}

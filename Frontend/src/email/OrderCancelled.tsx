import * as React from 'react';
import { CtaButton, DetailsTable, EmailLayout, Hero, HelpLine, type LineItem, Note, OrderItems, type OrderTotals, Signoff, Spacer } from '../component/email';
import { brand } from './theme';
import { sampleItems, sampleTotals } from './_sample';

export interface OrderCancelledProps {
  firstName: string;
  orderNumber: string;
  cancelledAt: string;
  reason: string;
  items: LineItem[];
  totals: OrderTotals;
  supportEmail?: string;
}

export const subject = ({ orderNumber }: Pick<OrderCancelledProps, 'orderNumber'>) => `Order ${orderNumber} has been cancelled | Prisim Wellness`;

export default function OrderCancelled(p: OrderCancelledProps) {
  return (
    <EmailLayout
      title={subject(p)}
      preview="Your order has been cancelled. Here are the details."
      footerReason="You're receiving this because you placed an order at prisimwellness.com."
      supportEmail={p.supportEmail}
    >
      <Hero
        eyebrow="Order cancelled"
        headline={<>Your order has<br />been cancelled.</>}
        paragraphs={[`Dear ${p.firstName},`, `We're writing to confirm that order ${p.orderNumber} has been cancelled.`]}
      />
      <DetailsTable
        title="Cancellation"
        rows={[
          { label: 'Order', value: p.orderNumber },
          { label: 'Cancelled on', value: p.cancelledAt },
          { label: 'Reason', value: p.reason },
        ]}
      />
      <OrderItems title="Cancelled items" items={p.items} totals={p.totals} />
      <Note title="About your payment">
        If you were charged, a full refund will be returned to your original payment method within 5 to 10 business days.
      </Note>
      <Spacer height={8} />
      <CtaButton href={brand.siteUrl}>Continue shopping</CtaButton>
      <Signoff>
        <HelpLine supportEmail={p.supportEmail} />
      </Signoff>
    </EmailLayout>
  );
}

OrderCancelled.PreviewProps = {
  firstName: 'Amelia',
  orderNumber: '#PW-20931',
  cancelledAt: '27 Oct 2026',
  reason: 'Requested by customer',
  items: sampleItems,
  totals: sampleTotals,
} satisfies OrderCancelledProps;

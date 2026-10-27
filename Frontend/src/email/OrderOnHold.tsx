import * as React from 'react';
import { DetailsTable, EmailLayout, Hero, HelpLine, type LineItem, Note, OrderItems, type OrderTotals, Signoff } from '../component/email';
import { sampleItems, sampleTotals } from './_sample';

export interface OrderOnHoldProps {
  firstName: string;
  orderNumber: string;
  orderDate: string;
  paymentMethod: string;
  items: LineItem[];
  totals: OrderTotals;
  supportEmail?: string;
}

export const subject = ({ orderNumber }: Pick<OrderOnHoldProps, 'orderNumber'>) => `Order ${orderNumber} is on hold | Prisim Wellness`;

export default function OrderOnHold(p: OrderOnHoldProps) {
  return (
    <EmailLayout
      title={subject(p)}
      preview="We've received your order and are awaiting payment confirmation."
      footerReason="You're receiving this because you placed an order at prisimwellness.com."
      supportEmail={p.supportEmail}
    >
      <Hero
        eyebrow="Order on hold"
        headline={<>We're confirming<br />your payment.</>}
        paragraphs={[
          `Dear ${p.firstName},`,
          "Thank you for your order. It's currently on hold while we confirm your payment. As soon as it clears, we'll begin preparing your items.",
        ]}
      />
      <DetailsTable
        title="Order details"
        rows={[
          { label: 'Order', value: p.orderNumber },
          { label: 'Placed', value: p.orderDate },
          { label: 'Payment', value: p.paymentMethod },
        ]}
      />
      <OrderItems items={p.items} totals={p.totals} />
      <Note title="What happens next">
        No action is needed from you. If payment instructions were provided at checkout, please complete them so we can release your order promptly.
      </Note>
      <Signoff>
        <HelpLine supportEmail={p.supportEmail} />
      </Signoff>
    </EmailLayout>
  );
}

OrderOnHold.PreviewProps = {
  firstName: 'Amelia',
  orderNumber: '#PW-20931',
  orderDate: '27 Oct 2026',
  paymentMethod: 'Bank transfer',
  items: sampleItems,
  totals: sampleTotals,
} satisfies OrderOnHoldProps;

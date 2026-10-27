import * as React from 'react';
import { CtaButton, EmailLayout, Hero, Note, Signoff, Spacer, Tracker } from '../component/email';

export interface OrderDeliveredProps {
  firstName: string;
  orderNumber: string;
  deliveredAt: string;
  orderUrl: string;
}

export const subject = () => 'Your order has arrived | Prisim Wellness';

export default function OrderDelivered(p: OrderDeliveredProps) {
  return (
    <EmailLayout
      title={subject()}
      preview={`Order ${p.orderNumber} was delivered. We hope you love it.`}
      footerReason="You're receiving this because you placed an order at prisimwellness.com."
    >
      <Hero
        eyebrow="Delivered"
        headline={<>Your order<br />has arrived.</>}
        paragraphs={[
          `Dear ${p.firstName},`,
          `Your order was delivered on ${p.deliveredAt}. We hope it brings you exactly what you were looking for.`,
        ]}
      />
      <Tracker step={4} />
      <Spacer height={40} />
      <CtaButton href={p.orderUrl}>View your order</CtaButton>
      <Note title="Something not right?">
        If anything is missing, damaged or not as expected, reply to this email within 48 hours and we'll make it right.
      </Note>
      <Signoff />
    </EmailLayout>
  );
}

OrderDelivered.PreviewProps = {
  firstName: 'Amelia',
  orderNumber: '#PW-20931',
  deliveredAt: '30 Oct 2026',
  orderUrl: 'https://prisimwellness.com/my-account/orders/',
} satisfies OrderDeliveredProps;

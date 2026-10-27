import * as React from 'react';
import { CtaButton, DetailsTable, EmailLayout, Hero, HelpLine, Note, Signoff, Spacer } from '../component/email';

export interface RefundIssuedProps {
  firstName: string;
  orderNumber: string;
  refundAmount: string;
  paymentMethod: string;
  refundedAt: string;
  orderUrl: string;
  supportEmail?: string;
}

export const subject = () => 'Your refund has been issued | Prisim Wellness';

export default function RefundIssued(p: RefundIssuedProps) {
  return (
    <EmailLayout
      title={subject()}
      preview={`A refund of ${p.refundAmount} is on its way to you.`}
      footerReason="You're receiving this because a refund was issued on your order."
      supportEmail={p.supportEmail}
    >
      <Hero
        eyebrow="Refund issued"
        headline={<>Your refund<br />is on its way.</>}
        paragraphs={[`Dear ${p.firstName},`, "We've issued a refund for your order. Here are the details for your records."]}
      />
      <DetailsTable
        title="Refund"
        rows={[
          { label: 'Order', value: p.orderNumber },
          { label: 'Amount', value: p.refundAmount },
          { label: 'Refunded to', value: p.paymentMethod },
          { label: 'Issued', value: p.refundedAt },
        ]}
      />
      <Note title="When to expect it">Refunds typically appear within 5 to 10 business days, depending on your bank or card provider.</Note>
      <Spacer height={8} />
      <CtaButton href={p.orderUrl}>View your order</CtaButton>
      <Signoff>
        <HelpLine supportEmail={p.supportEmail} />
      </Signoff>
    </EmailLayout>
  );
}

RefundIssued.PreviewProps = {
  firstName: 'Amelia',
  orderNumber: '#PW-20931',
  refundAmount: '$123.20',
  paymentMethod: 'Visa ending 4417',
  refundedAt: '28 Oct 2026',
  orderUrl: 'https://prisimwellness.com/my-account/orders/',
} satisfies RefundIssuedProps;

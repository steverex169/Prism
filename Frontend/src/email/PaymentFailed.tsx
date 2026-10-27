import * as React from 'react';
import { CtaButton, DetailsTable, EmailLayout, Hero, HelpLine, Note, Signoff, Spacer } from '../component/email';

export interface PaymentFailedProps {
  firstName: string;
  orderNumber: string;
  amountDue: string;
  paymentUrl: string;
  supportEmail?: string;
}

export const subject = () => 'Action needed: payment unsuccessful | Prisim Wellness';

export default function PaymentFailed(p: PaymentFailedProps) {
  return (
    <EmailLayout
      title={subject()}
      preview={`We couldn't process payment for order ${p.orderNumber}. Your items are reserved for now.`}
      footerReason="You're receiving this because a payment attempt on your order was unsuccessful."
      supportEmail={p.supportEmail}
    >
      <Hero
        eyebrow="Payment unsuccessful"
        headline={<>We couldn't process<br />your payment.</>}
        paragraphs={[
          `Dear ${p.firstName},`,
          "Unfortunately, payment for your order didn't go through. Your items are reserved for a short time. Please complete payment to secure them.",
        ]}
      />
      <DetailsTable
        title="Order details"
        rows={[
          { label: 'Order', value: p.orderNumber },
          { label: 'Amount due', value: p.amountDue },
        ]}
      />
      <Spacer height={36} />
      <CtaButton href={p.paymentUrl}>Complete your payment</CtaButton>
      <Note title="Why this happens">
        Common causes include an expired card, incorrect billing details or a bank security check. Trying another card or payment method usually resolves it.
      </Note>
      <Signoff>
        <HelpLine supportEmail={p.supportEmail} />
      </Signoff>
    </EmailLayout>
  );
}

PaymentFailed.PreviewProps = {
  firstName: 'Amelia',
  orderNumber: '#PW-20931',
  amountDue: '$123.20',
  paymentUrl: 'https://prisimwellness.com/checkout/order-pay/20931/',
} satisfies PaymentFailedProps;

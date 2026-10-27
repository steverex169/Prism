import * as React from 'react';
import { CtaButton, DetailsTable, EmailLayout, Hero, HelpLine, Numbered, Signoff, Spacer } from '../component/email';

export interface ReturnReceivedProps {
  firstName: string;
  returnNumber: string;
  orderNumber: string;
  refundMethod: string;
  carrier: string;
  returnLabelUrl: string;
  supportEmail?: string;
}

export const subject = ({ returnNumber }: Pick<ReturnReceivedProps, 'returnNumber'>) => `Return ${returnNumber} received | Prisim Wellness`;

export default function ReturnReceived(p: ReturnReceivedProps) {
  return (
    <EmailLayout
      title={subject(p)}
      preview="We've received your return request. Here's what happens next."
      footerReason="You're receiving this because a return was requested on your order."
      supportEmail={p.supportEmail}
    >
      <Hero
        eyebrow="Return requested"
        headline={<>We've received<br />your return request.</>}
        paragraphs={[
          `Dear ${p.firstName},`,
          "Thank you for letting us know. Your return has been approved. Follow the steps below and we'll take care of the rest.",
        ]}
      />
      <DetailsTable
        title="Return details"
        rows={[
          { label: 'Return', value: p.returnNumber },
          { label: 'Order', value: p.orderNumber },
          { label: 'Refund to', value: p.refundMethod },
        ]}
      />
      <Numbered
        title="How to return"
        items={[
          { title: 'Pack', text: 'Place items securely in their original packaging.' },
          { title: 'Send', text: `Attach your label and drop off at ${p.carrier}.` },
          { title: 'Refund', text: 'Processed within 5 business days of arrival.' },
        ]}
      />
      <Spacer height={44} />
      <CtaButton href={p.returnLabelUrl}>Download return label</CtaButton>
      <Signoff>
        <HelpLine supportEmail={p.supportEmail} />
      </Signoff>
    </EmailLayout>
  );
}

ReturnReceived.PreviewProps = {
  firstName: 'Amelia',
  returnNumber: 'RT-5521',
  orderNumber: '#PW-20931',
  refundMethod: 'Original payment',
  carrier: 'UPS',
  returnLabelUrl: 'https://prisimwellness.com/returns/RT-5521/label',
} satisfies ReturnReceivedProps;

import * as React from 'react';
import { CtaButton, EmailLayout, Hero, HelpLine, QuoteBlock, Signoff, Spacer } from '../component/email';

export interface CustomerNoteProps {
  firstName: string;
  orderNumber: string;
  note: string;
  orderUrl: string;
  supportEmail?: string;
}

export const subject = ({ orderNumber }: Pick<CustomerNoteProps, 'orderNumber'>) => `An update on order ${orderNumber} | Prisim Wellness`;

export default function CustomerNote(p: CustomerNoteProps) {
  return (
    <EmailLayout
      title={subject(p)}
      preview="Our team has added a note to your order."
      footerReason="You're receiving this because there's an update on your order."
      supportEmail={p.supportEmail}
    >
      <Hero
        eyebrow="Order update"
        headline={<>A note about<br />your order.</>}
        paragraphs={[`Dear ${p.firstName},`, `Our team has added the following note to order ${p.orderNumber}.`]}
      />
      <QuoteBlock title="From the Prisim team">{p.note}</QuoteBlock>
      <Spacer height={40} />
      <CtaButton href={p.orderUrl}>View your order</CtaButton>
      <Signoff>
        <HelpLine supportEmail={p.supportEmail} />
      </Signoff>
    </EmailLayout>
  );
}

CustomerNote.PreviewProps = {
  firstName: 'Amelia',
  orderNumber: '#PW-20931',
  note: 'Your order includes a complimentary sample. We hope you enjoy it.',
  orderUrl: 'https://prisimwellness.com/my-account/orders/',
} satisfies CustomerNoteProps;

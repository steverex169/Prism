import * as React from 'react';
import { DetailsTable, EmailLayout, Hero, HelpLine, QuoteBlock, Signoff } from '../component/email';

export interface ContactFormConfirmationProps {
  firstName: string;
  ticketId: string;
  submittedAt: string;
  subject: string;
  message: string;
  supportEmail?: string;
}

export const subject = () => "We've received your message | Prisim Wellness";

export default function ContactFormConfirmation({ firstName, ticketId, submittedAt, subject: topic, message, supportEmail }: ContactFormConfirmationProps) {
  return (
    <EmailLayout
      title={subject()}
      preview="Thank you for writing to us. A member of our team will reply within 1-2 business days."
      footerReason="You're receiving this because you contacted us through prisimwellness.com."
      supportEmail={supportEmail}
    >
      <Hero
        eyebrow="Message received"
        headline={<>Thank you for<br />reaching out.</>}
        paragraphs={[
          `Dear ${firstName},`,
          'Your message has reached our team. A specialist will review it personally and reply within one to two business days.',
        ]}
      />
      <DetailsTable
        title="Your enquiry"
        rows={[
          { label: 'Reference', value: ticketId },
          { label: 'Submitted', value: submittedAt },
          { label: 'Subject', value: topic },
        ]}
      />
      <QuoteBlock title="Your message" ruled={false}>{message}</QuoteBlock>
      <Signoff>
        <HelpLine supportEmail={supportEmail} />
      </Signoff>
    </EmailLayout>
  );
}

ContactFormConfirmation.PreviewProps = {
  firstName: 'Amelia',
  ticketId: 'PW-10482',
  submittedAt: '27 Oct 2026, 7:41 PM',
  subject: 'Shipping enquiry',
  message: "Hello, I'd like to know more about shipping times for international orders.",
} satisfies ContactFormConfirmationProps;

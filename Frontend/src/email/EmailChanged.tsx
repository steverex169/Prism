import * as React from 'react';
import { DetailsTable, EmailLayout, Hero, Note, Signoff, linkStyle } from '../component/email';
import { brand } from './theme';

export interface EmailChangedProps {
  firstName: string;
  oldEmail: string;
  newEmail: string;
  changedAt: string;
  secureAccountUrl: string;
  supportEmail?: string;
}

export const subject = () => 'Your email address was updated | Prisim Wellness';

/** Send to the PREVIOUS address so the real owner is alerted. */
export default function EmailChanged({ supportEmail = brand.supportEmail, ...p }: EmailChangedProps) {
  return (
    <EmailLayout
      title={subject()}
      preview="Security notice: the email address on your account was changed."
      footerReason="This notice was sent to your previous email address for your security."
      supportEmail={supportEmail}
    >
      <Hero
        eyebrow="Security notice"
        headline={<>Your email address<br />was updated.</>}
        paragraphs={[
          `Dear ${p.firstName},`,
          'The email address linked to your Prisim Wellness account was changed. From now on, all account emails will go to the new address.',
        ]}
      />
      <DetailsTable
        title="Change details"
        rows={[
          { label: 'Previous', value: p.oldEmail },
          { label: 'New', value: p.newEmail },
          { label: 'Changed', value: p.changedAt },
        ]}
      />
      <Note title="Wasn't you?">
        If you did not make this change, please <a href={p.secureAccountUrl} style={linkStyle}>secure your account</a> and contact{' '}
        <a href={`mailto:${supportEmail}`} style={linkStyle}>{supportEmail}</a> immediately.
      </Note>
      <Signoff />
    </EmailLayout>
  );
}

EmailChanged.PreviewProps = {
  firstName: 'Amelia',
  oldEmail: 'a.hart@mail.com',
  newEmail: 'amelia@hart.co',
  changedAt: '27 Oct 2026, 7:41 PM',
  secureAccountUrl: 'https://prisimwellness.com/my-account/lost-password/',
} satisfies EmailChangedProps;

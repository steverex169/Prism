import * as React from 'react';
import { CtaButton, DetailsTable, EmailLayout, Hero, Note, Signoff, Spacer, linkStyle } from '../component/email';
import { brand } from './theme';

export interface PasswordChangedProps {
  firstName: string;
  changedAt: string;
  device: string;
  location: string;
  loginUrl: string;
  resetUrl: string;
  supportEmail?: string;
}

export const subject = () => 'Your password has been changed | Prisim Wellness';

export default function PasswordChanged({ firstName, changedAt, device, location, loginUrl, resetUrl, supportEmail = brand.supportEmail }: PasswordChangedProps) {
  return (
    <EmailLayout
      title={subject()}
      preview="Confirmation that your Prisim Wellness password was updated."
      footerReason="You're receiving this security notice because your account password was changed."
      supportEmail={supportEmail}
    >
      <Hero
        eyebrow="Security notice"
        headline={<>Your password<br />has been changed.</>}
        paragraphs={[`Dear ${firstName},`, 'This confirms that the password for your Prisim Wellness account was updated successfully.']}
      />
      <DetailsTable
        title="Change details"
        rows={[
          { label: 'Date', value: changedAt },
          { label: 'Device', value: device },
          { label: 'Location', value: location },
        ]}
      />
      <Spacer height={36} />
      <CtaButton href={loginUrl}>Sign in to your account</CtaButton>
      <Note title="Wasn't you?">
        If you did not make this change, please <a href={resetUrl} style={linkStyle}>reset your password</a> immediately and contact us at{' '}
        <a href={`mailto:${supportEmail}`} style={linkStyle}>{supportEmail}</a>.
      </Note>
      <Signoff />
    </EmailLayout>
  );
}

PasswordChanged.PreviewProps = {
  firstName: 'Amelia',
  changedAt: '27 Oct 2026, 7:41 PM',
  device: 'Safari on iPhone',
  location: 'Miami, US',
  loginUrl: 'https://prisimwellness.com/my-account/',
  resetUrl: 'https://prisimwellness.com/my-account/lost-password/',
} satisfies PasswordChangedProps;

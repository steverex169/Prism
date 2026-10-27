import * as React from 'react';
import { CtaButton, EmailLayout, FallbackLink, Hero, Note, Signoff, linkStyle } from '../component/email';
import { brand } from './theme';

export interface PasswordResetRequestProps {
  firstName: string;
  resetUrl: string;
  expiresIn?: string;
  supportEmail?: string;
}

export const subject = () => 'Reset your password | Prisim Wellness';

export default function PasswordResetRequest({ firstName, resetUrl, expiresIn = '60 minutes and can be used once', supportEmail = brand.supportEmail }: PasswordResetRequestProps) {
  return (
    <EmailLayout
      title={subject()}
      preview="We received a request to reset your password. This link expires in 60 minutes."
      footerReason="You're receiving this because a password reset was requested for your account."
      supportEmail={supportEmail}
    >
      <Hero
        eyebrow="Password reset"
        headline={<>Reset your<br />password.</>}
        paragraphs={[`Dear ${firstName},`, 'We received a request to reset the password for your account. Select the button below to choose a new one.']}
      />
      <CtaButton href={resetUrl}>Choose a new password</CtaButton>
      <FallbackLink href={resetUrl} expiry={expiresIn} />
      <Note>
        Didn't request this? No action is needed. Your password stays the same and your account remains secure. For added peace of mind, contact{' '}
        <a href={`mailto:${supportEmail}`} style={linkStyle}>{supportEmail}</a>.
      </Note>
      <Signoff />
    </EmailLayout>
  );
}

PasswordResetRequest.PreviewProps = {
  firstName: 'Amelia',
  resetUrl: 'https://prisimwellness.com/reset?t=a71c0d',
} satisfies PasswordResetRequestProps;

import * as React from 'react';
import { CtaButton, EmailLayout, FallbackLink, Hero, Note, Signoff } from '../component/email';

export interface VerifyEmailProps {
  firstName: string;
  verifyUrl: string;
  expiresIn?: string;
}

export const subject = () => 'Please confirm your email address | Prisim Wellness';

export default function VerifyEmail({ firstName, verifyUrl, expiresIn = '24 hours' }: VerifyEmailProps) {
  return (
    <EmailLayout
      title={subject()}
      preview="One last step: confirm your email to activate your account."
      footerReason="You're receiving this because this email was used to create a Prisim Wellness account."
    >
      <Hero
        eyebrow="One final step"
        headline={<>Confirm your<br />email address.</>}
        paragraphs={[
          `Dear ${firstName},`,
          'Please confirm this is the right address for your Prisim Wellness account. This keeps your orders, receipts and account updates arriving safely.',
        ]}
      />
      <CtaButton href={verifyUrl}>Verify email address</CtaButton>
      <FallbackLink href={verifyUrl} expiry={expiresIn} />
      <Note>If you didn't create an account with Prisim Wellness, you can safely ignore this email. No account will be activated.</Note>
      <Signoff />
    </EmailLayout>
  );
}

VerifyEmail.PreviewProps = {
  firstName: 'Amelia',
  verifyUrl: 'https://prisimwellness.com/verify?t=8f2c91',
} satisfies VerifyEmailProps;

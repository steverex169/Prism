import * as React from 'react';
import { EmailLayout, Hero, Note, OtpBox, Signoff } from '../component/email';

export interface OtpCodeProps {
  code: string;
  validFor?: string;
}

export const subject = ({ code }: OtpCodeProps) => `Your verification code: ${code} | Prisim Wellness`;

export default function OtpCode({ code, validFor = '10 minutes' }: OtpCodeProps) {
  return (
    <EmailLayout
      title={subject({ code })}
      preview={`Your one-time code is ${code}. It expires in ${validFor}.`}
      footerReason="You're receiving this because a verification code was requested for your account."
    >
      <Hero
        eyebrow="Verification code"
        headline={<>Your one-time<br />code.</>}
        paragraphs={['Enter the code below to continue. For your security, it can be used only once.']}
      />
      <OtpBox code={code} validFor={validFor} />
      <Note>
        Prisim Wellness will never ask for this code by phone, text or email. Do not share it with anyone. If you didn't request it, you can ignore
        this message.
      </Note>
      <Signoff />
    </EmailLayout>
  );
}

OtpCode.PreviewProps = { code: '482916' } satisfies OtpCodeProps;

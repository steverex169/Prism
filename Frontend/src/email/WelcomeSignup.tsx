import * as React from 'react';
import { CtaButton, EmailLayout, Hero, HelpLine, Numbered, Signoff } from '../component/email';
import { brand } from './theme';

export interface WelcomeSignupProps {
  firstName: string;
  accountUrl?: string;
  supportEmail?: string;
}

export const subject = () => 'Welcome to Prisim Wellness';

export default function WelcomeSignup({ firstName, accountUrl = brand.accountUrl, supportEmail }: WelcomeSignupProps) {
  return (
    <EmailLayout
      title={subject()}
      preview="Your account is ready. Here's what you can do from it."
      footerReason="You're receiving this because an account was created with this email address."
      accountUrl={accountUrl}
      supportEmail={supportEmail}
    >
      <Hero
        eyebrow="Welcome"
        headline={<>Welcome to<br />Prisim Wellness.</>}
        paragraphs={[`Dear ${firstName},`, "Your account has been created and is ready to use. We're delighted to have you with us."]}
      />
      <CtaButton href={accountUrl}>Explore your account</CtaButton>
      <Numbered
        title="Your account, at a glance"
        items={[
          { title: 'Track orders', text: 'Follow every order from dispatch to your door.' },
          { title: 'Reorder easily', text: 'Return to your essentials in a few clicks.' },
          { title: 'Your details', text: 'Update addresses and preferences anytime.' },
        ]}
      />
      <Signoff>
        <HelpLine supportEmail={supportEmail} />
      </Signoff>
    </EmailLayout>
  );
}

WelcomeSignup.PreviewProps = { firstName: 'Amelia' } satisfies WelcomeSignupProps;

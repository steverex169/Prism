import * as React from 'react';
import { CtaButton, EmailLayout, Hero, Numbered, Signoff, Spacer, linkStyle } from '../component/email';
import { brand, colors, fonts } from './theme';

export interface SubscriptionConfirmedProps {
  firstName: string;
  unsubscribeUrl: string;
}

export const subject = () => "You're subscribed | Prisim Wellness";

export default function SubscriptionConfirmed({ firstName, unsubscribeUrl }: SubscriptionConfirmedProps) {
  return (
    <EmailLayout
      title={subject()}
      preview="Welcome to the Prisim Wellness list. Here's what to expect."
      footerReason="You're receiving this because you subscribed at prisimwellness.com."
    >
      <Hero
        eyebrow="Subscription confirmed"
        headline={<>You're on<br />the list.</>}
        paragraphs={[
          `Dear ${firstName},`,
          "Thank you for subscribing. You'll be among the first to hear about new arrivals, member offers and considered notes on wellbeing.",
        ]}
      />
      <Numbered
        title="What to expect"
        items={[
          { title: 'New arrivals', text: 'First access to new products and restocks.' },
          { title: 'Member offers', text: 'Private offers reserved for subscribers.' },
          { title: 'Thoughtful notes', text: 'Occasional, never cluttered. Leave anytime.' },
        ]}
      />
      <Spacer height={44} />
      <CtaButton href={brand.siteUrl}>Visit the shop</CtaButton>
      <Signoff>
        <div className="sans" style={{ fontFamily: fonts.sans, fontSize: 12, lineHeight: '20px', color: colors.muted, paddingBottom: 30 }}>
          Changed your mind? <a href={unsubscribeUrl} style={linkStyle}>Unsubscribe</a> at any time.
        </div>
      </Signoff>
    </EmailLayout>
  );
}

SubscriptionConfirmed.PreviewProps = {
  firstName: 'Amelia',
  unsubscribeUrl: 'https://prisimwellness.com/unsubscribe',
} satisfies SubscriptionConfirmedProps;

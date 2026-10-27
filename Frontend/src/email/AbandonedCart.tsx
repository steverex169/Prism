import * as React from 'react';
import { CtaButton, EmailLayout, Hero, HelpLine, type LineItem, OrderItems, Signoff, Spacer } from '../component/email';
import { sampleItems } from './_sample';

export interface AbandonedCartProps {
  firstName: string;
  items: LineItem[];
  cartUrl: string;
  supportEmail?: string;
}

export const subject = () => 'You left something behind | Prisim Wellness';

export default function AbandonedCart(p: AbandonedCartProps) {
  return (
    <EmailLayout
      title={subject()}
      preview="Your selection is saved and waiting for you."
      footerReason="You're receiving this because you started a checkout at prisimwellness.com."
      supportEmail={p.supportEmail}
    >
      <Hero
        eyebrow="Still thinking it over?"
        headline={<>You left something<br />behind.</>}
        paragraphs={[`Dear ${p.firstName},`, "We've saved your selection so you can pick up right where you left off."]}
      />
      <OrderItems title="Your bag" items={p.items} />
      <Spacer height={40} />
      <CtaButton href={p.cartUrl}>Return to your bag</CtaButton>
      <Signoff>
        <HelpLine supportEmail={p.supportEmail} />
      </Signoff>
    </EmailLayout>
  );
}

AbandonedCart.PreviewProps = {
  firstName: 'Amelia',
  items: sampleItems,
  cartUrl: 'https://prisimwellness.com/cart/',
} satisfies AbandonedCartProps;

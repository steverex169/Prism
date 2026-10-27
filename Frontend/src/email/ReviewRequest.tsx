import * as React from 'react';
import { CtaButton, EmailLayout, Hero, type LineItem, OrderItems, Signoff, Spacer, StarRating } from '../component/email';
import { sampleItems } from './_sample';

export interface ReviewRequestProps {
  firstName: string;
  items: LineItem[];
  reviewUrl: string;
}

export const subject = () => 'How was your order? | Prisim Wellness';

export default function ReviewRequest(p: ReviewRequestProps) {
  return (
    <EmailLayout
      title={subject()}
      preview="Share your thoughts in under a minute. It helps others choose with confidence."
      footerReason="You're receiving this because you recently purchased from prisimwellness.com."
    >
      <Hero
        eyebrow="Your opinion matters"
        headline={<>How was<br />your order?</>}
        paragraphs={[
          `Dear ${p.firstName},`,
          "We'd love to hear what you think of your recent purchase. Your review helps others choose with confidence.",
        ]}
      />
      <OrderItems title="You purchased" items={p.items} />
      <StarRating reviewUrl={p.reviewUrl} />
      <Spacer height={28} />
      <CtaButton href={p.reviewUrl}>Write a review</CtaButton>
      <Signoff />
    </EmailLayout>
  );
}

ReviewRequest.PreviewProps = {
  firstName: 'Amelia',
  items: sampleItems,
  reviewUrl: 'https://prisimwellness.com/review/20931',
} satisfies ReviewRequestProps;

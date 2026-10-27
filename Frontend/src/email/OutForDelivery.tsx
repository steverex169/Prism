import * as React from 'react';
import { CtaButton, DetailsTable, EmailLayout, Hero, Note, Signoff, Spacer, Tracker } from '../component/email';

export interface OutForDeliveryProps {
  firstName: string;
  orderNumber: string;
  carrier: string;
  trackingNumber: string;
  trackingUrl: string;
}

export const subject = () => 'Arriving today | Prisim Wellness';

export default function OutForDelivery(p: OutForDeliveryProps) {
  return (
    <EmailLayout
      title={subject()}
      preview={`Your order ${p.orderNumber} is out for delivery today.`}
      footerReason="You're receiving this because you placed an order at prisimwellness.com."
    >
      <Hero
        eyebrow="Out for delivery"
        headline={<>Arriving<br />today.</>}
        paragraphs={[`Dear ${p.firstName},`, 'Your order is out for delivery and should reach you today.']}
      />
      <Tracker step={3} />
      <DetailsTable
        title="Shipment"
        rows={[
          { label: 'Order', value: p.orderNumber },
          { label: 'Carrier', value: p.carrier },
          { label: 'Tracking', value: p.trackingNumber },
        ]}
      />
      <Spacer height={36} />
      <CtaButton href={p.trackingUrl}>Track your parcel</CtaButton>
      <Note title="Not at home?">
        If no one is available, the carrier may leave a card or attempt redelivery. Check the tracking link for live updates.
      </Note>
      <Signoff />
    </EmailLayout>
  );
}

OutForDelivery.PreviewProps = {
  firstName: 'Amelia',
  orderNumber: '#PW-20931',
  carrier: 'UPS',
  trackingNumber: '1Z999AA10123',
  trackingUrl: 'https://www.ups.com/track?tracknum=1Z999AA10123',
} satisfies OutForDeliveryProps;

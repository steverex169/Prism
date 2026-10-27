import * as React from 'react';
import { Addresses, CtaButton, DetailsTable, EmailLayout, Hero, HelpLine, type LineItem, OrderItems, Signoff, Spacer, Tracker } from '../component/email';
import { sampleAddress, sampleItems } from './_sample';

export interface OrderShippedProps {
  firstName: string;
  orderNumber: string;
  carrier: string;
  trackingNumber: string;
  trackingUrl: string;
  estimatedDelivery: string;
  items: LineItem[];
  shippingAddress: string[];
  supportEmail?: string;
}

export const subject = () => 'Your order is on its way | Prisim Wellness';

export default function OrderShipped(p: OrderShippedProps) {
  return (
    <EmailLayout
      title={subject()}
      preview={`Order ${p.orderNumber} has been dispatched. Track it here.`}
      footerReason="You're receiving this because you placed an order at prisimwellness.com."
      supportEmail={p.supportEmail}
    >
      <Hero
        eyebrow="Dispatched"
        headline={<>Your order is<br />on its way.</>}
        paragraphs={[`Dear ${p.firstName},`, 'Good news. Your order has left our facility and is now with the carrier.']}
      />
      <Tracker step={2} />
      <DetailsTable
        title="Shipment"
        rows={[
          { label: 'Carrier', value: p.carrier },
          { label: 'Tracking', value: p.trackingNumber },
          { label: 'Estimated arrival', value: p.estimatedDelivery },
        ]}
      />
      <Spacer height={36} />
      <CtaButton href={p.trackingUrl}>Track your parcel</CtaButton>
      <OrderItems title="In this shipment" items={p.items} />
      <Addresses shippingAddress={p.shippingAddress} />
      <Signoff>
        <HelpLine supportEmail={p.supportEmail} />
      </Signoff>
    </EmailLayout>
  );
}

OrderShipped.PreviewProps = {
  firstName: 'Amelia',
  orderNumber: '#PW-20931',
  carrier: 'UPS',
  trackingNumber: '1Z999AA10123',
  trackingUrl: 'https://www.ups.com/track?tracknum=1Z999AA10123',
  estimatedDelivery: '30 Oct 2026',
  items: sampleItems,
  shippingAddress: sampleAddress,
} satisfies OrderShippedProps;

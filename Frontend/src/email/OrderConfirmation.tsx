import * as React from 'react';
import { Addresses, CtaButton, DetailsTable, EmailLayout, Hero, HelpLine, type LineItem, OrderItems, type OrderTotals, Signoff, Spacer } from '../component/email';
import { sampleAddress, sampleItems, sampleTotals } from './_sample';

export interface OrderConfirmationProps {
  firstName: string;
  orderNumber: string;
  orderDate: string;
  shippingMethod: string;
  items: LineItem[];
  totals: OrderTotals;
  shippingAddress: string[];
  paymentMethod: string;
  billingAddress: string[];
  orderUrl: string;
  supportEmail?: string;
}

export const subject = ({ orderNumber }: Pick<OrderConfirmationProps, 'orderNumber'>) => `Order ${orderNumber} confirmed | Prisim Wellness`;

export default function OrderConfirmation(p: OrderConfirmationProps) {
  return (
    <EmailLayout
      title={subject(p)}
      preview="Thank you for your order. We're preparing it now."
      footerReason="You're receiving this because you placed an order at prisimwellness.com."
      supportEmail={p.supportEmail}
    >
      <Hero
        eyebrow="Order confirmed"
        headline={<>Thank you<br />for your order.</>}
        paragraphs={[
          `Dear ${p.firstName},`,
          "Your order has been received and our team is now preparing it with care. We'll let you know the moment it's on its way.",
        ]}
      />
      <DetailsTable
        title="Order details"
        rows={[
          { label: 'Order', value: p.orderNumber },
          { label: 'Placed', value: p.orderDate },
          { label: 'Delivery', value: p.shippingMethod },
        ]}
      />
      <OrderItems items={p.items} totals={p.totals} />
      <Addresses shippingAddress={p.shippingAddress} paymentMethod={p.paymentMethod} billingAddress={p.billingAddress} />
      <Spacer height={40} />
      <CtaButton href={p.orderUrl}>View your order</CtaButton>
      <Signoff>
        <HelpLine supportEmail={p.supportEmail} />
      </Signoff>
    </EmailLayout>
  );
}

OrderConfirmation.PreviewProps = {
  firstName: 'Amelia',
  orderNumber: '#PW-20931',
  orderDate: '27 Oct 2026',
  shippingMethod: 'Express, 2-3 days',
  items: sampleItems,
  totals: sampleTotals,
  shippingAddress: sampleAddress,
  paymentMethod: 'Visa ending 4417',
  billingAddress: ['Same as shipping'],
  orderUrl: 'https://prisimwellness.com/my-account/orders/',
} satisfies OrderConfirmationProps;

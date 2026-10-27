import * as React from 'react';
import { EmailLayout, Hero, ProductFeature, Signoff } from '../component/email';
import { sampleImage } from './_sample';

export interface BackInStockProps {
  firstName: string;
  productName: string;
  productPrice: string;
  productImageUrl: string;
  productUrl: string;
}

export const subject = ({ productName }: Pick<BackInStockProps, 'productName'>) => `${productName} is back in stock | Prisim Wellness`;

export default function BackInStock(p: BackInStockProps) {
  return (
    <EmailLayout
      title={subject(p)}
      preview="The item you asked about is available again, in limited quantities."
      footerReason="You're receiving this because you requested a restock alert for this item."
    >
      <Hero
        eyebrow="Back in stock"
        headline="It's back."
        paragraphs={[`Dear ${p.firstName},`, "You asked us to let you know, so you're among the first to hear. Quantities are limited."]}
      />
      <ProductFeature name={p.productName} price={p.productPrice} imageUrl={p.productImageUrl} href={p.productUrl} />
      <Signoff />
    </EmailLayout>
  );
}

BackInStock.PreviewProps = {
  firstName: 'Amelia',
  productName: 'Recovery Complex',
  productPrice: '$59.00',
  productImageUrl: sampleImage,
  productUrl: 'https://prisimwellness.com/',
} satisfies BackInStockProps;

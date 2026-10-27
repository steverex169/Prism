// Sample data used only for previews (PreviewProps) and the render script.
import type { LineItem, OrderTotals } from '../component/email';

export const sampleImage = 'https://placehold.co/200x200/DCE8F2/0E2236?text=Prisim';

export const sampleItems: LineItem[] = [
  { name: 'Recovery Complex', variant: '60 capsules', quantity: 2, total: '$118.00', imageUrl: sampleImage },
];

export const sampleTotals: OrderTotals = {
  subtotal: '$118.00',
  shipping: '$8.00',
  discount: '−$10.00',
  tax: '$7.20',
  total: '$123.20',
};

export const sampleAddress = ['Amelia Hart', '120 Ocean Drive', 'Miami, FL 33139'];

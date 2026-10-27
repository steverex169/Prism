// Public entry: import any email component, or the registry, from here.
export { default as ContactFormConfirmation } from './ContactFormConfirmation';
export { default as WelcomeSignup } from './WelcomeSignup';
export { default as VerifyEmail } from './VerifyEmail';
export { default as PasswordResetRequest } from './PasswordResetRequest';
export { default as PasswordChanged } from './PasswordChanged';
export { default as OtpCode } from './OtpCode';
export { default as SubscriptionConfirmed } from './SubscriptionConfirmed';
export { default as OrderConfirmation } from './OrderConfirmation';
export { default as OrderOnHold } from './OrderOnHold';
export { default as OrderShipped } from './OrderShipped';
export { default as OutForDelivery } from './OutForDelivery';
export { default as OrderDelivered } from './OrderDelivered';
export { default as OrderCancelled } from './OrderCancelled';
export { default as RefundIssued } from './RefundIssued';
export { default as PaymentFailed } from './PaymentFailed';
export { default as AbandonedCart } from './AbandonedCart';
export { default as BackInStock } from './BackInStock';
export { default as ReturnReceived } from './ReturnReceived';
export { default as ReviewRequest } from './ReviewRequest';
export { default as CustomerNote } from './CustomerNote';
export { default as EmailChanged } from './EmailChanged';

export * from '../component/email';
export * from './theme';
export { renderEmail } from './render';

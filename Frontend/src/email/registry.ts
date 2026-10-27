import * as ContactFormConfirmation from './ContactFormConfirmation';
import * as WelcomeSignup from './WelcomeSignup';
import * as VerifyEmail from './VerifyEmail';
import * as PasswordResetRequest from './PasswordResetRequest';
import * as PasswordChanged from './PasswordChanged';
import * as OtpCode from './OtpCode';
import * as SubscriptionConfirmed from './SubscriptionConfirmed';
import * as OrderConfirmation from './OrderConfirmation';
import * as OrderOnHold from './OrderOnHold';
import * as OrderShipped from './OrderShipped';
import * as OutForDelivery from './OutForDelivery';
import * as OrderDelivered from './OrderDelivered';
import * as OrderCancelled from './OrderCancelled';
import * as RefundIssued from './RefundIssued';
import * as PaymentFailed from './PaymentFailed';
import * as AbandonedCart from './AbandonedCart';
import * as BackInStock from './BackInStock';
import * as ReturnReceived from './ReturnReceived';
import * as ReviewRequest from './ReviewRequest';
import * as CustomerNote from './CustomerNote';
import * as EmailChanged from './EmailChanged';

export const templates = {
  ContactFormConfirmation, WelcomeSignup, VerifyEmail, PasswordResetRequest, PasswordChanged,
  OtpCode, SubscriptionConfirmed, OrderConfirmation, OrderOnHold, OrderShipped,
  OutForDelivery, OrderDelivered, OrderCancelled, RefundIssued, PaymentFailed,
  AbandonedCart, BackInStock, ReturnReceived, ReviewRequest, CustomerNote, EmailChanged,
} as const;

export type TemplateName = keyof typeof templates;

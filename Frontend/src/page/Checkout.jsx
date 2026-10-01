import React, { useState } from "react";
import {
  LockKeyhole,
  CreditCard,
  Upload,
  DollarSign,
  ArrowRight,
  Check,
} from "lucide-react";

const Checkout = () => {
  const [selectedMethod, setSelectedMethod] = useState("card");

  const paymentMethods = [
    {
      id: "card",
      title: "Credit / Debit Card (or PayPal)",
    },
    {
      id: "cashapp",
      title: "Cash App",
      subtitle: "Pay securely with Cash App",
    },
    {
      id: "venmo",
      title: "Venmo",
      subtitle: "Pay securely with Venmo",
    },
  ];

  return (
    <div className="min-h-screen w-full bg-white px-4 py-8 sm:px-6 lg:px-10">
      <div className="mx-auto w-full max-w-7xl">

        {/* Page Heading */}
        <div className="mb-8 text-left sm:mb-10">
          <div className="mb-3 flex items-center gap-2 text-sm font-medium text-[#4388B8]">
            <LockKeyhole className="h-4 w-4" strokeWidth={2} />
            <span>Secure Checkout</span>
          </div>

          <h1 className="text-3xl font-bold tracking-tight text-[#12344D] sm:text-4xl">
            Checkout
          </h1>
        </div>

        {/* Main Layout */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">

          {/* LEFT COLUMN — PAYMENT METHODS */}
          <div className="flex flex-col">

            <div className="mb-5">
              <h2 className="text-xl font-semibold text-[#12344D] sm:text-2xl">
                Payment Method
              </h2>

              <p className="mt-1 text-sm text-[#7890A2]">
                Select one payment method to continue.
              </p>
            </div>

            {/* ONE SINGLE PAYMENT CONTAINER */}
            <div className="rounded-2xl border border-[#E1E8EE] bg-white p-3 shadow-[0_8px_30px_rgba(30,80,120,0.05)] sm:p-4">

              <div className="flex flex-col divide-y divide-[#E0E6EB]">

                {paymentMethods.map((method) => {
                  const isSelected = selectedMethod === method.id;

                  return (
                    <div
                      key={method.id}
                      className={`rounded-3xl border-2 py-4 first:pt-2 last:pb-4 sm:px-2 transition-colors duration-200 ${isSelected
                        ? "border-[#0B5FA5] bg-[#F5F9FF]/70"
                        : "border-transparent bg-transparent"
                        }`}
                    >

                      {/* Method Header */}
                      <button
                        type="button"
                        onClick={() => setSelectedMethod(method.id)}
                        className="flex w-full items-center gap-3 text-left"
                      >

                        {/* Checkbox */}
                        <span
                          className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-xl border transition ${isSelected
                            ? "border-[#0B5FA5] bg-[#0B5FA5]"
                            : "border-[#B8C8D4] bg-white"
                            }`}
                        >
                          {isSelected && (
                            <Check
                              className="h-3.5 w-3.5 text-white"
                              strokeWidth={3}
                            />
                          )}
                        </span>

                        {/* Payment Icon */}
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white">

                          {method.id === "card" && (
                            <span className="flex h-full w-full items-center justify-center rounded-xl bg-[#EEF5FF]">
                              <CreditCard className="h-5 w-5 text-[#003087]" />
                            </span>
                          )}

                          {method.id === "cashapp" && (
                            <span className="flex h-full w-full items-center justify-center rounded-xl bg-[#e6f9ec] text-3xl font-bold italic text-[#00A840]">
                              $
                            </span>
                          )}

                          {method.id === "venmo" && (
                            <span className="flex h-full w-full items-center justify-center rounded-xl bg-[#008CFF] text-3xl font-bold italic text-white">
                              v
                            </span>
                          )}

                        </div>

                        {/* Text */}
                        <div className="min-w-0 flex-1">

                          <h3 className="text-xs font-semibold text-[#173F59] sm:text-sm">
                            {method.title}
                          </h3>

                          {method.id === "card" ? (
                            <p className="mt-0.5 text-[10px] leading-relaxed text-[#7890A2] sm:text-xs">
                              No PayPal account needed. Secure card checkout by
                              PayPal, confirmed instantly.
                            </p>
                          ) : (
                            <p className="mt-0.5 text-[10px] text-[#7890A2] sm:text-xs">
                              {method.subtitle}
                            </p>
                          )}

                        </div>

                      </button>

                      {/* CARD LOGOS — ALWAYS VISIBLE */}
                      {method.id === "card" && (
                        <div className="ml-8 mt-3 flex items-center gap-2">

                          {/* Visa */}
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-[#E3E9EE] bg-white p-2">
                            <img
                              src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSNI8bbuu8MmiO60cZ4MiZlUTA6aRvmjIgdTd3GYLcs9UW49ntldimLSbs&s=10"
                              alt="Visa"
                              className="h-6 w-auto max-w-full object-contain"
                            />
                          </div>

                          {/* Mastercard */}
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-[#E3E9EE] bg-white p-2">
                            <img
                              src="https://download.logo.wine/logo/Mastercard/Mastercard-Logo.wine.png"
                              alt="Mastercard"
                              className="h-6 w-auto max-w-full object-contain"
                            />
                          </div>

                          {/* American Express */}
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-[#E3E9EE] bg-white p-2">
                            <img
                              src="https://logowik.com/content/uploads/images/amex-card1708.jpg"
                              alt="American Express"
                              className="h-7 w-auto max-w-full object-contain"
                            />
                          </div>

                          {/* Discover */}
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-[#E3E9EE] bg-white p-2">
                            <img
                              src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSweeRUqMFtxBXnsR8Lp0W4XiL2ADJADCU75sPDB2qRug&s=10"
                              alt="Discover"
                              className="h-7 w-auto max-w-full object-contain"
                            />
                          </div>

                        </div>
                      )}

                    </div>
                  );
                })}

                {/* WHATSAPP — NO CHECKBOX */}
                <div className="py-4">

                  <a
                    href="https://api.whatsapp.com/send/?phone=15617240734&text=Hi%2C+I%27d+like+help+with+payment+for+my+order.&type=phone_number&app_absent=0"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block"
                  >

                    <div className="flex items-center gap-3 p-2 w-full bg-gray-100 rounded-xl border border-[#E1E8EE]">

                      {/* Real WhatsApp Icon */}
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#E8F8EE]">
                        <img
                          src="data:image/png;base64,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"
                          alt="WhatsApp"
                          className="h-6 w-6 object-contain"
                        />
                      </div>

                      <div className="min-w-0 flex-1">

                        <h3 className="text-xs font-semibold text-[#173F59] sm:text-sm">
                          Prefer another way to pay?
                        </h3>

                        <p className="mt-1 text-[10px] leading-relaxed text-[#71899A] sm:text-xs">
                          Prefer another way to pay? <span className="font-bold">Chat with us on WhatsApp</span>
                        </p>

                      </div>

                      <ArrowRight className="ml-auto h-5 w-5 shrink-0 text-[#71899A]" />

                    </div>

                  </a>

                </div>

              </div>
            </div>
          </div>

          {/* RIGHT COLUMN — RESERVED FOR ORDER SUMMARY */}
          <div className="hidden lg:block">
            {/* Order summary / cart details can be added here */}
          </div>

        </div>

        {/* Security Footer */}
        <div className="mt-8 flex items-center justify-center gap-2 text-center text-xs text-[#8198A9]">
          <LockKeyhole className="h-3.5 w-3.5" />
          <span>
            Your payment information is handled securely.
          </span>
        </div>

      </div>
    </div>
  );
};

export default Checkout;
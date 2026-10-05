import React, { useEffect, useState } from "react";
import {
  LockKeyhole,
  CreditCard,
  ArrowRight,
  Check,
  UserRoundCheck,
  KeyRound,
  ShoppingBag,
} from "lucide-react";

import product1 from "../assets/product1.webp";
import product2 from "../assets/product2.webp";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "";

const SHIPPING_ID_KEY = "shippingId";
const SHIPPING_DRAFT_KEY = "shippingDraft";

const emptyShippingInfo = {
  fullName: "",
  email: "",
  phone: "",
  researchField: "",
  streetAddress: "",
  city: "",
  zipCode: "",
  state: "",
};

const Checkout = () => {
  const [selectedMethod, setSelectedMethod] = useState("card");
  const [selectedShipping, setSelectedShipping] = useState("standard");
  const [accountEnabled, setAccountEnabled] = useState(true);
  const [checkoutItems, setCheckoutItems] = useState([]);
  const [showPromo, setShowPromo] = useState(false);
  const [promoCode, setPromoCode] = useState("");
  const [promoApplied, setPromoApplied] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [shippingId, setShippingId] = useState(() => {
    return localStorage.getItem(SHIPPING_ID_KEY);
  });

  const [shippingLoading, setShippingLoading] = useState(true);
  const [shippingSaving, setShippingSaving] = useState(false);

  const [shippingInfo, setShippingInfo] = useState(() => {
    try {
      const savedDraft =
        localStorage.getItem(SHIPPING_DRAFT_KEY);

      if (savedDraft) {
        const parsedDraft = JSON.parse(savedDraft);

        return {
          ...emptyShippingInfo,
          ...parsedDraft,
        };
      }
    } catch (error) {
      console.error(
        "Failed to load shipping draft:",
        error
      );
    }

    return emptyShippingInfo;
  });

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

  const usStates = [
    "Alabama",
    "Alaska",
    "Arizona",
    "Arkansas",
    "California",
    "Colorado",
    "Connecticut",
    "Delaware",
    "Florida",
    "Georgia",
    "Hawaii",
    "Idaho",
    "Illinois",
    "Indiana",
    "Iowa",
    "Kansas",
    "Kentucky",
    "Louisiana",
    "Maine",
    "Maryland",
    "Massachusetts",
    "Michigan",
    "Minnesota",
    "Mississippi",
    "Missouri",
    "Montana",
    "Nebraska",
    "Nevada",
    "New Hampshire",
    "New Jersey",
    "New Mexico",
    "New York",
    "North Carolina",
    "North Dakota",
    "Ohio",
    "Oklahoma",
    "Oregon",
    "Pennsylvania",
    "Rhode Island",
    "South Carolina",
    "South Dakota",
    "Tennessee",
    "Texas",
    "Utah",
    "Vermont",
    "Virginia",
    "Washington",
    "West Virginia",
    "Wisconsin",
    "Wyoming",
  ];

  const researchFields = [
    "Pharmacology / Drug Discovery",
    "Biochemistry & Molecular Biology",
    "Academic Research",
    "Contract Research Organization (CRO)",
    "Analytical Chemistry Laboratory",
    "Other Qualified Research (specify)",
  ];

  /*
   * HANDLE SHIPPING FIELD CHANGE
   *
   * Immediately save the form to localStorage.
   * This means the form survives a page refresh even
   * before the backend shipping record is created.
   */
  const handleShippingChange = (e) => {
    const { name, value } = e.target;

    setShippingInfo((prev) => {
      const updatedInfo = {
        ...prev,
        [name]: value,
      };

      try {
        localStorage.setItem(
          SHIPPING_DRAFT_KEY,
          JSON.stringify(updatedInfo)
        );
      } catch (error) {
        console.error(
          "Failed to save shipping draft:",
          error
        );
      }

      return updatedInfo;
    });
  };

  /*
   * LOAD CHECKOUT ITEMS
   */
  useEffect(() => {
    try {
      const savedItems =
        localStorage.getItem("checkoutItems");

      if (savedItems) {
        const parsedItems = JSON.parse(savedItems);

        if (Array.isArray(parsedItems)) {
          setCheckoutItems(parsedItems);
        }
      }
    } catch (error) {
      console.error(
        "Failed to load checkout items:",
        error
      );

      setCheckoutItems([]);
    }
  }, []);

  /*
   * LOAD SAVED SHIPPING INFORMATION
   *
   * First restore the local draft.
   *
   * Then, if a shippingId exists, load the actual
   * shipping record from the backend.
   */
  useEffect(() => {
    const loadSavedShipping = async () => {
      try {
        const savedDraft =
          localStorage.getItem(SHIPPING_DRAFT_KEY);

        if (savedDraft) {
          try {
            const parsedDraft =
              JSON.parse(savedDraft);

            setShippingInfo({
              ...emptyShippingInfo,
              ...parsedDraft,
            });
          } catch (error) {
            console.error(
              "Failed to parse shipping draft:",
              error
            );
          }
        }

        const savedShippingId =
          localStorage.getItem(SHIPPING_ID_KEY);

        if (!savedShippingId) {
          return;
        }

        setShippingId(savedShippingId);

        const response = await fetch(
          `${API_BASE_URL}/shipping/${savedShippingId}`,
          {
            method: "GET",
            credentials: "include",
          }
        );

        if (response.status === 404) {
          /*
           * Shipping record no longer exists.
           * Remove stale ID but keep the local draft.
           */
          localStorage.removeItem(
            SHIPPING_ID_KEY
          );

          setShippingId(null);

          return;
        }

        const contentType =
          response.headers.get("content-type");

        if (
          !contentType?.includes(
            "application/json"
          )
        ) {
          throw new Error(
            "Server returned an invalid shipping response."
          );
        }

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.detail ||
            "Failed to load shipping information."
          );
        }

        const loadedShippingInfo = {
          fullName: data.full_name || "",
          email: data.email || "",
          phone: data.phone || "",
          researchField:
            data.research_field || "",
          streetAddress:
            data.street_address || "",
          city: data.city || "",
          zipCode: data.zip_code || "",
          state: data.state || "",
        };

        setShippingInfo(loadedShippingInfo);

        setShippingId(String(data.id));

        localStorage.setItem(
          SHIPPING_ID_KEY,
          String(data.id)
        );

        /*
         * Keep the local draft synchronized with
         * the backend record.
         */
        localStorage.setItem(
          SHIPPING_DRAFT_KEY,
          JSON.stringify(loadedShippingInfo)
        );
      } catch (error) {
        console.error(
          "Failed to load saved shipping information:",
          error
        );
      } finally {
        setShippingLoading(false);
      }
    };

    loadSavedShipping();
  }, []);

  /*
   * CHECK IF ALL SHIPPING FIELDS ARE COMPLETE
   */
  const isShippingComplete = () => {
    return (
      shippingInfo.fullName.trim() &&
      shippingInfo.email.trim() &&
      shippingInfo.phone.trim() &&
      shippingInfo.researchField.trim() &&
      shippingInfo.streetAddress.trim() &&
      shippingInfo.city.trim() &&
      shippingInfo.zipCode.trim() &&
      shippingInfo.state.trim()
    );
  };

  /*
   * CREATE OR UPDATE SHIPPING INFORMATION
   *
   * If shippingId exists:
   *     PUT /shipping/{id}
   *
   * If no shippingId exists:
   *     POST /shipping/
   *
   * If an old shippingId returns 404,
   * create a new record automatically.
   */
  const saveShippingInformation = async () => {
    if (shippingSaving) {
      return false;
    }

    const cleanData = {
      full_name:
        shippingInfo.fullName.trim(),

      email:
        shippingInfo.email.trim(),

      phone:
        shippingInfo.phone.trim(),

      research_field:
        shippingInfo.researchField.trim(),

      street_address:
        shippingInfo.streetAddress.trim(),

      city:
        shippingInfo.city.trim(),

      zip_code:
        shippingInfo.zipCode.trim(),

      state:
        shippingInfo.state.trim(),
    };

    /*
     * Do not send incomplete data to the backend.
     *
     * The localStorage draft has already been saved,
     * so the information will still survive refresh.
     */
    if (
      !cleanData.full_name ||
      !cleanData.email ||
      !cleanData.phone ||
      !cleanData.research_field ||
      !cleanData.street_address ||
      !cleanData.city ||
      !cleanData.zip_code ||
      !cleanData.state
    ) {
      return false;
    }

    try {
      setShippingSaving(true);

      let response;

      /*
       * UPDATE EXISTING SHIPPING RECORD
       */
      if (shippingId) {
        response = await fetch(
          `${API_BASE_URL}/shipping/${shippingId}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify(cleanData),
          }
        );

        /*
         * If the stored ID is no longer valid,
         * create a new shipping record.
         */
        if (response.status === 404) {
          localStorage.removeItem(
            SHIPPING_ID_KEY
          );

          setShippingId(null);

          response = await fetch(
            `${API_BASE_URL}/shipping/`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              credentials: "include",
              body: JSON.stringify(cleanData),
            }
          );
        }
      } else {
        /*
         * CREATE NEW SHIPPING RECORD
         */
        response = await fetch(
          `${API_BASE_URL}/shipping/`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify(cleanData),
          }
        );
      }

      const contentType =
        response.headers.get("content-type");

      if (
        !contentType?.includes(
          "application/json"
        )
      ) {
        throw new Error(
          "Server returned an invalid shipping response."
        );
      }

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.detail ||
          "Failed to save shipping information."
        );
      }

      /*
       * Save the backend ID.
       */
      const newShippingId =
        String(data.id);

      setShippingId(newShippingId);

      localStorage.setItem(
        SHIPPING_ID_KEY,
        newShippingId
      );

      /*
       * Keep local draft synchronized with the
       * successfully saved backend record.
       */
      const savedShippingInfo = {
        fullName:
          data.full_name ||
          cleanData.full_name,

        email:
          data.email ||
          cleanData.email,

        phone:
          data.phone ||
          cleanData.phone,

        researchField:
          data.research_field ||
          cleanData.research_field,

        streetAddress:
          data.street_address ||
          cleanData.street_address,

        city:
          data.city ||
          cleanData.city,

        zipCode:
          data.zip_code ||
          cleanData.zip_code,

        state:
          data.state ||
          cleanData.state,
      };

      setShippingInfo(
        savedShippingInfo
      );

      localStorage.setItem(
        SHIPPING_DRAFT_KEY,
        JSON.stringify(
          savedShippingInfo
        )
      );

      console.log(
        "Shipping information saved successfully:",
        data
      );

      return true;
    } catch (error) {
      console.error(
        "Failed to save shipping information:",
        error
      );

      return false;
    } finally {
      setShippingSaving(false);
    }
  };

  /*
   * SAVE SHIPPING INFORMATION WHEN USER
   * LEAVES A FIELD.
   *
   * The field is already saved to localStorage
   * on every change, so this additionally attempts
   * to save the complete information to MySQL.
   */
  const handleShippingBlur = async () => {
    if (!isShippingComplete()) {
      return;
    }

    await saveShippingInformation();
  };

  /*
   * EMAIL BLUR
   *
   * We no longer search by email because the existing
   * backend endpoint works with shipping ID.
   *
   * If all fields are complete, save the record.
   */
  const handleEmailBlur = async () => {
    if (!isShippingComplete()) {
      return;
    }

    await saveShippingInformation();
  };

  /*
   * PLACE ORDER
   */
  const handlePlaceOrder = async () => {
    if (isSubmitting) {
      return;
    }

    if (checkoutItems.length === 0) {
      alert("Your cart is empty.");
      return;
    }

    const requiredFields = [
      ["Full Name", shippingInfo.fullName],
      ["Email", shippingInfo.email],
      ["Phone", shippingInfo.phone],
      ["Research Field", shippingInfo.researchField],
      ["Street Address", shippingInfo.streetAddress],
      ["City", shippingInfo.city],
      ["ZIP Code", shippingInfo.zipCode],
      ["State", shippingInfo.state],
    ];

    const missingField = requiredFields.find(
      ([, value]) => !String(value || "").trim()
    );

    if (missingField) {
      alert(`Please enter your ${missingField[0]}.`);
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(shippingInfo.email.trim())) {
      alert("Please enter a valid email address.");
      return;
    }

    setIsSubmitting(true);

    try {
      const shippingSaved = await saveShippingInformation();

      if (!shippingSaved) {
        throw new Error(
          "Unable to save your shipping information. Please try again."
        );
      }

      const subtotal =
        checkoutItems.reduce(
          (total, item) =>
            total +
            Number(item.price) *
            Number(item.quantity),
          0
        );

      const discount = promoApplied
        ? subtotal * 0.1
        : 0;

      const shipping =
        selectedShipping === "overnight"
          ? 75
          : 19.99;

      const finalTotal =
        subtotal -
        discount +
        shipping;

      const totalItems =
        checkoutItems.reduce(
          (total, item) =>
            total +
            Number(item.quantity),
          0
        );

      const paymentMethod =
        selectedMethod === "card"
          ? "Credit / Debit Card"
          : selectedMethod ===
            "cashapp"
            ? "Cash App"
            : "Venmo";

      const orderNumber =
        `ORD-${Date.now()}`;

      const orderData = {
        order_number:
          orderNumber,

        customer_name:
          shippingInfo.fullName.trim(),

        customer_email:
          shippingInfo.email.trim(),

        research_field:
          shippingInfo.researchField.trim(),

        items:
          totalItems,

        total:
          Math.round(finalTotal),

        payment:
          "Unpaid",

        payment_method:
          paymentMethod,

        status:
          "pending",
      };

      /*
       * CREATE ORDER
       */
      const response =
        await fetch(
          `${API_BASE_URL}/orders/`,
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            credentials:
              "include",

            body:
              JSON.stringify(
                orderData
              ),
          }
        );

      const contentType =
        response.headers.get(
          "content-type"
        );

      if (
        !contentType?.includes(
          "application/json"
        )
      ) {
        throw new Error(
          "Server returned an invalid response."
        );
      }

      const data =
        await response.json();

      if (!response.ok) {
        throw new Error(
          data.detail ||
          "Failed to create order."
        );
      }

      console.log(
        "Order created successfully:",
        data
      );

      /*
       * Only checkout items are cleared.
       *
       * shippingId and shippingDraft remain
       * so the customer's shipping information
       * remains available for the next checkout.
       */
      localStorage.removeItem(
        "checkoutItems"
      );

      setCheckoutItems([]);

      alert(
        `Order ${data.order_number} created successfully.`
      );
    } catch (error) {
      console.error(
        "Order creation failed:",
        error
      );

      alert(
        error.message ||
        "Unable to create your order."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-white px-4 py-8 sm:px-6 lg:px-10">
      <div className="mx-auto w-full max-w-7xl">

        {/* PAGE HEADING */}
        <div className="mb-8 text-left sm:mb-10">
          <div className="mb-3 flex items-center gap-2 text-sm font-medium text-[#4388B8]">
            <LockKeyhole
              className="h-4 w-4"
              strokeWidth={2}
            />
            <span>
              Secure Checkout
            </span>
          </div>

          <h1 className="text-3xl font-bold tracking-tight text-[#1E293B] sm:text-4xl">
            Checkout
          </h1>
        </div>

        {/* MAIN LAYOUT */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">

          {/* LEFT COLUMN */}
          <div className="flex flex-col">

            {/* STEP 1 — PAYMENT METHOD */}
            <div className="rounded-2xl border border-[#E2E8F0] bg-white p-4 shadow-[0_8px_30px_rgba(30,80,120,0.05)] sm:p-6">

              <div className="mb-6 flex items-start gap-3">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#203559] text-sm font-bold text-white">
                  1
                </span>

                <div>
                  <h2 className="text-xl font-semibold text-[#1E293B] sm:text-2xl">
                    Payment Method
                  </h2>

                  <p className="mt-1 text-sm text-[#64748B]">
                    Choose how you'd like to pay for your order.
                  </p>
                </div>
              </div>

              <div className="rounded-2xl bg-white p-3">
                <div className="flex flex-col divide-y divide-[#E2E8F0]">

                  {paymentMethods.map(
                    (method) => {
                      const isSelected =
                        selectedMethod ===
                        method.id;

                      return (
                        <div
                          key={method.id}
                          className={`rounded-3xl border-2 py-4 first:pt-2 last:pb-4 sm:px-2 transition-colors duration-200 ${isSelected
                            ? "border-[#0B5FA5] bg-[#F5F9FF]/70"
                            : "border-transparent bg-transparent"
                            }`}
                        >

                          <button
                            type="button"
                            onClick={() =>
                              setSelectedMethod(
                                method.id
                              )
                            }
                            className="flex w-full items-center gap-3 text-left"
                          >

                            <span
                              className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-xl border transition ${isSelected
                                ? "border-[#0B5FA5] bg-[#0B5FA5]"
                                : "border-[#CBD5E1] bg-white"
                                }`}
                            >
                              {isSelected && (
                                <Check
                                  className="h-3.5 w-3.5 text-white"
                                  strokeWidth={3}
                                />
                              )}
                            </span>

                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white">

                              {method.id ===
                                "card" && (
                                  <span className="flex h-full w-full items-center justify-center rounded-xl bg-[#EEF5FF]">
                                    <CreditCard className="h-5 w-5 text-[#003087]" />
                                  </span>
                                )}

                              {method.id ===
                                "cashapp" && (
                                  <span className="flex h-full w-full items-center justify-center rounded-xl bg-[#e6f9ec] text-3xl font-bold italic text-[#00A840]">
                                    $
                                  </span>
                                )}

                              {method.id ===
                                "venmo" && (
                                  <span className="flex h-full w-full items-center justify-center rounded-xl bg-[#008CFF] text-3xl font-bold italic text-white">
                                    v
                                  </span>
                                )}

                            </div>

                            <div className="min-w-0 flex-1">
                              <h3 className="text-xs font-semibold text-[#1E293B] sm:text-sm">
                                {method.title}
                              </h3>

                              {method.id ===
                                "card" ? (
                                <p className="mt-0.5 text-[10px] leading-relaxed text-[#64748B] sm:text-xs">
                                  No PayPal account needed. Secure card checkout by
                                  PayPal, confirmed instantly.
                                </p>
                              ) : (
                                <p className="mt-0.5 text-[10px] text-[#64748B] sm:text-xs">
                                  {method.subtitle}
                                </p>
                              )}
                            </div>

                          </button>

                          {method.id ===
                            "card" && (
                              <div className="ml-8 mt-3 flex items-center gap-2">

                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-[#E2E8F0] bg-white p-2">
                                  <img
                                    src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSNI8bbuu8MmiO60cZ4MiZlUTA6aRvmjIgdTd3GYLcs9UW49ntldimLSbs&s=10"
                                    alt="Visa"
                                    className="h-6 w-auto max-w-full object-contain"
                                  />
                                </div>

                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-[#E2E8F0] bg-white p-2">
                                  <img
                                    src="https://download.logo.wine/logo/Mastercard/Mastercard-Logo.wine.png"
                                    alt="Mastercard"
                                    className="h-6 w-auto max-w-full object-contain"
                                  />
                                </div>

                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-[#E2E8F0] bg-white p-2">
                                  <img
                                    src="https://logowik.com/content/uploads/images/amex-card1708.jpg"
                                    alt="American Express"
                                    className="h-7 w-auto max-w-full object-contain"
                                  />
                                </div>

                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-[#E2E8F0] bg-white p-2">
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
                    }
                  )}

                  {/* WHATSAPP */}
                  <div className="py-4">
                    <a
                      href="https://api.whatsapp.com/send/?phone=15617240734&text=Hi%2C+I%27d+like+help+with+payment+for+my+order.&type=phone_number&app_absent=0"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block"
                    >
                      <div className="flex w-full items-center gap-3 rounded-xl border border-[#E2E8F0] bg-gray-100 p-2">

                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#E8F8EE]">
                          <span className="text-lg font-bold text-[#00A840]">
                            WA
                          </span>
                        </div>

                        <div className="min-w-0 flex-1">
                          <h3 className="text-xs font-semibold text-[#1E293B] sm:text-sm">
                            Prefer another way to pay?
                          </h3>

                          <p className="mt-1 text-[10px] leading-relaxed text-[#64748B] sm:text-xs">
                            Prefer another way to pay?{" "}
                            <span className="font-bold">
                              Chat with us on WhatsApp
                            </span>
                          </p>
                        </div>

                        <ArrowRight className="ml-auto h-5 w-5 shrink-0 text-[#64748B]" />

                      </div>
                    </a>
                  </div>

                </div>
              </div>
            </div>

            {/* STEP 2 — SHIPPING INFORMATION */}
            <div className="mt-8 rounded-2xl border border-[#E2E8F0] bg-white p-4 shadow-[0_8px_30px_rgba(30,80,120,0.05)] sm:p-6">

              <div className="mb-6 flex items-start gap-3">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#203559] text-sm font-bold text-white">
                  2
                </span>

                <div>
                  <h2 className="text-xl font-semibold text-[#1E293B] sm:text-2xl">
                    Shipping Information
                  </h2>

                  <p className="mt-1 text-sm text-[#64748B]">
                    Enter the information where you'd like your order shipped.
                  </p>
                </div>
              </div>

              {shippingLoading && (
                <div className="mb-5 rounded-xl border border-[#DBEAFE] bg-[#EFF6FF] px-4 py-3">
                  <p className="text-xs font-medium text-[#0D59F2]">
                    Loading your saved shipping information...
                  </p>
                </div>
              )}

              {shippingSaving && (
                <div className="mb-5 rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] px-4 py-3">
                  <p className="text-xs font-medium text-[#64748B]">
                    Saving shipping information...
                  </p>
                </div>
              )}

              <div className="space-y-5">

                {/* FULL NAME */}
                <div>
                  <label
                    htmlFor="fullName"
                    className="mb-2 block text-sm font-medium text-[#1E293B]"
                  >
                    Full Name{" "}
                    <span className="text-[#EF4444]">
                      *
                    </span>
                  </label>

                  <input
                    id="fullName"
                    name="fullName"
                    type="text"
                    value={
                      shippingInfo.fullName
                    }
                    onChange={
                      handleShippingChange
                    }
                    onBlur={
                      handleShippingBlur
                    }
                    required
                    placeholder="Enter your full name"
                    className="h-12 w-full rounded-xl border border-[#E2E8F0] bg-white px-4 text-sm text-[#1E293B] outline-none transition placeholder:text-[#94A3B8] focus:border-[#94A3B8] focus:ring-2 focus:ring-[#DBEAFE]"
                  />
                </div>

                {/* EMAIL + PHONE */}
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">

                  <div>
                    <label
                      htmlFor="email"
                      className="mb-2 block text-sm font-medium text-[#1E293B]"
                    >
                      Email{" "}
                      <span className="text-[#EF4444]">
                        *
                      </span>
                    </label>

                    <input
                      id="email"
                      name="email"
                      type="email"
                      value={
                        shippingInfo.email
                      }
                      onChange={
                        handleShippingChange
                      }
                      onBlur={
                        handleEmailBlur
                      }
                      required
                      placeholder="Enter your email"
                      className="h-12 w-full rounded-xl border border-[#E2E8F0] bg-white px-4 text-sm text-[#1E293B] outline-none transition placeholder:text-[#94A3B8] focus:border-[#94A3B8] focus:ring-2 focus:ring-[#DBEAFE]"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="phone"
                      className="mb-2 block text-sm font-medium text-[#1E293B]"
                    >
                      Phone{" "}
                      <span className="text-[#EF4444]">
                        *
                      </span>
                    </label>

                    <input
                      id="phone"
                      name="phone"
                      type="tel"
                      value={
                        shippingInfo.phone
                      }
                      onChange={
                        handleShippingChange
                      }
                      onBlur={
                        handleShippingBlur
                      }
                      required
                      placeholder="Enter your phone number"
                      className="h-12 w-full rounded-xl border border-[#E2E8F0] bg-white px-4 text-sm text-[#1E293B] outline-none transition placeholder:text-[#94A3B8] focus:border-[#94A3B8] focus:ring-2 focus:ring-[#DBEAFE]"
                    />
                  </div>

                </div>

                {/* RESEARCH FIELD */}
                <div>
                  <label
                    htmlFor="researchField"
                    className="mb-2 block text-sm font-medium text-[#1E293B]"
                  >
                    Field of Qualified Research (required for account set up and purchase){" "}
                    <span className="text-[#EF4444]">
                      *
                    </span>
                  </label>

                  <select
                    id="researchField"
                    name="researchField"
                    value={
                      shippingInfo.researchField
                    }
                    onChange={
                      handleShippingChange
                    }
                    onBlur={
                      handleShippingBlur
                    }
                    required
                    className={`h-12 w-full rounded-xl border border-[#E2E8F0] bg-white px-4 text-sm outline-none transition focus:border-[#94A3B8] focus:ring-2 focus:ring-[#DBEAFE] ${shippingInfo.researchField
                      ? "text-[#1E293B]"
                      : "text-[#94A3B8]"
                      }`}
                  >
                    <option
                      value=""
                      disabled
                    >
                      Select your research field
                    </option>

                    {researchFields.map(
                      (field) => (
                        <option
                          key={field}
                          value={field}
                        >
                          {field}
                        </option>
                      )
                    )}
                  </select>

                  <p className="mt-2 text-xs text-[#64748B]">
                    Please identify the field of research associated with your purchase.
                  </p>
                </div>

                {/* STREET ADDRESS */}
                <div>
                  <label
                    htmlFor="streetAddress"
                    className="mb-2 block text-sm font-medium text-[#1E293B]"
                  >
                    Street Address{" "}
                    <span className="text-[#EF4444]">
                      *
                    </span>
                  </label>

                  <input
                    id="streetAddress"
                    name="streetAddress"
                    type="text"
                    value={
                      shippingInfo.streetAddress
                    }
                    onChange={
                      handleShippingChange
                    }
                    onBlur={
                      handleShippingBlur
                    }
                    required
                    placeholder="Enter your street address"
                    className="h-12 w-full rounded-xl border border-[#E2E8F0] bg-white px-4 text-sm text-[#1E293B] outline-none transition placeholder:text-[#94A3B8] focus:border-[#94A3B8] focus:ring-2 focus:ring-[#DBEAFE]"
                  />
                </div>

                {/* CITY + ZIP + STATE */}
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">

                  {/* CITY */}
                  <div>
                    <label
                      htmlFor="city"
                      className="mb-2 block text-sm font-medium text-[#1E293B]"
                    >
                      City{" "}
                      <span className="text-[#EF4444]">
                        *
                      </span>
                    </label>

                    <input
                      id="city"
                      name="city"
                      type="text"
                      value={
                        shippingInfo.city
                      }
                      onChange={
                        handleShippingChange
                      }
                      onBlur={
                        handleShippingBlur
                      }
                      required
                      placeholder="City"
                      className="h-12 w-full rounded-xl border border-[#E2E8F0] bg-white px-4 text-sm text-[#1E293B] outline-none transition placeholder:text-[#94A3B8] focus:border-[#94A3B8] focus:ring-2 focus:ring-[#DBEAFE]"
                    />
                  </div>

                  {/* ZIP CODE */}
                  <div>
                    <label
                      htmlFor="zipCode"
                      className="mb-2 block text-sm font-medium text-[#1E293B]"
                    >
                      ZIP Code{" "}
                      <span className="text-[#EF4444]">
                        *
                      </span>
                    </label>

                    <input
                      id="zipCode"
                      name="zipCode"
                      type="text"
                      inputMode="numeric"
                      value={
                        shippingInfo.zipCode
                      }
                      onChange={
                        handleShippingChange
                      }
                      onBlur={
                        handleShippingBlur
                      }
                      required
                      placeholder="ZIP code"
                      className="h-12 w-full rounded-xl border border-[#E2E8F0] bg-white px-4 text-sm text-[#1E293B] outline-none transition placeholder:text-[#94A3B8] focus:border-[#94A3B8] focus:ring-2 focus:ring-[#DBEAFE]"
                    />
                  </div>

                  {/* STATE */}
                  <div>
                    <label
                      htmlFor="state"
                      className="mb-2 block text-sm font-medium text-[#1E293B]"
                    >
                      State{" "}
                      <span className="text-[#EF4444]">
                        *
                      </span>
                    </label>

                    <select
                      id="state"
                      name="state"
                      value={
                        shippingInfo.state
                      }
                      onChange={
                        handleShippingChange
                      }
                      onBlur={
                        handleShippingBlur
                      }
                      required
                      className={`h-12 w-full rounded-xl border border-[#E2E8F0] bg-white px-4 text-sm outline-none transition focus:border-[#94A3B8] focus:ring-2 focus:ring-[#DBEAFE] ${shippingInfo.state
                        ? "text-[#1E293B]"
                        : "text-[#94A3B8]"
                        }`}
                    >
                      <option
                        value=""
                        disabled
                      >
                        Select state
                      </option>

                      {usStates.map(
                        (state) => (
                          <option
                            key={state}
                            value={state}
                          >
                            {state}
                          </option>
                        )
                      )}
                    </select>
                  </div>

                </div>

              </div>
            </div>

            {/* STEP 3 — SHIPPING METHOD */}
            <div className="mt-8 rounded-2xl border border-[#E2E8F0] bg-white p-4 shadow-[0_8px_30px_rgba(30,80,120,0.05)] sm:p-6">

              <div className="mb-6 flex items-start gap-3">

                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#203559] text-sm font-bold text-white">
                  3
                </span>

                <div>
                  <h2 className="text-xl font-semibold text-[#1E293B] sm:text-2xl">
                    Shipping Method
                  </h2>

                  <p className="mt-1 text-sm text-[#64748B]">
                    Choose your preferred shipping method.
                  </p>
                </div>

              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">

                {/* STANDARD SHIPPING */}
                <button
                  type="button"
                  onClick={() =>
                    setSelectedShipping(
                      "standard"
                    )
                  }
                  className={`w-full rounded-xl border p-4 text-left transition ${selectedShipping ===
                    "standard"
                    ? "border-[#0B5FA5] bg-[#F5F9FF]"
                    : "border-[#E2E8F0] bg-white hover:border-[#94A3B8] hover:bg-[#F8FAFC]"
                    }`}
                >
                  <div className="flex items-center justify-between gap-4">

                    <div className="flex items-center gap-3">

                      <span
                        className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border ${selectedShipping ===
                          "standard"
                          ? "border-[#0B5FA5] bg-[#0B5FA5]"
                          : "border-[#CBD5E1] bg-white"
                          }`}
                      >
                        {selectedShipping ===
                          "standard" && (
                            <Check
                              className="h-3 w-3 text-white"
                              strokeWidth={3}
                            />
                          )}
                      </span>

                      <div>
                        <p className="font-semibold text-[#1E293B]">
                          Standard Shipping
                        </p>

                        <p className="mt-1 text-sm text-[#64748B]">
                          Regular delivery
                        </p>
                      </div>

                    </div>

                    <span className="shrink-0 text-base font-semibold text-[#1E293B]">
                      $19.99
                    </span>

                  </div>
                </button>

                {/* OVERNIGHT */}
                <button
                  type="button"
                  onClick={() =>
                    setSelectedShipping(
                      "overnight"
                    )
                  }
                  className={`w-full rounded-xl border p-4 text-left transition ${selectedShipping ===
                    "overnight"
                    ? "border-[#0B5FA5] bg-[#F5F9FF]"
                    : "border-[#E2E8F0] bg-white hover:border-[#94A3B8] hover:bg-[#F8FAFC]"
                    }`}
                >
                  <div className="flex items-center justify-between gap-4">

                    <div className="flex items-center gap-3">

                      <span
                        className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border ${selectedShipping ===
                          "overnight"
                          ? "border-[#0B5FA5] bg-[#0B5FA5]"
                          : "border-[#CBD5E1] bg-white"
                          }`}
                      >
                        {selectedShipping ===
                          "overnight" && (
                            <Check
                              className="h-3 w-3 text-white"
                              strokeWidth={3}
                            />
                          )}
                      </span>

                      <div>
                        <p className="font-semibold text-[#1E293B]">
                          Overnight
                        </p>

                        <p className="mt-1 text-sm text-[#64748B]">
                          Order by 1 PM EST
                        </p>
                      </div>

                    </div>

                    <span className="shrink-0 text-base font-semibold text-[#1E293B]">
                      $75.00
                    </span>

                  </div>
                </button>

              </div>
            </div>

            {/* STEP 4 — ACCOUNT / GUEST CHECKOUT */}
            <div className="mt-8 rounded-2xl border border-[#E2E8F0] bg-white p-4 shadow-[0_8px_30px_rgba(30,80,120,0.05)] sm:p-6">

              <div className="flex items-center justify-between gap-4">

                <div className="flex min-w-0 items-center gap-3">

                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#0052FF] to-[#00A3FF] shadow-sm">
                    <UserRoundCheck
                      className="h-5 w-5 text-white"
                      strokeWidth={2}
                    />
                  </div>

                  <div className="min-w-0">
                    <h2 className="text-base font-semibold text-[#1E293B] sm:text-lg">
                      Create an Account
                    </h2>

                    <p className="mt-0.5 text-xs text-[#64748B] sm:text-sm">
                      Save your information for faster checkout.
                    </p>
                  </div>

                </div>

                <div className="flex shrink-0 items-center gap-2">

                  <span
                    className={`text-xs font-bold uppercase tracking-wide ${accountEnabled
                      ? "text-[#0066FF]"
                      : "text-[#94A3B8]"
                      }`}
                  >
                    {accountEnabled
                      ? "ON"
                      : "OFF"}
                  </span>

                  <button
                    type="button"
                    role="switch"
                    aria-checked={
                      accountEnabled
                    }
                    aria-label="Create an account"
                    onClick={() =>
                      setAccountEnabled(
                        (prev) =>
                          !prev
                      )
                    }
                    className={`relative flex h-7 w-12 shrink-0 items-center rounded-full p-1 transition-colors duration-200 hover:cursor-pointer ${accountEnabled
                      ? "bg-[#0066FF]"
                      : "bg-[#CBD5E1]"
                      }`}
                  >
                    <span
                      className={`h-5 w-5 rounded-full bg-white shadow-sm transition-transform duration-200 ${accountEnabled
                        ? "translate-x-5"
                        : "translate-x-0"
                        }`}
                    />
                  </button>

                </div>

              </div>

              <div
                className={`mt-5 flex items-start gap-3 rounded-xl border p-4 transition-colors duration-200 ${accountEnabled
                  ? "border-[#BFDBFE] bg-[#EFF6FF]"
                  : "border-[#BFDBFE] bg-transparent"
                  }`}
              >

                <div
                  className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${accountEnabled
                    ? "bg-[#DBEAFE]"
                    : "bg-transparent"
                    }`}
                >
                  <KeyRound
                    className="h-4 w-4 text-[#0066FF]"
                    strokeWidth={2.2}
                  />
                </div>

                <div>

                  {accountEnabled ? (
                    <p className="mt-1 text-xs leading-relaxed text-[#64748B]">
                      Your login credentials will be sent with your order confirmation email so you can sign in right away.
                    </p>
                  ) : (
                    <p className="mt-1 text-xs leading-relaxed text-[#64748B]">
                      Your order will be placed as a guest. You can still activate an account later via the link in your confirmation email.
                    </p>
                  )}

                </div>

              </div>

            </div>

          </div>

          {/* RIGHT COLUMN — ORDER SUMMARY */}
          <div className="hidden lg:block">
            <div className="sticky top-8 rounded-2xl border border-[#E5E7EB] bg-white p-6 shadow-[0_8px_30px_rgba(15,23,42,0.04)]">

              <div className="flex items-center justify-between">

                <div>
                  <h2 className="text-xl font-bold text-[#0F172A]">
                    Order Summary
                  </h2>

                  <p className="mt-1 text-sm text-[#64748B]">
                    Review your order before payment.
                  </p>
                </div>

                <div className="rounded-full bg-[#EFF6FF] px-3 py-1 text-xs font-semibold text-[#0D59F2]">
                  {checkoutItems.length}{" "}
                  {checkoutItems.length ===
                    1
                    ? "Item"
                    : "Items"}
                </div>

              </div>

              {/* PRODUCTS */}
              <div className="mt-6 space-y-4">

                {checkoutItems.length >
                  0 ? (
                  checkoutItems.map(
                    (item) => (
                      <div
                        key={item.id}
                        className="flex gap-4"
                      >

                        <div className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-[#E5E7EB] bg-[#F8FAFC]">
                          <img
                            src={item.image}
                            alt={item.title}
                            className="h-full w-full object-cover"
                          />
                        </div>

                        <div className="min-w-0 flex-1">

                          <div className="flex items-start justify-between gap-3">

                            <h3 className="text-sm font-semibold leading-5 text-[#1E293B]">
                              {item.title}
                            </h3>

                            <span className="shrink-0 text-sm font-bold text-[#0F172A]">
                              $
                              {(
                                Number(
                                  item.price
                                ) *
                                Number(
                                  item.quantity
                                )
                              ).toFixed(2)}
                            </span>

                          </div>

                          <p className="mt-1 text-xs text-[#64748B]">
                            Qty{" "}
                            {item.quantity}
                          </p>

                          <p className="mt-1 text-xs text-[#94A3B8]">
                            $
                            {Number(
                              item.price
                            ).toFixed(2)}{" "}
                            each
                          </p>

                        </div>

                      </div>
                    )
                  )
                ) : (
                  <div className="rounded-xl border border-dashed border-[#E5E7EB] px-4 py-8 text-center">

                    <p className="text-sm font-medium text-[#1E293B]">
                      No products selected.
                    </p>

                    <p className="mt-1 text-xs text-[#64748B]">
                      Add a product to your cart before checkout.
                    </p>

                  </div>
                )}

              </div>

              {checkoutItems.length >
                0 && (
                  <>
                    {/* PROMO CODE */}
                    <div className="mt-6 border-t border-[#E5E7EB] pt-5">

                      <button
                        type="button"
                        onClick={() =>
                          setShowPromo(
                            (prev) =>
                              !prev
                          )
                        }
                        className="flex w-full items-center justify-between text-sm font-semibold text-[#0D59F2] transition-colors hover:text-[#0848C7]"
                      >
                        <span>
                          Have a promo code?
                        </span>

                        <span className="text-lg leading-none">
                          {showPromo
                            ? "−"
                            : "+"}
                        </span>
                      </button>

                      {showPromo && (
                        <div className="mt-3">

                          <div className="flex gap-2">

                            <input
                              type="text"
                              value={
                                promoCode
                              }
                              onChange={(
                                e
                              ) =>
                                setPromoCode(
                                  e.target
                                    .value
                                )
                              }
                              placeholder="Enter promo code"
                              className="h-10 min-w-0 flex-1 rounded-lg border border-[#E5E7EB] bg-white px-3 text-xs text-[#1E293B] outline-none placeholder:text-[#94A3B8] focus:border-[#0D59F2] focus:ring-2 focus:ring-[#DBEAFE]"
                            />

                            <button
                              type="button"
                              onClick={() => {
                                if (
                                  promoCode.trim()
                                ) {
                                  setPromoApplied(
                                    true
                                  );
                                }
                              }}
                              className="h-10 rounded-lg bg-[#0D59F2] px-4 text-xs font-semibold text-white transition hover:bg-[#0848C7]"
                            >
                              Apply
                            </button>

                          </div>

                          {promoApplied && (
                            <div className="mt-2 flex items-center justify-between">

                              <p className="text-xs font-medium text-[#16A34A]">
                                Promo code applied
                              </p>

                              <button
                                type="button"
                                onClick={() => {
                                  setPromoCode(
                                    ""
                                  );

                                  setPromoApplied(
                                    false
                                  );
                                }}
                                className="text-xs font-medium text-[#64748B] hover:text-[#1E293B]"
                              >
                                Remove
                              </button>

                            </div>
                          )}

                        </div>
                      )}

                    </div>

                    {/* FINANCIAL BREAKDOWN */}
                    <div className="mt-5 space-y-3">

                      <div className="flex items-center justify-between">

                        <span className="text-sm text-[#64748B]">
                          Subtotal
                        </span>

                        <span className="text-sm font-medium text-[#1E293B]">
                          $
                          {checkoutItems
                            .reduce(
                              (
                                total,
                                item
                              ) =>
                                total +
                                Number(
                                  item.price
                                ) *
                                Number(
                                  item.quantity
                                ),
                              0
                            )
                            .toFixed(2)}
                        </span>

                      </div>

                      {promoApplied && (
                        <div className="flex items-center justify-between">

                          <span className="text-sm text-[#64748B]">
                            Promo Discount
                          </span>

                          <span className="text-sm font-medium text-[#16A34A]">
                            -$
                            {(
                              checkoutItems.reduce(
                                (
                                  total,
                                  item
                                ) =>
                                  total +
                                  Number(
                                    item.price
                                  ) *
                                  Number(
                                    item.quantity
                                  ),
                                0
                              ) * 0.1
                            ).toFixed(2)}
                          </span>

                        </div>
                      )}

                      <div className="flex items-center justify-between">

                        <span className="text-sm text-[#64748B]">
                          Sales Tax
                        </span>

                        <span className="text-sm font-medium text-[#1E293B]">
                          $0.00
                        </span>

                      </div>

                      <div className="flex items-center justify-between">

                        <span className="text-sm text-[#64748B]">
                          Shipping
                        </span>

                        <span className="text-sm font-medium text-[#1E293B]">
                          $
                          {selectedShipping ===
                            "overnight"
                            ? "75.00"
                            : "19.99"}
                        </span>

                      </div>

                    </div>

                    {/* TOTAL */}
                    <div className="mt-5 border-t border-[#E5E7EB] pt-5">

                      <div className="flex items-center justify-between">

                        <span className="text-base font-semibold text-[#0F172A]">
                          Total
                        </span>

                        <span className="text-2xl font-bold text-[#0F172A]">
                          $
                          {(
                            checkoutItems.reduce(
                              (
                                total,
                                item
                              ) =>
                                total +
                                Number(
                                  item.price
                                ) *
                                Number(
                                  item.quantity
                                ),
                              0
                            ) -
                            (promoApplied
                              ? checkoutItems.reduce(
                                (
                                  total,
                                  item
                                ) =>
                                  total +
                                  Number(
                                    item.price
                                  ) *
                                  Number(
                                    item.quantity
                                  ),
                                0
                              ) *
                              0.1
                              : 0) +
                            (selectedShipping ===
                              "overnight"
                              ? 75
                              : 19.99)
                          ).toFixed(2)}
                        </span>

                      </div>

                    </div>

                    <button
                      type="button"
                      onClick={
                        handlePlaceOrder
                      }
                      disabled={
                        isSubmitting
                      }
                      className="
                      mt-6
                      flex
                      h-14
                      w-full
                      items-center
                      justify-center
                      gap-2
                      rounded-xl
                      bg-[#0D59F2]
                      px-5
                      text-sm
                      font-bold
                      text-white
                      shadow-[0_6px_16px_rgba(13,89,242,0.20)]
                      transition-all
                      hover:bg-[#0848C7]
                      hover:shadow-[0_8px_20px_rgba(13,89,242,0.25)]
                      active:scale-[0.99]
                      disabled:cursor-not-allowed
                      disabled:opacity-60
                    "
                    >

                      {selectedMethod ===
                        "card" && (
                          <span className="flex h-7 w-7 items-center justify-center rounded-md bg-white">
                            <CreditCard
                              className="h-4 w-4 text-[#0D59F2]"
                              strokeWidth={2.3}
                            />
                          </span>
                        )}

                      <span>
                        {isSubmitting
                          ? "Placing Order..."
                          : selectedMethod ===
                            "card"
                            ? "Pay by Card"
                            : selectedMethod ===
                              "cashapp"
                              ? "$ Pay with Cash App"
                              : "Pay with Venmo"}
                      </span>

                      <span>
                        $
                        {(
                          checkoutItems.reduce(
                            (
                              total,
                              item
                            ) =>
                              total +
                              Number(
                                item.price
                              ) *
                              Number(
                                item.quantity
                              ),
                            0
                          ) -
                          (promoApplied
                            ? checkoutItems.reduce(
                              (
                                total,
                                item
                              ) =>
                                total +
                                Number(
                                  item.price
                                ) *
                                Number(
                                  item.quantity
                                ),
                              0
                            ) *
                            0.1
                            : 0) +
                          (selectedShipping ===
                            "overnight"
                            ? 75
                            : 19.99)
                        ).toFixed(2)}
                      </span>

                    </button>

                    {/* TRUST / VALUE PROPS */}
                    <div className="mt-6 space-y-3 border-t border-[#E5E7EB] pt-5">

                      <div className="flex items-center gap-2.5">

                        <LockKeyhole
                          className="h-4 w-4 shrink-0 text-[#0D59F2]"
                          strokeWidth={2}
                        />

                        <p className="text-[11px] leading-4 text-[#64748B]">
                          Secure checkout
                        </p>

                      </div>

                      <div className="flex items-center gap-2.5">

                        <Check
                          className="h-4 w-4 shrink-0 text-[#0D59F2]"
                          strokeWidth={2.5}
                        />

                        <p className="text-[11px] leading-4 text-[#64748B]">
                          Third-party lab tested
                        </p>

                      </div>

                      <div className="flex items-center gap-2.5">

                        <ShoppingBag
                          className="h-4 w-4 shrink-0 text-[#0D59F2]"
                          strokeWidth={2}
                        />

                        <p className="text-[11px] leading-4 text-[#64748B]">
                          Discreet packaging
                        </p>

                      </div>

                    </div>
                  </>
                )}

            </div>
          </div>

        </div>

        {/* YOU MAY ALSO LIKE */}
        <div className="mt-8 rounded-2xl border border-[#BFDBFE] bg-[#EFF6FF] p-5 shadow-[0_8px_30px_rgba(30,80,120,0.05)] sm:p-6">

          <div className="mb-5">

            <h2 className="text-lg font-semibold text-[#1E293B] sm:text-xl">
              You May Also Like
            </h2>

            <p className="mt-1 text-sm text-[#64748B]">
              Explore more products you might be interested in.
            </p>

          </div>

          <div className="flex flex-wrap gap-4">

            {/* PRODUCT 1 */}
            <div className="flex w-full max-w-[300px] items-center gap-4 rounded-xl border border-[#E2E8F0] bg-white p-4">

              <div className="flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-[#F8FAFC]">

                <img
                  src={product1}
                  alt="Bacteriostatic Water"
                  className="h-full w-full object-contain"
                />

              </div>

              <div className="min-w-0 flex-1">

                <h3 className="truncate text-sm font-semibold text-[#1E293B]">
                  Bacteriostatic Water
                </h3>

                <p className="mt-1 text-base font-bold text-[#0B5FA5]">
                  $23.00
                </p>

                <button
                  type="button"
                  className="mt-3 rounded-lg bg-[#0B5FA5] px-4 py-2 text-xs font-semibold text-white transition hover:bg-[#094F8A]"
                >
                  Add to Cart
                </button>

              </div>

            </div>

            {/* PRODUCT 2 */}
            <div className="flex w-full max-w-[300px] items-center gap-4 rounded-xl border border-[#E2E8F0] bg-white p-4">

              <div className="flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-[#F8FAFC]">

                <img
                  src={product2}
                  alt="BPC-157"
                  className="h-full w-full object-contain"
                />

              </div>

              <div className="min-w-0 flex-1">

                <h3 className="truncate text-sm font-semibold text-[#1E293B]">
                  BPC-157
                </h3>

                <p className="mt-1 text-base font-bold text-[#0B5FA5]">
                  $81.00
                </p>

                <button
                  type="button"
                  className="mt-3 rounded-lg bg-[#0B5FA5] px-4 py-2 text-xs font-semibold text-white transition hover:bg-[#094F8A]"
                >
                  Add to Cart
                </button>

              </div>

            </div>

          </div>
        </div>

        {/* SECURITY FOOTER */}
        <div className="mt-8 flex items-center justify-center gap-2 text-center text-xs text-[#8198A9]">

          <LockKeyhole
            className="h-3.5 w-3.5"
          />

          <span>
            Your payment information is handled securely.
          </span>

        </div>

      </div>
    </div>
  );
};

export default Checkout;
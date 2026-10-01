// Catalog.jsx

import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";

import {
  ChevronDown,
  Grid2X2,
  Grip,
  ShoppingBag,
  Check,
} from "lucide-react";

import product1 from "../assets/product1.webp";
import product2 from "../assets/product2.webp";

import { useCart } from "../context/CartContext";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

const Catalog = () => {
  const { addToCart } = useCart();

  const [authLoading, setAuthLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [complianceSaving, setComplianceSaving] = useState(false);
  const [complianceError, setComplianceError] = useState("");

  const [complianceForm, setComplianceForm] = useState({
    age_verified: false,
    qualified_researcher: false,
    research_field: "",
    research_use_acknowledged: false,
    agreed: false,
  });

  const products = [
    {
      id: 1,
      title: "Bacteriostatic Water",
      price: 23,
      image: product1,
      available: true,
      createdAt: "2026-09-01",
      sales: 42,
      featured: false,
      relevance: 2,
    },
    {
      id: 2,
      title: "BPC-157",
      price: 81,
      image: product2,

      // change this to false whenever product becomes unavailable
      available: true,

      createdAt: "2026-09-12",
      sales: 88,
      featured: true,
      relevance: 1,
    },
  ];

  const highestPrice = Math.max(
    ...products.map((product) => product.price)
  );

  const [sortOpen, setSortOpen] = useState(false);
  const [priceOpen, setPriceOpen] = useState(false);

  const [
    availabilityOpen,
    setAvailabilityOpen,
  ] = useState(false);

  const [sortType, setSortType] = useState(() => {
    return (
      localStorage.getItem("catalogSort") ||
      "relevant"
    );
  });

  const [viewMode, setViewMode] = useState(() => {
    return (
      localStorage.getItem("catalogView") ||
      "normal"
    );
  });

  const [minPrice, setMinPrice] = useState(() => {
    const saved =
      localStorage.getItem("catalogMinPrice");

    return saved !== null ? saved : "";
  });

  const [maxPrice, setMaxPrice] = useState(() => {
    const saved =
      localStorage.getItem("catalogMaxPrice");

    return saved !== null
      ? saved
      : highestPrice.toString();
  });

  const [availability, setAvailability] =
    useState(() => {
      const saved = localStorage.getItem(
        "catalogAvailability"
      );

      if (saved) {
        try {
          return JSON.parse(saved);
        } catch {
          return {
            inStock: false,
            outOfStock: false,
          };
        }
      }

      return {
        inStock: false,
        outOfStock: false,
      };
    });


  /* =========================
     AUTH + COMPLIANCE CHECK
  ========================== */

  useEffect(() => {
    let cancelled = false;

    const checkCurrentUser = async () => {
      try {
        setAuthLoading(true);

        const response = await fetch(
          `${API_BASE_URL}/user/me`,
          {
            method: "GET",
            credentials: "include",
          }
        );

        if (!response.ok) {
          if (!cancelled) {
            setUser(null);
          }
          return;
        }

        const data = await response.json();

        if (!cancelled) {
          setUser(data.user);

          setComplianceForm({
            age_verified: Boolean(
              data.user.age_verified
            ),
            qualified_researcher: Boolean(
              data.user.qualified_researcher
            ),
            research_field:
              data.user.research_field || "",
            research_use_acknowledged: Boolean(
              data.user.research_use_acknowledged
            ),
            agreed: Boolean(
              data.user.terms_accepted
            ),
          });
        }
      } catch (error) {
        console.error(
          "Unable to verify catalog access:",
          error
        );

        if (!cancelled) {
          setUser(null);
        }
      } finally {
        if (!cancelled) {
          setAuthLoading(false);
        }
      }
    };

    checkCurrentUser();

    return () => {
      cancelled = true;
    };
  }, []);

  const handleComplianceChange = (e) => {
    const {
      name,
      value,
      type,
      checked,
    } = e.target;

    setComplianceForm((prev) => ({
      ...prev,
      [name]:
        type === "checkbox"
          ? checked
          : value,
    }));

    setComplianceError("");
  };

  const handleComplianceSubmit = async (e) => {
    e.preventDefault();

    if (
      !complianceForm.age_verified ||
      !complianceForm.qualified_researcher ||
      !complianceForm.research_use_acknowledged ||
      !complianceForm.agreed ||
      !complianceForm.research_field
    ) {
      setComplianceError(
        "Please complete all required confirmations."
      );
      return;
    }

    try {
      setComplianceSaving(true);
      setComplianceError("");

      const response = await fetch(
        `${API_BASE_URL}/user/compliance`,
        {
          method: "PUT",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(
            complianceForm
          ),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        let message =
          "Unable to save your research qualification.";

        if (Array.isArray(data.detail)) {
          message = data.detail
            .map((item) =>
              typeof item === "string"
                ? item
                : item.msg || "Invalid information."
            )
            .join(" ");
        } else if (
          typeof data.detail === "string"
        ) {
          message = data.detail;
        }

        throw new Error(message);
      }

      setUser(data.user);
    } catch (error) {
      setComplianceError(
        error.message ||
          "Unable to save your research qualification."
      );
    } finally {
      setComplianceSaving(false);
    }
  };

  /* =========================
     SAVE FILTERS
  ========================== */

  useEffect(() => {
    localStorage.setItem(
      "catalogSort",
      sortType
    );
  }, [sortType]);

  useEffect(() => {
    localStorage.setItem(
      "catalogView",
      viewMode
    );
  }, [viewMode]);

  useEffect(() => {
    localStorage.setItem(
      "catalogMinPrice",
      minPrice
    );
  }, [minPrice]);

  useEffect(() => {
    localStorage.setItem(
      "catalogMaxPrice",
      maxPrice
    );
  }, [maxPrice]);

  useEffect(() => {
    localStorage.setItem(
      "catalogAvailability",
      JSON.stringify(availability)
    );
  }, [availability]);

  /* =========================
     FILTER + SORT PRODUCTS
  ========================== */

  const filteredProducts = useMemo(() => {
    let list = [...products];

    /* Price filter */

    const min =
      minPrice === ""
        ? 0
        : Number(minPrice);

    const max =
      maxPrice === ""
        ? highestPrice
        : Number(maxPrice);

    list = list.filter(
      (product) =>
        product.price >= min &&
        product.price <= max
    );

    /* Availability */

    const { inStock, outOfStock } =
      availability;

    if (inStock && !outOfStock) {
      list = list.filter(
        (product) =>
          product.available === true
      );
    }

    if (!inStock && outOfStock) {
      list = list.filter(
        (product) =>
          product.available === false
      );
    }

    /* Sorting */

    switch (sortType) {
      case "featured":
        list.sort(
          (a, b) =>
            Number(b.featured) -
            Number(a.featured)
        );
        break;

      case "relevant":
        list.sort(
          (a, b) =>
            a.relevance - b.relevance
        );
        break;

      case "best-selling":
        list.sort(
          (a, b) =>
            b.sales - a.sales
        );
        break;

      case "name-az":
        list.sort((a, b) =>
          a.title.localeCompare(b.title)
        );
        break;

      case "name-za":
        list.sort((a, b) =>
          b.title.localeCompare(a.title)
        );
        break;

      case "price-low":
        list.sort(
          (a, b) =>
            a.price - b.price
        );
        break;

      case "price-high":
        list.sort(
          (a, b) =>
            b.price - a.price
        );
        break;

      case "date-old":
        list.sort(
          (a, b) =>
            new Date(a.createdAt) -
            new Date(b.createdAt)
        );
        break;

      case "date-new":
        list.sort(
          (a, b) =>
            new Date(b.createdAt) -
            new Date(a.createdAt)
        );
        break;

      default:
        break;
    }

    return list;
  }, [
    products,
    minPrice,
    maxPrice,
    availability,
    sortType,
    highestPrice,
  ]);

  /* =========================
     SORT OPTIONS
  ========================== */

  const sortOptions = [
    ["featured", "Featured"],
    ["relevant", "Most relevant"],
    ["best-selling", "Best selling"],
    ["name-az", "Alphabetically, A-Z"],
    ["name-za", "Alphabetically, Z-A"],
    ["price-low", "Price, low to high"],
    ["price-high", "Price, high to low"],
    ["date-old", "Date, old to new"],
    ["date-new", "Date, new to old"],
  ];

  const getSortLabel = () => {
    const current = sortOptions.find(
      ([value]) => value === sortType
    );

    return current
      ? current[1]
      : "Sort";
  };

  if (authLoading) {
    return (
      <section className="flex min-h-[420px] items-center justify-center bg-white px-5">
        <p className="text-[14px] text-[#697181]">
          Checking account access...
        </p>
      </section>
    );
  }

  if (!user) {
    return (
      <section className="flex min-h-[420px] items-center justify-center bg-white px-5">
        <div className="w-full max-w-[520px] text-center">
          <h1 className="text-[30px] font-bold tracking-[-0.03em] text-[#171728]">
            Account required
          </h1>

          <p className="mx-auto mt-3 max-w-[450px] text-[14px] leading-[1.7] text-[#697181]">
            Please log in or create an account before accessing the research catalog.
          </p>

          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link
              to="/login"
              className="flex h-[46px] items-center justify-center rounded-[7px] bg-[#0ea6d8] px-6 text-[14px] font-semibold text-white hover:bg-[#078db9]"
            >
              Log in
            </Link>

            <Link
              to="/signup"
              className="flex h-[46px] items-center justify-center rounded-[7px] border border-[#d7dce3] bg-white px-6 text-[14px] font-semibold text-[#252b39] hover:bg-[#f7f8fa]"
            >
              Create account
            </Link>
          </div>
        </div>
      </section>
    );
  }

  if (!user.compliance_complete) {
    return (
      <section className="w-full bg-white px-5 py-12 sm:px-6 md:py-16">
        <div className="mx-auto w-full max-w-[640px]">
          <div className="rounded-[14px] border border-[#e1e5ea] bg-white p-6 shadow-[0_18px_50px_rgba(0,0,0,0.08)] sm:p-8">
            <h1 className="text-[26px] font-bold tracking-[-0.03em] text-[#171728] sm:text-[30px]">
              Research qualification
            </h1>

            <p className="mt-3 text-[14px] leading-[1.7] text-[#697181]">
              All products are sold for Research Use Only. To continue you confirm that you are a qualified research professional aged 21 or older.
            </p>

            <form
              onSubmit={handleComplianceSubmit}
              className="mt-6 space-y-4"
            >
              <div>
                <label className="mb-2 block text-[14px] font-medium text-[#252b39]">
                  Field of Qualified Research
                </label>

                <select
                  name="research_field"
                  value={complianceForm.research_field}
                  onChange={handleComplianceChange}
                  required
                  className="h-[50px] w-full rounded-[7px] border border-[#d7dce3] bg-white px-4 text-[14px] text-[#1f2937] outline-none focus:border-[#159bc7] focus:ring-2 focus:ring-[#159bc7]/10"
                >
                  <option value="">
                    Select your research field
                  </option>
                  <option value="Pharmacology / Drug Discovery">
                    Pharmacology / Drug Discovery
                  </option>
                  <option value="Biochemistry & Molecular Biology">
                    Biochemistry & Molecular Biology
                  </option>
                  <option value="Academic Research">
                    Academic Research
                  </option>
                  <option value="Contract Research Organization (CRO)">
                    Contract Research Organization (CRO)
                  </option>
                  <option value="Analytical Chemistry Laboratory">
                    Analytical Chemistry Laboratory
                  </option>
                  <option value="Other Qualified Research">
                    Other Qualified Research
                  </option>
                </select>
              </div>

              <label className="flex cursor-pointer items-start gap-3">
                <input
                  type="checkbox"
                  name="age_verified"
                  checked={complianceForm.age_verified}
                  onChange={handleComplianceChange}
                  className="mt-[3px] h-[16px] w-[16px] shrink-0 cursor-pointer accent-[#159bc7]"
                />
                <span className="text-[13px] leading-[1.6] text-[#626975] sm:text-[14px]">
                  I confirm that I am 21 years of age or older.
                </span>
              </label>

              <label className="flex cursor-pointer items-start gap-3">
                <input
                  type="checkbox"
                  name="qualified_researcher"
                  checked={complianceForm.qualified_researcher}
                  onChange={handleComplianceChange}
                  className="mt-[3px] h-[16px] w-[16px] shrink-0 cursor-pointer accent-[#159bc7]"
                />
                <span className="text-[13px] leading-[1.6] text-[#626975] sm:text-[14px]">
                  I confirm that I am a qualified research professional.
                </span>
              </label>

              <label className="flex cursor-pointer items-start gap-3">
                <input
                  type="checkbox"
                  name="research_use_acknowledged"
                  checked={complianceForm.research_use_acknowledged}
                  onChange={handleComplianceChange}
                  className="mt-[3px] h-[16px] w-[16px] shrink-0 cursor-pointer accent-[#159bc7]"
                />
                <span className="text-[13px] leading-[1.6] text-[#626975] sm:text-[14px]">
                  I acknowledge that all products are sold for research use only.
                </span>
              </label>

              <label className="flex cursor-pointer items-start gap-3">
                <input
                  type="checkbox"
                  name="agreed"
                  checked={complianceForm.agreed}
                  onChange={handleComplianceChange}
                  className="mt-[3px] h-[16px] w-[16px] shrink-0 cursor-pointer accent-[#159bc7]"
                />
                <span className="text-[13px] leading-[1.6] text-[#626975] sm:text-[14px]">
                  I agree to the{" "}
                  <Link
                    to="/terms"
                    className="font-medium text-[#159bc7] hover:underline"
                  >
                    Terms & Conditions
                  </Link>
                  .
                </span>
              </label>

              {complianceError && (
                <div
                  role="alert"
                  className="rounded-[7px] border border-red-200 bg-red-50 px-4 py-3 text-[13px] text-red-600"
                >
                  {complianceError}
                </div>
              )}

              <button
                type="submit"
                disabled={complianceSaving}
                className="flex h-[50px] w-full items-center justify-center rounded-[7px] bg-[#0ea6d8] text-[14px] font-semibold text-white transition-colors hover:bg-[#078db9] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {complianceSaving
                  ? "Saving..."
                  : "Continue to Catalog"}
              </button>
            </form>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="w-full bg-white font-sans">
      <div
        className="
          mx-auto
          w-full
          max-w-[1440px]

          px-5
          py-10

          sm:px-6
          sm:py-12

          md:px-8
          md:py-14

          lg:px-10
          lg:py-16

          xl:px-12

          2xl:px-0
        "
      >
        {/* Heading */}
        <h1
          className="
            text-[34px]
            font-bold
            tracking-[-0.025em]
            text-[#171728]

            sm:text-[40px]
            md:text-[46px]
            lg:text-[52px]
          "
        >
          Products
        </h1>

        {/* =========================
            TOOLBAR
        ========================== */}

        <div
          className="
            mt-14
            flex
            flex-col
            gap-5

            sm:mt-16

            md:flex-row
            md:items-center
            md:justify-between
          "
        >
          {/* Left Filters */}
          <div className="flex flex-wrap items-center gap-7">

            {/* =========================
                AVAILABILITY
            ========================== */}

            <div className="relative">
              <button
                type="button"
                onClick={() => {
                  setAvailabilityOpen(
                    (prev) => !prev
                  );

                  setPriceOpen(false);
                  setSortOpen(false);
                }}
                className="
                  flex
                  cursor-pointer
                  items-center
                  gap-1.5
                  text-[14px]
                  font-normal
                  text-[#555563]
                  transition-colors
                  duration-200
                  hover:text-black

                  sm:text-[15px]
                "
              >
                Availability

                <ChevronDown
                  size={15}
                  strokeWidth={1.6}
                  className={`
                    transition-transform

                    ${
                      availabilityOpen
                        ? "rotate-180"
                        : ""
                    }
                  `}
                />
              </button>

              {availabilityOpen && (
                <div
                  className="
                    absolute
                    left-0
                    top-[30px]
                    z-50
                    w-[210px]
                    rounded-[10px]
                    border
                    border-gray-200
                    bg-white
                    p-4
                    shadow-[0_12px_32px_rgba(0,0,0,0.12)]
                  "
                >
                  {/* In Stock */}
                  <label
                    className="
                      flex
                      cursor-pointer
                      items-center
                      gap-3
                      py-2
                    "
                  >
                    <button
                      type="button"
                      onClick={() =>
                        setAvailability(
                          (prev) => ({
                            ...prev,

                            inStock:
                              !prev.inStock,
                          })
                        )
                      }
                      className={`
                        flex
                        h-[18px]
                        w-[18px]
                        cursor-pointer
                        items-center
                        justify-center
                        rounded-[3px]
                        border

                        ${
                          availability.inStock
                            ? "border-[#16385f] bg-[#16385f] text-white"
                            : "border-[#aaa] bg-white"
                        }
                      `}
                    >
                      {availability.inStock && (
                        <Check
                          size={13}
                          strokeWidth={2.2}
                        />
                      )}
                    </button>

                    <span className="text-[14px] text-[#454553]">
                      In stock
                    </span>
                  </label>

                  {/* Out of Stock */}
                  <label
                    className="
                      flex
                      cursor-pointer
                      items-center
                      gap-3
                      py-2
                    "
                  >
                    <button
                      type="button"
                      onClick={() =>
                        setAvailability(
                          (prev) => ({
                            ...prev,

                            outOfStock:
                              !prev.outOfStock,
                          })
                        )
                      }
                      className={`
                        flex
                        h-[18px]
                        w-[18px]
                        cursor-pointer
                        items-center
                        justify-center
                        rounded-[3px]
                        border

                        ${
                          availability.outOfStock
                            ? "border-[#16385f] bg-[#16385f] text-white"
                            : "border-[#aaa] bg-white"
                        }
                      `}
                    >
                      {availability.outOfStock && (
                        <Check
                          size={13}
                          strokeWidth={2.2}
                        />
                      )}
                    </button>

                    <span className="text-[14px] text-[#454553]">
                      Out of stock
                    </span>
                  </label>
                </div>
              )}
            </div>

            {/* =========================
                PRICE
            ========================== */}

            <div className="relative">
              <button
                type="button"
                onClick={() => {
                  setPriceOpen(
                    (prev) => !prev
                  );

                  setAvailabilityOpen(false);
                  setSortOpen(false);
                }}
                className="
                  flex
                  cursor-pointer
                  items-center
                  gap-1.5
                  text-[14px]
                  font-normal
                  text-[#555563]
                  transition-colors
                  duration-200
                  hover:text-black

                  sm:text-[15px]
                "
              >
                Price

                <ChevronDown
                  size={15}
                  strokeWidth={1.6}
                  className={`
                    transition-transform

                    ${
                      priceOpen
                        ? "rotate-180"
                        : ""
                    }
                  `}
                />
              </button>

              {priceOpen && (
                <div
                  className="
                    absolute
                    left-0
                    top-[30px]
                    z-50
                    w-[365px]
                    max-w-[calc(100vw-40px)]
                    rounded-[14px]
                    border
                    border-[#e3e3e8]
                    bg-white
                    p-4
                    shadow-[0_12px_35px_rgba(0,0,0,0.12)]
                  "
                >
                  <div className="flex items-center gap-3">

                    {/* Minimum */}
                    <div
                      className="
                        flex
                        h-[58px]
                        flex-1
                        items-center
                        rounded-[10px]
                        border
                        border-[#dcdce2]
                        px-3
                      "
                    >
                      <span className="mr-2 text-[#9aa0ac]">
                        $
                      </span>

                      <input
                        type="number"
                        min="0"
                        max={highestPrice}
                        value={minPrice}
                        onChange={(e) =>
                          setMinPrice(
                            e.target.value
                          )
                        }
                        placeholder="0"
                        className="
                          w-full
                          bg-transparent
                          text-[14px]
                          text-[#555563]
                          outline-none
                          placeholder:text-[#949bad]
                        "
                      />
                    </div>

                    <span className="text-[14px] text-[#555563]">
                      to
                    </span>

                    {/* Maximum */}
                    <div
                      className="
                        flex
                        h-[58px]
                        flex-1
                        items-center
                        rounded-[10px]
                        border
                        border-[#dcdce2]
                        px-3
                      "
                    >
                      <span className="mr-2 text-[#9aa0ac]">
                        $
                      </span>

                      <input
                        type="number"
                        min="0"
                        max={highestPrice}
                        value={maxPrice}
                        onChange={(e) =>
                          setMaxPrice(
                            e.target.value
                          )
                        }
                        placeholder={
                          highestPrice
                        }
                        className="
                          w-full
                          bg-transparent
                          text-[14px]
                          text-[#555563]
                          outline-none
                          placeholder:text-[#949bad]
                        "
                      />
                    </div>
                  </div>

                  <p className="mt-4 text-[13px] text-[#9696a3]">
                    The highest price is $
                    {highestPrice.toFixed(2)}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* =========================
              RIGHT CONTROLS
          ========================== */}

          <div className="flex flex-wrap items-center gap-4 sm:gap-5">

            <span className="text-[14px] text-[#666674] sm:text-[15px]">
              {filteredProducts.length} items
            </span>

            {/* Sort */}
            <div className="relative">
              <button
                type="button"
                onClick={() => {
                  setSortOpen(
                    (prev) => !prev
                  );

                  setPriceOpen(false);
                  setAvailabilityOpen(false);
                }}
                className="
                  flex
                  cursor-pointer
                  items-center
                  gap-1.5
                  text-[14px]
                  text-[#555563]
                  transition-colors
                  duration-200
                  hover:text-black

                  sm:text-[15px]
                "
              >
                {getSortLabel()}

                <ChevronDown
                  size={15}
                  strokeWidth={1.6}
                  className={`
                    transition-transform

                    ${
                      sortOpen
                        ? "rotate-180"
                        : ""
                    }
                  `}
                />
              </button>

              {sortOpen && (
                <div
                  className="
                    absolute
                    right-0
                    top-[30px]
                    z-50
                    w-[220px]
                    overflow-hidden
                    rounded-[8px]
                    border
                    border-gray-200
                    bg-white
                    py-1
                    shadow-[0_12px_30px_rgba(0,0,0,0.12)]
                  "
                >
                  {sortOptions.map(
                    ([value, label]) => (
                      <button
                        key={value}
                        type="button"
                        onClick={() => {
                          setSortType(
                            value
                          );

                          setSortOpen(
                            false
                          );
                        }}
                        className={`
                          flex
                          w-full
                          cursor-pointer
                          items-center
                          gap-2
                          px-4
                          py-2.5
                          text-left
                          text-[14px]
                          transition-colors

                          ${
                            sortType ===
                            value
                              ? "bg-[#f0f0f2] text-[#40404e]"
                              : "text-[#555563] hover:bg-[#f7f7f8]"
                          }
                        `}
                      >
                        <span className="w-[15px]">
                          {sortType ===
                            value && (
                            <Check
                              size={15}
                              strokeWidth={2}
                            />
                          )}
                        </span>

                        {label}
                      </button>
                    )
                  )}
                </div>
              )}
            </div>

            {/* Normal Grid */}
            <button
              type="button"
              aria-label="Normal grid"
              onClick={() =>
                setViewMode("normal")
              }
              className={`
                flex
                h-[30px]
                w-[30px]
                cursor-pointer
                items-center
                justify-center
                rounded-[4px]

                ${
                  viewMode === "normal"
                    ? "bg-[#f1f1f3] text-[#31313c]"
                    : "text-[#9c9ca7]"
                }
              `}
            >
              <Grid2X2
                size={17}
                strokeWidth={1.7}
              />
            </button>

            {/* Compact Grid */}
            <button
              type="button"
              aria-label="Compact grid"
              onClick={() =>
                setViewMode("compact")
              }
              className={`
                flex
                h-[30px]
                w-[30px]
                cursor-pointer
                items-center
                justify-center
                rounded-[4px]

                ${
                  viewMode === "compact"
                    ? "bg-[#f1f1f3] text-[#31313c]"
                    : "text-[#9c9ca7]"
                }
              `}
            >
              <Grip
                size={18}
                strokeWidth={1.5}
              />
            </button>
          </div>
        </div>

        {/* =========================
            PRODUCTS
        ========================== */}

        <div
          className={`
            mt-7
            grid
            gap-y-10

            ${
              viewMode === "normal"
                ? `
                    grid-cols-1
                    gap-x-5

                    sm:grid-cols-2

                    lg:grid-cols-3

                    xl:grid-cols-4
                  `
                : `
                    grid-cols-2
                    gap-x-4

                    sm:grid-cols-3

                    md:grid-cols-4

                    lg:grid-cols-5

                    xl:grid-cols-6
                  `
            }
          `}
        >
          {filteredProducts.map(
            (product) => (
              <article
                key={product.id}
                className={`
                  group
                  relative
                  rounded-[12px]
                  bg-white
                  transition-all
                  duration-300

                  hover:-translate-y-[5px]
                  hover:shadow-[0_14px_35px_rgba(5,22,39,0.16)]

                  ${
                    viewMode ===
                    "compact"
                      ? "max-w-[180px]"
                      : "w-full"
                  }
                `}
              >
                {/* Product Image */}
                <div
                  className="
                    relative
                    aspect-square
                    overflow-hidden
                    rounded-[12px]
                    bg-[#f1f1f3]
                  "
                >
                  <img
                    src={product.image}
                    alt={product.title}
                    className="
                      h-full
                      w-full
                      object-cover
                      transition-transform
                      duration-300
                      group-hover:scale-[1.03]
                    "
                  />

                  {/* Availability */}
                  {!product.available && (
                    <div
                      className="
                        absolute
                        left-3
                        top-3
                        rounded-full
                        bg-white/95
                        px-3
                        py-1
                        text-[11px]
                        font-medium
                        text-[#62626c]
                        shadow-sm
                      "
                    >
                      Out of stock
                    </div>
                  )}

                  {/* Add To Cart */}
                  <div
                    className="
                      absolute
                      bottom-3
                      right-3
                      z-20
                    "
                  >
                    <button
                      type="button"
                      disabled={
                        !product.available
                      }
                      onClick={(e) => {
                        e.stopPropagation();

                        if (
                          product.available
                        ) {
                          addToCart(
                            product
                          );
                        }
                      }}
                      className={`
                        flex
                        h-[42px]
                        items-center
                        overflow-hidden
                        rounded-[9px]
                        text-white
                        transition-all
                        duration-300

                        ${
                          product.available
                            ? `
                                cursor-pointer
                                bg-[#17365c]
                                group-hover:bg-[#20aaf2]
                              `
                            : `
                                cursor-not-allowed
                                bg-[#9da4ad]
                                opacity-80
                              `
                        }
                      `}
                    >
                      <span
                        className="
                          flex
                          h-[42px]
                          w-[42px]
                          shrink-0
                          items-center
                          justify-center
                        "
                      >
                        <ShoppingBag
                          size={20}
                          strokeWidth={1.8}
                        />
                      </span>

                      <span
                        className={`
                          overflow-hidden
                          whitespace-nowrap
                          text-[14px]
                          font-semibold
                          transition-all
                          duration-300

                          ${
                            product.available
                              ? `
                                  max-w-0
                                  pr-0
                                  opacity-0

                                  group-hover:max-w-[120px]
                                  group-hover:pr-4
                                  group-hover:opacity-100
                                `
                              : `
                                  max-w-[120px]
                                  pr-4
                                  opacity-100
                                `
                          }
                        `}
                      >
                        {product.available
                          ? "Add to cart"
                          : "Out of stock"}
                      </span>
                    </button>
                  </div>
                </div>

                {/* Product Title */}
                <h3
                  className={`
                    mt-3
                    font-normal
                    leading-[1.35]
                    text-[#4e4e5c]

                    ${
                      viewMode ===
                      "compact"
                        ? "text-[13px]"
                        : "text-[15px] sm:text-[16px]"
                    }
                  `}
                >
                  {product.title}
                </h3>

                {/* Price */}
                <p
                  className={`
                    mt-1
                    font-bold
                    text-[#173658]

                    ${
                      viewMode ===
                      "compact"
                        ? "text-[12px]"
                        : "text-[14px] sm:text-[15px]"
                    }
                  `}
                >
                  $
                  {product.price.toFixed(
                    2
                  )}
                </p>
              </article>
            )
          )}
        </div>

        {/* =========================
            EMPTY STATE
        ========================== */}

        {filteredProducts.length ===
          0 && (
          <div className="py-20 text-center">
            <p className="text-[16px] text-[#666674]">
              No products match your
              selected filters.
            </p>
          </div>
        )}
      </div>
    </section>
  );
};

export default Catalog;
// Catalog.jsx

import React, { useEffect, useMemo, useState } from "react";
import {
  ChevronDown,
  Grid2X2,
  Grip,
  ShoppingBag,
  Check,
} from "lucide-react";

import product1 from "../assets/product1.webp";
import product2 from "../assets/product2.webp";

const Catalog = () => {
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
      available: false,
      createdAt: "2026-09-12",
      sales: 88,
      featured: true,
      relevance: 1,
    },
  ];

  const highestPrice = Math.max(...products.map((product) => product.price));

  const [sortOpen, setSortOpen] = useState(false);
  const [priceOpen, setPriceOpen] = useState(false);
  const [availabilityOpen, setAvailabilityOpen] = useState(false);

  const [sortType, setSortType] = useState(() => {
    return localStorage.getItem("catalogSort") || "relevant";
  });

  const [viewMode, setViewMode] = useState(() => {
    return localStorage.getItem("catalogView") || "normal";
  });

  const [minPrice, setMinPrice] = useState(() => {
    const saved = localStorage.getItem("catalogMinPrice");
    return saved !== null ? saved : "";
  });

  const [maxPrice, setMaxPrice] = useState(() => {
    const saved = localStorage.getItem("catalogMaxPrice");
    return saved !== null ? saved : highestPrice.toString();
  });

  const [availability, setAvailability] = useState(() => {
    const saved = localStorage.getItem("catalogAvailability");

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

  useEffect(() => {
    localStorage.setItem("catalogSort", sortType);
  }, [sortType]);

  useEffect(() => {
    localStorage.setItem("catalogView", viewMode);
  }, [viewMode]);

  useEffect(() => {
    localStorage.setItem("catalogMinPrice", minPrice);
  }, [minPrice]);

  useEffect(() => {
    localStorage.setItem("catalogMaxPrice", maxPrice);
  }, [maxPrice]);

  useEffect(() => {
    localStorage.setItem(
      "catalogAvailability",
      JSON.stringify(availability)
    );
  }, [availability]);

  const filteredProducts = useMemo(() => {
    let list = [...products];

    // Price filter
    const min =
      minPrice === "" ? 0 : Number(minPrice);

    const max =
      maxPrice === "" ? highestPrice : Number(maxPrice);

    list = list.filter(
      (product) =>
        product.price >= min &&
        product.price <= max
    );

    // Availability filter
    const { inStock, outOfStock } = availability;

    if (inStock && !outOfStock) {
      list = list.filter(
        (product) => product.available === true
      );
    }

    if (!inStock && outOfStock) {
      list = list.filter(
        (product) => product.available === false
      );
    }

    // Sort
    switch (sortType) {
      case "featured":
        list.sort(
          (a, b) =>
            Number(b.featured) - Number(a.featured)
        );
        break;

      case "relevant":
        list.sort(
          (a, b) => a.relevance - b.relevance
        );
        break;

      case "best-selling":
        list.sort(
          (a, b) => b.sales - a.sales
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
          (a, b) => a.price - b.price
        );
        break;

      case "price-high":
        list.sort(
          (a, b) => b.price - a.price
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

    return current ? current[1] : "Sort";
  };

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

        {/* Toolbar */}
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

            {/* Availability */}
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
                  <label className="flex cursor-pointer items-center gap-3 py-2">
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
                  <label className="flex cursor-pointer items-center gap-3 py-2">
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

            {/* Price */}
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

          {/* Right Controls */}
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
                Sort

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
                    w-[200px]
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
                          setSortOpen(false);
                        }}
                        className={`
                          flex
                          w-full
                          items-center
                          gap-2
                          px-4
                          py-2.5
                          text-left
                          text-[14px]
                          transition-colors

                          ${
                            sortType === value
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

            {/* Normal */}
            <button
              type="button"
              onClick={() =>
                setViewMode("normal")
              }
              className={`
                flex
                h-[30px]
                w-[30px]
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

            {/* Compact */}
            <button
              type="button"
              onClick={() =>
                setViewMode("compact")
              }
              className={`
                flex
                h-[30px]
                w-[30px]
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

        {/* Products */}
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
                <div className="relative aspect-square overflow-hidden rounded-[12px] bg-[#f1f1f3]">
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
                      className="
                        flex
                        h-[42px]
                        items-center
                        overflow-hidden
                        rounded-[9px]
                        bg-[#17365c]
                        text-white
                        transition-all
                        duration-300
                        group-hover:bg-[#20aaf2]
                      "
                    >
                      <span className="flex h-[42px] w-[42px] items-center justify-center">
                        <ShoppingBag
                          size={20}
                          strokeWidth={1.8}
                        />
                      </span>

                      <span
                        className="
                          max-w-0
                          overflow-hidden
                          whitespace-nowrap
                          pr-0
                          text-[14px]
                          font-semibold
                          opacity-0
                          transition-all
                          duration-300

                          group-hover:max-w-[110px]
                          group-hover:pr-4
                          group-hover:opacity-100
                        "
                      >
                        Add to cart
                      </span>
                    </button>
                  </div>
                </div>

                <h3
                  className={`
                    mt-3
                    font-normal
                    leading-[1.35]
                    text-[#4e4e5c]

                    ${
                      viewMode === "compact"
                        ? "text-[13px]"
                        : "text-[15px] sm:text-[16px]"
                    }
                  `}
                >
                  {product.title}
                </h3>

                <p
                  className={`
                    mt-1
                    font-bold
                    text-[#173658]

                    ${
                      viewMode === "compact"
                        ? "text-[12px]"
                        : "text-[14px] sm:text-[15px]"
                    }
                  `}
                >
                  ${product.price.toFixed(2)}
                </p>
              </article>
            )
          )}
        </div>

        {/* Empty State */}
        {filteredProducts.length === 0 && (
          <div className="py-20 text-center">
            <p className="text-[16px] text-[#666674]">
              No products match your selected filters.
            </p>
          </div>
        )}
      </div>
    </section>
  );
};

export default Catalog;
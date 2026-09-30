import {
  Search,
  UserRound,
  ShoppingBag,
  Menu,
  X,
  Minus,
  Plus,
  Trash2,
} from "lucide-react";

import { useEffect, useMemo, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

import { useCart } from "../context/CartContext";

import product1 from "../assets/product1.webp";
import product2 from "../assets/product2.webp";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [profileOpen, setProfileOpen] = useState(false);
  const [user, setUser] = useState(null);

  const location = useLocation();
  const navigate = useNavigate();

  const [authLoading, setAuthLoading] = useState(true);

  const {
    cartItems,
    cartCount,
    cartTotal,
    removeFromCart,
    increaseQuantity,
    decreaseQuantity,
  } = useCart();

  const products = [
    {
      id: 1,
      title: "Bacteriostatic Water",
      price: 23,
      image: product1,
      link: "/catalog",
    },
    {
      id: 2,
      title: "BPC-157",
      price: 81,
      image: product2,
      link: "/catalog",
    },
  ];

  const filteredProducts = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    if (!query) return products;

    return products.filter((product) =>
      product.title.toLowerCase().includes(query)
    );
  }, [searchQuery]);

  const closeSearch = () => {
    setSearchOpen(false);
    setSearchQuery("");
  };

  // ================= AUTH CHECK =================
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
            setProfileOpen(false);
          }

          return;
        }

        const data = await response.json();

        if (!cancelled) {
          setUser(data.user);
        }
      } catch (error) {
        console.error(
          "Authentication check failed:",
          error
        );

        if (!cancelled) {
          setUser(null);
          setProfileOpen(false);
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
  }, [location.pathname]);

  // ================= LOGOUT =================
  const handleLogout = async () => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/user/logout`,
        {
          method: "POST",
          credentials: "include",
        }
      );

      if (!response.ok) {
        console.error("Logout request failed.");
      }
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      setUser(null);
      setProfileOpen(false);
      navigate("/login");
    }
  };

  return (
    <>
      <header className="relative z-40 w-full">
        <div
          className="
            mx-auto
            flex
            h-[64px]
            w-full
            max-w-[1456px]
            items-center
            justify-between
            px-4
            sm:px-6
            md:px-8
            lg:px-10
            xl:px-12
            2xl:px-0
          "
        >
          {/* Left Side */}
          <div className="flex items-center">
            <Link
              to="/"
              className="
                whitespace-nowrap
                text-[14px]
                font-semibold
                tracking-tight
                text-black
                sm:text-[15px]
                md:text-[16px]
                lg:text-xl
              "
            >
              Prism Wellness
            </Link>

            <nav
              className="
                ml-5
                hidden
                items-center
                gap-5
                md:flex
                lg:ml-7
                lg:gap-7
                xl:ml-8
                xl:gap-8
              "
            >
              <Link
                to="/"
                className="
                  text-[14px]
                  font-normal
                  text-[#3f3f3f]
                  transition-colors
                  duration-200
                  hover:text-black
                "
              >
                Home
              </Link>

              <Link
                to="/catalog"
                className="
                  text-[14px]
                  font-normal
                  text-[#3f3f3f]
                  transition-colors
                  duration-200
                  hover:text-black
                "
              >
                Catalog
              </Link>

              <Link
                to="/contact"
                className="
                  text-[14px]
                  font-normal
                  text-[#3f3f3f]
                  transition-colors
                  duration-200
                  hover:text-black
                "
              >
                Contact
              </Link>
            </nav>
          </div>

          {/* Right Side Icons */}
          <div
            className="
              flex
              items-center
              gap-4
              sm:gap-5
              md:gap-6
              lg:gap-7
              xl:gap-8
            "
          >
            {/* Search */}
            <button
              type="button"
              aria-label="Search"
              onClick={() => {
                setSearchOpen(true);
                setProfileOpen(false);
                setCartOpen(false);
              }}
              className="
                flex
                cursor-pointer
                items-center
                justify-center
                text-black
                transition-opacity
                duration-200
                hover:opacity-60
              "
            >
              <Search size={19} strokeWidth={1.8} />
            </button>

            {/* Profile */}
            <div className="relative hidden sm:block">
              {authLoading ? (
                <button
                  type="button"
                  aria-label="Checking profile"
                  disabled
                  className="
        flex
        items-center
        justify-center
        text-black/50
        cursor-default
      "
                >
                  <UserRound size={19} strokeWidth={1.8} />
                </button>
              ) : user ? (
                <button
                  type="button"
                  aria-label="Profile"
                  onClick={() => {
                    setProfileOpen((prev) => !prev);
                    setSearchOpen(false);
                    setCartOpen(false);
                  }}
                  className="
        flex
        cursor-pointer
        items-center
        justify-center
        text-black
        transition-opacity
        duration-200
        hover:opacity-60
      "
                >
                  <UserRound size={19} strokeWidth={1.8} />
                </button>
              ) : (
                <Link
                  to="/login"
                  aria-label="Login"
                  className="
        flex
        cursor-pointer
        items-center
        justify-center
        text-black
        transition-opacity
        duration-200
        hover:opacity-60
      "
                >
                  <UserRound size={19} strokeWidth={1.8} />
                </Link>
              )}
            </div>

            {/* Cart */}
            <button
              type="button"
              aria-label="Cart"
              onClick={() => {
                setCartOpen(true);
                setSearchOpen(false);
                setProfileOpen(false);
              }}
              className="
                relative
                flex
                cursor-pointer
                items-center
                justify-center
                text-black
                transition-opacity
                duration-200
                hover:opacity-70
              "
            >
              <ShoppingBag size={19} strokeWidth={1.8} />

              {cartCount > 0 && (
                <span
                  className="
                    absolute
                    -right-[9px]
                    -top-[9px]
                    flex
                    h-[17px]
                    min-w-[17px]
                    items-center
                    justify-center
                    rounded-full
                    bg-[#1294ff]
                    px-[4px]
                    text-[10px]
                    font-bold
                    leading-none
                    text-white
                  "
                >
                  {cartCount > 99 ? "99+" : cartCount}
                </span>
              )}
            </button>

            {/* Mobile Menu */}
            <button
              type="button"
              aria-label="Toggle menu"
              onClick={() => setMenuOpen(!menuOpen)}
              className="
                flex
                cursor-pointer
                items-center
                justify-center
                text-black
                md:hidden
              "
            >
              {menuOpen ? (
                <X size={21} strokeWidth={1.8} />
              ) : (
                <Menu size={21} strokeWidth={1.8} />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div
          className={`
            absolute
            left-0
            top-full
            z-50
            w-full
            overflow-hidden
            bg-[#fffbea]
            transition-all
            duration-300
            md:hidden

            ${menuOpen
              ? "max-h-[220px] border-t border-black/10 opacity-100"
              : "max-h-0 opacity-0"
            }
          `}
        >
          <nav className="flex flex-col px-4 py-3 sm:px-6">
            <Link
              to="/"
              onClick={() => setMenuOpen(false)}
              className="py-3 text-[14px] text-[#3f3f3f]"
            >
              Home
            </Link>

            <Link
              to="/catalog"
              onClick={() => setMenuOpen(false)}
              className="py-3 text-[14px] text-[#3f3f3f]"
            >
              Catalog
            </Link>

            <Link
              to="/contact"
              onClick={() => setMenuOpen(false)}
              className="py-3 text-[14px] text-[#3f3f3f]"
            >
              Contact
            </Link>
          </nav>
        </div>
      </header>

      {/* ================= PROFILE DROPDOWN ================= */}
      {user && profileOpen && (
        <>
          <div
            className="fixed inset-0 z-[998]"
            onClick={() => setProfileOpen(false)}
          />

          <div
            className="
              fixed
              right-4
              top-[100px]
              z-[999]
              w-[calc(100%-32px)]
              max-w-[330px]
              overflow-hidden
              rounded-[14px]
              border
              border-[#e3e6ea]
              bg-white
              shadow-[0_18px_50px_rgba(0,0,0,0.18)]

              sm:right-6
              md:right-8
              lg:right-10
              xl:right-12
            "
          >
            <div className="px-5 py-5">
              <div className="flex items-center gap-3">
                <div
                  className="
                    flex
                    h-[46px]
                    w-[46px]
                    shrink-0
                    items-center
                    justify-center
                    rounded-full
                    bg-[#e8f6fb]
                    text-[#0ea6d8]
                  "
                >
                  <UserRound size={22} strokeWidth={1.8} />
                </div>

                <div className="min-w-0">
                  <p className="truncate text-[15px] font-semibold text-[#17182a]">
                    {user.full_name}
                  </p>

                  <p className="mt-0.5 truncate text-[13px] text-[#737b87]">
                    {user.email}
                  </p>
                </div>
              </div>
            </div>

            <div className="h-px bg-[#e5e7eb]" />

            <div className="p-3">
              <button
                type="button"
                onClick={handleLogout}
                className="
                  flex
                  h-[44px]
                  w-full
                  cursor-pointer
                  items-center
                  justify-center
                  rounded-[8px]
                  bg-[#061727]
                  text-[14px]
                  font-semibold
                  text-white
                  transition-colors
                  duration-200
                  hover:bg-[#102b42]
                "
              >
                Logout
              </button>
            </div>
          </div>
        </>
      )}

      {/* ================= SEARCH POPUP ================= */}
      {searchOpen && (
        <div
          className="
            fixed
            inset-0
            z-[999]
            bg-[#061727]/70
            backdrop-blur-[2px]
          "
          onClick={closeSearch}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="
              mx-auto
              mt-0
              w-[calc(100%-14px)]
              max-w-[1456px]
              overflow-hidden
              rounded-b-[16px]
              bg-white
              shadow-[0_20px_55px_rgba(0,0,0,0.22)]

              sm:w-[calc(100%-24px)]
              md:w-[calc(100%-40px)]
            "
          >
            <div
              className="
                flex
                min-h-[58px]
                items-center
                border-b
                border-[#e2e5e9]
                px-4
                sm:px-5
              "
            >
              <Search
                size={19}
                strokeWidth={1.8}
                className="shrink-0 text-[#747b88]"
              />

              <input
                autoFocus
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search"
                className="
                  ml-3
                  min-w-0
                  flex-1
                  bg-transparent
                  text-[16px]
                  text-[#242936]
                  outline-none
                  placeholder:text-[#7b8290]
                "
              />

              <button
                type="button"
                aria-label="Close search"
                onClick={closeSearch}
                className="
                  ml-4
                  flex
                  h-[44px]
                  w-[44px]
                  cursor-pointer
                  items-center
                  justify-center
                  rounded-[9px]
                  bg-[#21395f]
                  text-white
                  transition-colors
                  duration-200
                  hover:bg-[#162c4f]
                "
              >
                <X size={18} strokeWidth={1.6} />
              </button>
            </div>

            <div
              className="
                max-h-[calc(100vh-100px)]
                overflow-y-auto
                px-5
                pb-7
                pt-4
              "
            >
              <p className="mb-2 text-[14px] text-[#293c5c]">
                Products
              </p>

              {filteredProducts.length > 0 ? (
                <div
                  className="
                    grid
                    grid-cols-2
                    gap-4
                    sm:flex
                    sm:flex-wrap
                  "
                >
                  {filteredProducts.map((product) => (
                    <Link
                      key={product.id}
                      to={product.link}
                      onClick={closeSearch}
                      className="
                        group
                        w-full
                        cursor-pointer
                        sm:w-[145px]
                      "
                    >
                      <div
                        className="
                          aspect-square
                          w-full
                          overflow-hidden
                          bg-[#f2f3f5]
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
                      </div>

                      <h3
                        className="
                          mt-2
                          text-[14px]
                          leading-[1.4]
                          text-[#303746]
                          sm:text-[15px]
                        "
                      >
                        {product.title}
                      </h3>

                      <p
                        className="
                          mt-0.5
                          text-[14px]
                          text-[#243c64]
                          sm:text-[15px]
                        "
                      >
                        ${product.price.toFixed(2)}
                      </p>
                    </Link>
                  ))}
                </div>
              ) : (
                <div
                  className="
                    flex
                    min-h-[120px]
                    items-center
                    justify-center
                    text-[14px]
                    text-[#747b88]
                  "
                >
                  No products found.
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ================= CART SIDEBAR ================= */}
      {cartOpen && (
        <div
          className="
            fixed
            inset-0
            z-[1000]
            bg-[#061727]/65
          "
          onClick={() => setCartOpen(false)}
        >
          <aside
            onClick={(e) => e.stopPropagation()}
            className="
              absolute
              right-0
              top-0
              flex
              h-full
              w-full
              flex-col
              bg-white
              shadow-[-12px_0_35px_rgba(0,0,0,0.16)]

              sm:w-[480px]
              md:w-[500px]
            "
          >
            <div
              className="
                flex
                h-[78px]
                shrink-0
                items-center
                justify-end
                px-4
                sm:px-6
              "
            >
              <button
                type="button"
                aria-label="Close cart"
                onClick={() => setCartOpen(false)}
                className="
                  flex
                  h-[42px]
                  w-[42px]
                  cursor-pointer
                  items-center
                  justify-center
                  rounded-full
                  border-2
                  border-[#1c2134]
                  text-[#697181]
                  transition-colors
                  hover:bg-[#f5f6f8]
                "
              >
                <X size={20} strokeWidth={1.8} />
              </button>
            </div>

            {cartItems.length === 0 ? (
              <div
                className="
                  flex
                  flex-1
                  flex-col
                  items-center
                  justify-center
                  px-6
                  pb-[80px]
                  text-center
                "
              >
                <h2
                  className="
                    text-[24px]
                    font-bold
                    tracking-[-0.02em]
                    text-[#17182a]
                  "
                >
                  Your cart is empty
                </h2>

                <p className="mt-1 text-[15px] text-[#282f40]">
                  Have an account?{" "}
                  <Link
                    to="/login"
                    onClick={() => setCartOpen(false)}
                    className="
                      cursor-pointer
                      text-[#125ee8]
                      underline
                      underline-offset-2
                    "
                  >
                    Log in
                  </Link>{" "}
                  to check out faster.
                </p>

                <Link
                  to="/catalog"
                  onClick={() => setCartOpen(false)}
                  className="
                    mt-7
                    flex
                    h-[47px]
                    min-w-[208px]
                    cursor-pointer
                    items-center
                    justify-center
                    rounded-[7px]
                    bg-[#213c67]
                    px-7
                    text-[15px]
                    font-semibold
                    text-white
                    transition-colors
                    hover:bg-[#172f55]
                  "
                >
                  Continue shopping
                </Link>
              </div>
            ) : (
              <>
                <div
                  className="
                    flex
                    items-center
                    justify-between
                    border-b
                    border-[#e4e7eb]
                    px-5
                    pb-4
                    sm:px-6
                  "
                >
                  <h2 className="text-[23px] font-bold text-[#17182a]">
                    Your cart
                  </h2>

                  <span className="text-[14px] text-[#697181]">
                    {cartCount} {cartCount === 1 ? "item" : "items"}
                  </span>
                </div>

                <div
                  className="
                    flex-1
                    overflow-y-auto
                    px-5
                    py-2
                    sm:px-6
                  "
                >
                  {cartItems.map((item) => (
                    <div
                      key={item.id}
                      className="
                        flex
                        gap-4
                        border-b
                        border-[#e5e7eb]
                        py-5
                      "
                    >
                      <div
                        className="
                          h-[95px]
                          w-[95px]
                          shrink-0
                          overflow-hidden
                          bg-[#f3f4f5]

                          sm:h-[110px]
                          sm:w-[110px]
                        "
                      >
                        <img
                          src={item.image}
                          alt={item.title}
                          className="h-full w-full object-cover"
                        />
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <h3
                              className="
                                text-[15px]
                                font-medium
                                leading-[1.4]
                                text-[#252b39]
                                sm:text-[16px]
                              "
                            >
                              {item.title}
                            </h3>

                            <p className="mt-1 text-[15px] text-[#243c64]">
                              ${Number(item.price).toFixed(2)}
                            </p>
                          </div>

                          <button
                            type="button"
                            aria-label={`Remove ${item.title}`}
                            onClick={() => removeFromCart(item.id)}
                            className="
                              cursor-pointer
                              text-[#7b818c]
                              transition-colors
                              hover:text-red-500
                            "
                          >
                            <Trash2 size={17} strokeWidth={1.7} />
                          </button>
                        </div>

                        <div
                          className="
                            mt-4
                            inline-flex
                            h-[38px]
                            items-center
                            rounded-[7px]
                            border
                            border-[#d5d9df]
                          "
                        >
                          <button
                            type="button"
                            onClick={() =>
                              decreaseQuantity(item.id)
                            }
                            className="
                              flex
                              h-full
                              w-[38px]
                              cursor-pointer
                              items-center
                              justify-center
                            "
                          >
                            <Minus size={14} />
                          </button>

                          <span
                            className="
                              flex
                              h-full
                              min-w-[34px]
                              items-center
                              justify-center
                              text-[14px]
                              text-[#252b39]
                            "
                          >
                            {item.quantity}
                          </span>

                          <button
                            type="button"
                            onClick={() =>
                              increaseQuantity(item.id)
                            }
                            className="
                              flex
                              h-full
                              w-[38px]
                              cursor-pointer
                              items-center
                              justify-center
                            "
                          >
                            <Plus size={14} />
                          </button>
                        </div>

                        <p className="mt-3 text-[14px] font-semibold text-[#17182a]">
                          $
                          {(
                            Number(item.price) * item.quantity
                          ).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <div
                  className="
                    shrink-0
                    border-t
                    border-[#dfe3e8]
                    bg-white
                    px-5
                    py-5
                    sm:px-6
                  "
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[16px] font-medium text-[#252b39]">
                      Subtotal
                    </span>

                    <span className="text-[18px] font-bold text-[#17182a]">
                      ${cartTotal.toFixed(2)}
                    </span>
                  </div>

                  <p className="mt-1 text-[12px] text-[#7b818c]">
                    Shipping and taxes calculated at checkout.
                  </p>

                  <button
                    type="button"
                    className="
                      mt-4
                      flex
                      h-[50px]
                      w-full
                      cursor-pointer
                      items-center
                      justify-center
                      rounded-[7px]
                      bg-[#213c67]
                      text-[15px]
                      font-semibold
                      text-white
                      transition-colors
                      hover:bg-[#172f55]
                    "
                  >
                    Checkout
                  </button>

                  <Link
                    to="/catalog"
                    onClick={() => setCartOpen(false)}
                    className="
                      mt-3
                      block
                      cursor-pointer
                      text-center
                      text-[14px]
                      text-[#243c64]
                      underline
                      underline-offset-2
                    "
                  >
                    Continue shopping
                  </Link>
                </div>
              </>
            )}
          </aside>
        </div>
      )}
    </>
  );
};

export default Header;
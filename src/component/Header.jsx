// Header.jsx

import {
  Search,
  UserRound,
  ShoppingBag,
  Menu,
  X,
} from "lucide-react";
import { useState } from "react";
import {Link} from "react-router-dom"

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="relative w-full">
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

          {/* Brand */}
          <div
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
          </div>

          {/* Navigation */}
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
              className="text-[14px] font-normal text-[#3f3f3f] transition-colors duration-200 hover:text-black"
            >
              Home
            </Link>

            <Link
              to="/catalog"
              className="text-[14px] font-normal text-[#3f3f3f] transition-colors duration-200 hover:text-black"
            >
              Catalog
            </Link>

            <Link
              to="/contact"
              className="text-[14px] font-normal text-[#3f3f3f] transition-colors duration-200 hover:text-black"
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
          <button
            type="button"
            aria-label="Search"
            className="flex items-center justify-center text-black"
          >
            <Search size={19} strokeWidth={1.8} />
          </button>

          <button
            type="button"
            aria-label="Profile"
            className="hidden items-center justify-center text-black sm:flex"
          >
            <UserRound size={19} strokeWidth={1.8} />
          </button>

          <button
            type="button"
            aria-label="Cart"
            className="flex items-center justify-center text-black"
          >
            <ShoppingBag size={19} strokeWidth={1.8} />
          </button>

          {/* Mobile Menu */}
          <button
            type="button"
            aria-label="Toggle menu"
            onClick={() => setMenuOpen(!menuOpen)}
            className="flex items-center justify-center text-black md:hidden"
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

          ${
            menuOpen
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
  );
};

export default Header;
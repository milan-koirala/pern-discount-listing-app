import { useState } from "react";
import { ShoppingCartIcon, MenuIcon, XIcon } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import ThemeSelector from "./ThemeSelector";
import UserMenu from "./UserMenu";

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  // Pages where UserMenu should be hidden
  const hideUserMenuRoutes = ["/login", "/register"];
  const showUserMenu = !hideUserMenuRoutes.includes(location.pathname);

  return (
    <div className="bg-base-100/80 backdrop-blur-lg border-b border-base-content/10 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="navbar min-h-[4rem] justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <Link to="/" className="hover:opacity-80 transition-opacity flex items-center gap-2">
              <ShoppingCartIcon className="size-8 text-primary" />
              <span className="font-semibold font-mono tracking-widest text-xl bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
                DISCOUNTIFY
              </span>
            </Link>
          </div>

          {/* Desktop Right Menu */}
          <div className="hidden md:flex items-center gap-4">
            <ThemeSelector />
            {showUserMenu && <UserMenu />}
          </div>

          {/* Mobile Menu Toggle */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="btn btn-ghost btn-sm"
              aria-label="Toggle menu"
            >
              {menuOpen ? <XIcon className="w-6 h-6" /> : <MenuIcon className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {menuOpen && (
          <div className="md:hidden mt-2 pb-4 border-t border-base-content/10">
            <div className="flex flex-col gap-3 pt-4">
              <ThemeSelector />
              {showUserMenu && <UserMenu />}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Navbar;

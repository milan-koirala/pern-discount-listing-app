import { useState, useRef, useEffect } from "react";
import { UserCircle2Icon, LogOutIcon, SettingsIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function UserMenu() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (!user) return null;

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const handleManageShop = () => {
    navigate("/manage-shop");
    setOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setOpen(!open)}
        className="p-2 rounded-full hover:bg-base-200 transition-colors cursor-pointer"
        aria-haspopup="true"
        aria-expanded={open}
      >
        <UserCircle2Icon className="size-6" />
      </button>

      {open && (
        <ul
          className="absolute right-0 mt-2 w-48 bg-base-200 backdrop-blur-lg rounded-xl border border-base-content/10 shadow-lg z-50"
          role="menu"
          aria-label="User menu"
          aria-hidden={!open}
        >
          <li>
            <button
              onClick={handleManageShop}
              className="flex items-center gap-2 w-full px-4 py-3 hover:bg-base-content/10"
              role="menuitem"
            >
              <SettingsIcon className="size-4" />
              Manage Shop
            </button>
          </li>
          <li>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 w-full px-4 py-3 hover:bg-base-content/10 text-error"
              role="menuitem"
            >
              <LogOutIcon className="size-4" />
              Logout
            </button>
          </li>
        </ul>
      )}
    </div>
  );
}

export default UserMenu;

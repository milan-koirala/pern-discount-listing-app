import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useShopStore } from "../store/useShopStore";
import {
  Package2Icon,
  MailIcon,
  LockIcon,
  MapPinIcon,
} from "lucide-react";
import InputField from "../components/InputField";

function ShopRegisterPage() {
  const { registerShop, formData, setFormData, loading } = useShopStore();
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const validateForm = () => {
    const newErrors = {};
    if (!formData.shop_name?.trim()) newErrors.shop_name = "Shop name is required";
    if (!formData.email?.match(/^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/))
      newErrors.email = "Invalid email format";
    if (!formData.password?.trim()) newErrors.password = "Password is required";
    if (formData.password?.length < 8)
      newErrors.password = "Password must be at least 8 characters";
    if (formData.password !== formData.confirm_password)
      newErrors.confirm_password = "Passwords do not match";
    if (!formData.city?.trim()) newErrors.city = "City is required";
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateForm();

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      await registerShop();
      setErrors({});
      navigate("/login");
    } catch (error) {
      setErrors({ general: error.message || "Failed to register shop" });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-base-200 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md md:max-w-2xl bg-base-100 shadow-lg rounded-xl p-6 sm:p-8">
        <div className="text-center mb-6">
          <h2 className="text-2xl sm:text-3xl font-bold text-primary">
            Register Your Shop
          </h2>
          <p className="mt-1 text-sm text-base-content/60">
            Fill in your shop details to get started
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputField
              label="Shop Name"
              type="text"
              name="shop_name"
              placeholder="Enter shop name"
              value={formData.shop_name || ""}
              onChange={(e) =>
                setFormData({ ...formData, shop_name: e.target.value })
              }
              icon={Package2Icon}
              id="shop-name"
              error={errors.shop_name}
            />

            <InputField
              label="Email"
              type="email"
              name="email"
              placeholder="Enter shop email"
              value={formData.email || ""}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              icon={MailIcon}
              id="shop-email"
              error={errors.email}
            />

            <InputField
              label="Password"
              type="password"
              name="password"
              placeholder="Enter password"
              value={formData.password || ""}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              icon={LockIcon}
              id="shop-password"
              error={errors.password}
            />

            <InputField
              label="Confirm Password"
              type="password"
              name="confirm_password"
              placeholder="Confirm password"
              value={formData.confirm_password || ""}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  confirm_password: e.target.value,
                })
              }
              icon={LockIcon}
              id="shop-confirm-password"
              error={errors.confirm_password}
            />

            {/* City field spans both columns on md+ screens */}
            <div className="md:col-span-2">
              <InputField
                label="City"
                type="text"
                name="city"
                placeholder="Enter city"
                value={formData.city || ""}
                onChange={(e) =>
                  setFormData({ ...formData, city: e.target.value })
                }
                icon={MapPinIcon}
                id="shop-city"
                error={errors.city}
              />
            </div>
          </div>

          {errors.general && (
            <div className="text-error text-sm">{errors.general}</div>
          )}

          <button
            type="submit"
            className="btn btn-primary w-full rounded-md"
            disabled={
              !formData.shop_name?.trim() ||
              !formData.email?.trim() ||
              !formData.password?.trim() ||
              !formData.confirm_password?.trim() ||
              !formData.city?.trim() ||
              loading
            }
          >
            {loading ? (
              <span className="loading loading-spinner loading-sm" />
            ) : (
              "Register Shop"
            )}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-base-content/60">
          Already have an account?{" "}
          <Link to="/login" className="link link-primary font-medium">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}

export default ShopRegisterPage;

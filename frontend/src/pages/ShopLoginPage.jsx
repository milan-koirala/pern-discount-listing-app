import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useShopStore } from "../store/useShopStore";
import { useAuth } from "../context/AuthContext";
import { MailIcon, LockIcon } from "lucide-react";
import InputField from "../components/InputField";

function ShopLoginPage() {
  const { formData, setFormData, loginShop, loading, error } = useShopStore();
  const { login, user } = useAuth();
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [user, navigate]);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.email?.match(/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/)) {
      newErrors.email = "Invalid email format";
    }
    if (!formData.password?.trim()) {
      newErrors.password = "Password is required";
    }
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
      const data = await loginShop(); // Zustand store calls backend login
      // Backend should send token in response.data.token (adjust if different)
      login(data.token, data.data); // Update context + localStorage
      setErrors({});
      navigate("/");
    } catch (err) {
      setErrors({ general: err.message || "Login failed" });
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center p-4 sm:p-6">
      <div className="card w-full max-w-md bg-base-100 shadow-xl">
        <div className="card-body space-y-4">
          <h2 className="text-center text-2xl sm:text-3xl font-bold">
            Login to Your Shop
          </h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid gap-6">
              <InputField
                label="Email"
                type="email"
                name="email"
                placeholder="Enter shop email"
                value={formData.email || ""}
                onChange={(e) => setFormData({ email: e.target.value })}
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
                onChange={(e) => setFormData({ password: e.target.value })}
                icon={LockIcon}
                id="shop-password"
                error={errors.password}
              />
            </div>
            {errors.general && (
              <p className="text-sm text-red-500">{errors.general}</p>
            )}
            {error && !errors.general && (
              <p className="text-sm text-red-500">{error}</p>
            )}
            <div className="modal-action">
              <button
                type="submit"
                className="btn btn-primary w-full"
                disabled={!formData.email || !formData.password || loading}
              >
                {loading ? (
                  <span className="loading loading-spinner loading-sm" />
                ) : (
                  "Login"
                )}
              </button>
            </div>
          </form>
          <p className="text-center text-sm">
            Don't have an account?{" "}
            <Link to="/register" className="link link-primary">
              Register
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default ShopLoginPage;

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useShopStore } from "../store/useShopStore";
import { Package2Icon, MailIcon, LockIcon, MapPinIcon } from "lucide-react";
import InputField from "../components/InputField";

function ShopRegisterPage() {
    const { addShop, formData, setFormData, loading, error } = useShopStore();
    const [errors, setErrors] = useState({});
    const navigate = useNavigate();

    const validateForm = () => {
    const newErrors = {};
    if (!formData.shop_name?.trim()) newErrors.shop_name = "Shop name is required";
    if (!formData.email?.match(/^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/))
        newErrors.email = "Invalid email format";
    if (!formData.password?.trim()) newErrors.password = "Password is required";
    if (formData.password?.length < 8) newErrors.password = "Password must be at least 8 characters";
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
        await addShop();
        setErrors({});
        navigate("/login");
    } catch (error) {
        setErrors({ general: error.message || "Failed to register shop" });
    }
    };

    return (
    <div className="flex min-h-screen items-center justify-center p-4 sm:p-6">
        <div className="card w-full max-w-md bg-base-100 shadow-xl">
        <div className="card-body space-y-4">
            <h2 className="text-center text-2xl sm:text-3xl font-bold">
            Register Your Shop
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid gap-6">
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
                    setFormData({ ...formData, confirm_password: e.target.value })
                }
                icon={LockIcon}
                id="shop-confirm-password"
                error={errors.confirm_password}
                />

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

            <div className="modal-action">
                <button
                type="submit"
                className="btn btn-primary w-full"
                style={{ borderRadius: "10px" }}
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
            </div>
            </form>

            <p className="text-center text-sm">
            Already have an account?{" "}
            <Link to="/login" className="link link-primary">
                Login
            </Link>
            </p>
        </div>
        </div>
    </div>
    );
}

export default ShopRegisterPage;
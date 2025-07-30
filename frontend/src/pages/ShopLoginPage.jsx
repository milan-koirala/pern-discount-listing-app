import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useShopStore } from "../store/useShopStore";
import { MailIcon, LockIcon } from "lucide-react";
import InputField from "../components/InputField";

function ShopLoginPage() {
    const { loginShop, formData, setFormData, loading } = useShopStore();
    const [errors, setErrors] = useState({});
    const navigate = useNavigate();

    // Validate form inputs
    const validateForm = () => {
        const newErrors = {};
        if (!formData.email?.match(/^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/))
            newErrors.email = "Invalid email format";
        if (!formData.password?.trim()) newErrors.password = "Password is required";
        return newErrors;
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        const validationErrors = validateForm();

        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        try {
            await loginShop();
            setErrors({});
            navigate("/");
        } catch (error) {
            setErrors({ general: error.message || "Failed to login" });
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
                        </div>

                        <div className="modal-action">
                            <button
                                type="submit"
                                className="btn btn-primary w-full"
                                style={{ borderRadius: "10px" }}
                                disabled={
                                    !formData.email?.trim() ||
                                    !formData.password?.trim() ||
                                    loading
                                }
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
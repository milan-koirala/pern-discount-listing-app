import { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  StoreIcon,
  MailIcon,
  MapPinIcon,
  LockIcon,
  ArrowLeftIcon,
  SaveIcon,
  UserIcon,
  ShieldIcon,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useShopStore } from "../store/useShopStore";
import InputField from "../components/InputField";
import toast from "react-hot-toast";

function ManageShopPage() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const {
    shopData,
    fetchShop,
    updateShopInfo,
    updateShopPassword,
    loading,
    error,
  } = useShopStore();

  const [formData, setFormData] = useState({
    shop_name: "",
    email: "",
    city: "",
  });

  const [initialFormData, setInitialFormData] = useState({
    shop_name: "",
    email: "",
    city: "",
  });

  const [passwords, setPasswords] = useState({
    current_password: "",
    new_password: "",
    confirm_password: "",
  });

  const [activeTab, setActiveTab] = useState("personal");

  useEffect(() => {
    if (user?.id) {
      fetchShop(user.id);
    }
  }, [user, fetchShop]);

  useEffect(() => {
    if (shopData) {
      const newFormData = {
        shop_name: shopData.shop_name || "",
        email: shopData.email || "",
        city: shopData.city || "",
      };
      setFormData(newFormData);
      setInitialFormData(newFormData);
    }
  }, [shopData]);

  const hasChanges = useMemo(() => {
    return (
      formData.shop_name !== initialFormData.shop_name ||
      formData.email !== initialFormData.email ||
      formData.city !== initialFormData.city
    );
  }, [formData, initialFormData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswords((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpdateInfo = async (e) => {
    e.preventDefault();
    if (!hasChanges) return;

    const result = await updateShopInfo(user.id, formData);

    if (result?.success) {
      setInitialFormData(formData);
      navigate("/");
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    const { current_password, new_password, confirm_password } = passwords;

    if (!current_password || !new_password || !confirm_password) {
      toast.error("All password fields are required");
      return;
    }

    if (new_password !== confirm_password) {
      toast.error("New password and confirmation do not match");
      return;
    }

    const confirm = window.confirm("Are you sure you want to change password?");
    if (!confirm) return;

    const result = await updateShopPassword(
      user.id,
      current_password,
      new_password
    );

    if (result?.success) {
      setPasswords({
        current_password: "",
        new_password: "",
        confirm_password: "",
      });
      navigate("/");
    }
  };

  // Full-page loading (only on initial fetch)
  if (loading && !shopData) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="loading loading-spinner loading-lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="alert alert-error">{error}</div>
      </div>
    );
  }

  return (
    <div className="container max-w-7xl mx-auto px-4 py-8">
      <button
        onClick={() => navigate("/")}
        className="btn btn-ghost mb-6 flex items-center gap-2"
      >
        <ArrowLeftIcon className="w-4 h-4" />
        Back to Discounts
      </button>

      <div className="card bg-base-100 shadow-xl p-6">
        <div className="mb-6">
          <h2 className="text-xl font-bold flex items-center gap-2 mb-1">
            <StoreIcon className="w-6 h-6" />
            {shopData?.shop_name || "Shop Name"}
          </h2>
          <p className="text-sm text-gray-500 ml-8">{shopData?.email}</p>
        </div>

        {/* Responsive Layout */}
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Tabs */}
          <div className="flex flex-row lg:flex-col gap-2 border-b lg:border-b-0 lg:border-r pb-4 lg:pb-0 lg:pr-4 w-full lg:w-48">
            <button
              className={`flex items-center gap-2 py-2 px-3 rounded-md font-medium whitespace-nowrap ${
                activeTab === "personal"
                  ? "bg-primary text-white"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
              onClick={() => setActiveTab("personal")}
            >
              <UserIcon className="w-4 h-4" />
              <span>Shop Info</span>
            </button>
            <button
              className={`flex items-center gap-2 py-2 px-3 rounded-md font-medium whitespace-nowrap ${
                activeTab === "security"
                  ? "bg-primary text-white"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
              onClick={() => setActiveTab("security")}
            >
              <ShieldIcon className="w-4 h-4" />
              <span>Security</span>
            </button>
          </div>

          {/* Form Section */}
          <div className="w-full">
            {activeTab === "personal" && (
              <form onSubmit={handleUpdateInfo} className="space-y-4">
                <InputField
                  label="Shop Name"
                  name="shop_name"
                  value={formData.shop_name}
                  onChange={handleChange}
                  icon={StoreIcon}
                  placeholder="Enter shop name"
                />
                <InputField
                  label="Email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  icon={MailIcon}
                  placeholder="Enter email"
                />
                <InputField
                  label="City"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  icon={MapPinIcon}
                  placeholder="Enter city"
                />
                <div className="flex flex-col sm:flex-row justify-end sm:gap-2 pt-4">
                  <button
                    type="button"
                    onClick={() => navigate("/")}
                    className="btn btn-ghost w-full sm:w-auto mb-2 sm:mb-0"
                    disabled={loading}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary w-full sm:w-auto"
                    disabled={loading || !hasChanges}
                  >
                    {loading ? (
                      <span className="loading loading-spinner loading-sm" />
                    ) : (
                      <>
                        <SaveIcon className="w-4 h-4 mr-2" />
                        Save Changes
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}

            {activeTab === "security" && (
              <form onSubmit={handleChangePassword} className="space-y-4">
                <InputField
                  label="Current Password"
                  name="current_password"
                  type="password"
                  value={passwords.current_password}
                  onChange={handlePasswordChange}
                  icon={LockIcon}
                  placeholder="Enter current password"
                />
                <InputField
                  label="New Password"
                  name="new_password"
                  type="password"
                  value={passwords.new_password}
                  onChange={handlePasswordChange}
                  icon={LockIcon}
                  placeholder="Enter new password"
                />
                <InputField
                  label="Confirm Password"
                  name="confirm_password"
                  type="password"
                  value={passwords.confirm_password}
                  onChange={handlePasswordChange}
                  icon={LockIcon}
                  placeholder="Confirm new password"
                />
                <div className="flex flex-col sm:flex-row justify-end sm:gap-2 pt-4">
                  <button
                    type="button"
                    onClick={() => navigate("/")}
                    className="btn btn-ghost w-full sm:w-auto mb-2 sm:mb-0"
                    disabled={loading}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary w-full sm:w-auto"
                    disabled={
                      loading ||
                      !passwords.current_password ||
                      !passwords.new_password ||
                      !passwords.confirm_password
                    }
                  >
                    {loading ? (
                      <span className="loading loading-spinner loading-sm" />
                    ) : (
                      <>
                        <SaveIcon className="w-4 h-4 mr-2" />
                        Change Password
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ManageShopPage;

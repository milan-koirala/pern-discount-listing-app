import { useEffect, useState } from "react";
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

function ManageShopPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const {
    shopData,
    formData,
    setFormData,
    fetchShop,
    updateShopInfo,
    updateShopPassword,
    loading,
  } = useShopStore();

  const [activeTab, setActiveTab] = useState("personal");
  const [passwords, setPasswords] = useState({
    current_password: "",
    new_password: "",
    confirm_password: "",
  });

  useEffect(() => {
    if (user?.id) {
      fetchShop(user.id);
    }
  }, [user]);

  useEffect(() => {
    if (shopData) {
      setFormData({
        shop_name: shopData.shop_name || "",
        email: shopData.email || "",
        city: shopData.city || "",
      });
    }
  }, [shopData]);

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
    await updateShopInfo(user.id, formData);
    navigate("/discounts");
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    const { current_password, new_password, confirm_password } = passwords;

    if (!current_password || !new_password || !confirm_password) {
      return alert("All password fields are required.");
    }

    if (new_password !== confirm_password) {
      return alert("New passwords do not match.");
    }

    await updateShopPassword(user.id, current_password, new_password);
    navigate("/discounts");
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <button
        onClick={() => navigate("/discounts")}
        className="btn btn-ghost mb-6 flex items-center gap-2"
      >
        <ArrowLeftIcon className="w-4 h-4" />
        Back to Discounts
      </button>

      <div className="card bg-base-100 shadow-xl p-6">
        {/* Shop Header */}
        <div className="mb-6">
          <h2 className="text-xl font-bold flex items-center gap-2 mb-1">
            <StoreIcon className="w-6 h-6" />
            {shopData?.shop_name || "Shop Name"}
          </h2>
          <p className="text-sm text-gray-500">{shopData?.email}</p>
        </div>

        {/* Content Layout */}
        <div className="flex gap-8">
          {/* Sidebar */}
          <div className="flex flex-col gap-2 w-48 border-r pr-4">
            <button
              className={`flex items-center gap-2 py-2 px-3 rounded-md font-medium text-left ${
                activeTab === "personal"
                  ? "bg-primary text-white"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
              onClick={() => setActiveTab("personal")}
            >
              <UserIcon className="w-4 h-4" />
              Personal Info
            </button>
            <button
              className={`flex items-center gap-2 py-2 px-3 rounded-md font-medium text-left ${
                activeTab === "security"
                  ? "bg-primary text-white"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
              onClick={() => setActiveTab("security")}
            >
              <ShieldIcon className="w-4 h-4" />
              Security
            </button>
          </div>

          {/* Form Content */}
          <div className="flex-1">
            {activeTab === "personal" && (
              <form onSubmit={handleUpdateInfo} className="space-y-4">
                <InputField
                  label="Shop Name"
                  name="shop_name"
                  value={formData.shop_name}
                  onChange={handleChange}
                  icon={StoreIcon}
                />
                <InputField
                  label="Email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  icon={MailIcon}
                />
                <InputField
                  label="City"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  icon={MapPinIcon}
                />

                <div className="flex justify-end gap-2 pt-4">
                  <button
                    type="button"
                    onClick={() => navigate("/discounts")}
                    className="btn btn-ghost"
                    disabled={loading}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary" disabled={loading}>
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
                />
                <InputField
                  label="New Password"
                  name="new_password"
                  type="password"
                  value={passwords.new_password}
                  onChange={handlePasswordChange}
                  icon={LockIcon}
                />
                <InputField
                  label="Confirm Password"
                  name="confirm_password"
                  type="password"
                  value={passwords.confirm_password}
                  onChange={handlePasswordChange}
                  icon={LockIcon}
                />

                <div className="flex justify-end gap-2 pt-4">
                  <button
                    type="button"
                    onClick={() => navigate("/discounts")}
                    className="btn btn-ghost"
                    disabled={loading}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary" disabled={loading}>
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

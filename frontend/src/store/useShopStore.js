import { create } from "zustand";
import toast from "react-hot-toast";
import axiosInstance from "../utils/axiosInstance";

export const useShopStore = create((set, get) => ({
  formData: {
    email: "",
    password: "",
    shop_name: "",
    city: "",
    confirm_password: "",
  },
  shopData: null,
  loading: false,
  error: null,

  // Set form data (merge)
  setFormData: (data) =>
    set((state) => ({ formData: { ...state.formData, ...data } })),

  // Clear form
  clearFormData: () =>
    set({
      formData: {
        email: "",
        password: "",
        shop_name: "",
        city: "",
        confirm_password: "",
      },
      error: null,
    }),

  // Login shop
  loginShop: async () => {
    set({ loading: true, error: null });
    try {
      const { formData } = get();
      const res = await axiosInstance.post("/api/auth/login", {
        email: formData.email,
        password: formData.password,
      });

      if (res.data?.success) {
        toast.success("Logged in successfully");
      } else {
        toast.error(res.data?.message || "Login failed");
      }

      set({ loading: false });
      return res.data;
    } catch (error) {
      const message =
        error.response?.data?.message ||
        (error.code === "ERR_NETWORK"
          ? "Cannot connect to server"
          : "Failed to login");

      set({ error: message, loading: false });
      toast.error(message);
      throw new Error(message);
    }
  },

  // Fetch shop by ID
  fetchShop: async (id) => {
    set({ loading: true, error: null });
    try {
      const res = await axiosInstance.get(`/api/shops/${id}`);
      if (res.data?.data) {
        set({
          shopData: res.data.data,
          formData: {
            shop_name: res.data.data.shop_name || "",
            email: res.data.data.email || "",
            city: res.data.data.city || "",
          },
        });
      } else {
        toast.error("No shop data returned.");
      }
    } catch (error) {
      toast.error("Failed to load shop details.");
      console.error("Failed to fetch shop:", error);
      set({ error });
    } finally {
      set({ loading: false });
    }
  },

  // Update shop
  updateShopInfo: async (id, formData) => {
    set({ loading: true, error: null });

    try {
      const res = await axiosInstance.put(`/api/shops/${id}/info`, formData);

      if (res.data?.success) {
        toast.success("Shop information updated successfully");
        set({ shopData: res.data.data });
        return { success: true }; // signal to redirect
      } else {
        toast.error(res.data?.message || "Update failed");
        return { success: false };
      }

    } catch (err) {
      const msg = err.response?.data?.message || "Failed to update shop";
      toast.error(msg);
      set({ error: msg });
      return { success: false };
    } finally {
      set({ loading: false });
    }
  },

  updateShopPassword: async (id, current_password, new_password) => {
    set({ loading: true, error: null });

    try {
      const res = await axiosInstance.put(`/api/shops/${id}/password`, {
        current_password,
        new_password,
      });

      toast.success("Password changed successfully");
      return { success: true };
    } catch (err) {
      const msg = err.response?.data?.message || "Failed to change password";
      toast.error(msg);
      set({ error: msg });
      return { success: false };
    } finally {
      set({ loading: false });
    }
  },
}));

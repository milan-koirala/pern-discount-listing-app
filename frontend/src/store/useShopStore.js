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
  loading: false,
  error: null,

  setFormData: (data) =>
    set((state) => ({ formData: { ...state.formData, ...data } })),

  loginShop: async () => {
    set({ loading: true, error: null });
    try {
      const { formData } = get();
      const response = await axiosInstance.post("/api/auth/login", {
        email: formData.email,
        password: formData.password,
      });

      if (response.data?.success) {
        toast.success("Logged in successfully");
      } else {
        toast.error(response.data?.message || "Login failed");
      }

      set({ loading: false });
      return response.data;
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
}));

import { create } from "zustand";
import toast from "react-hot-toast";
import axiosInstance from "../utils/axiosInstance";

export const useDiscountStore = create((set, get) => ({
  formData: {
    shop_id: "",
    title: "",
    discount_percentage: "",
    category: "",
    start_date: "",
    end_date: "",
  },
  loading: false,
  error: null,
  discounts: [],
  shops: [],

  setFormData: (data) =>
    set((state) => ({
      formData: { ...state.formData, ...data },
    })),

  setLoading: (val) => set({ loading: val }),

  // Reusable fetch helper
  fetchData: async (url, label = "discounts", params = {}) => {
    set({ loading: true, error: null });

    try {
      const res = await axiosInstance.get(url, { params });
      const data = res.data?.data;

      if (Array.isArray(data)) {
        set({ discounts: data });
      } else {
        console.warn(`Unexpected ${label} response format:`, res.data);
        set({ discounts: [] });
      }
    } catch (err) {
      // console.error(`->> Error fetching ${label}:`, err);
      set({
        error: `Failed to load ${label}`,
        discounts: [],
      });
    } finally {
      set({ loading: false });
    }
  },

  fetchDiscounts: async (params = {}) => {
    await get().fetchData("/api/discounts", "discounts", params);
  },

  fetchMyDiscounts: async (params = {}) => {
    await get().fetchData("/api/discounts/my", "your discounts", params);
  },

  addDiscount: async () => {
    const { formData } = get();
    set({ loading: true, error: null });

    try {
      const response = await axiosInstance.post("/api/discounts/add", formData);

      if (response.data.success) {
        toast.success("Discount added successfully!");

        set({
          formData: {
            shop_id: formData.shop_id,
            title: "",
            discount_percentage: "",
            category: "",
            start_date: "",
            end_date: "",
          },
        });

        await get().fetchDiscounts();
        return response.data;
      } else {
        toast.error(response.data.message || "Failed to add discount");
        set({ error: response.data.message || "Add failed" });
      }
    } catch (error) {
      const message =
        error.response?.data?.message ||
        (error.code === "ERR_NETWORK"
          ? "Cannot connect to server"
          : "Failed to add discount");

      toast.error(message);
      set({ error: message });
      throw new Error(message);
    } finally {
      set({ loading: false });
    }
  },

  fetchDiscountsById: async (id) => {
    if (!id) {
      set({ error: "Invalid ID", loading: false });
      toast.error("Invalid discount ID");
      return null; // important
    }

    set({ loading: true });

    try {
      const res = await axiosInstance.get(`/api/discounts/${id}`);
      const data = res.data.data;

      const formatDate = (isoString) => isoString?.split("T")[0];

      const formattedData = {
        ...data,
        start_date: formatDate(data.start_date),
        end_date: formatDate(data.end_date),
      };

      set({
        formData: formattedData,
        error: null,
      });

      return formattedData; // RETURN the formatted discount data
    } catch (err) {
      console.error("Fetch discount by ID failed:", err);

      set({
        error:
          err?.response?.status === 429
            ? "Rate limit exceeded"
            : "Failed to load discount",
        formData: {},
      });

      return null; // return null so caller can handle the error
    } finally {
      set({ loading: false });
    }
  },


  updateDiscount: async (id, updatedData) => {
    set({ loading: true, error: null });

    try {
      const res = await axiosInstance.put(`/api/discounts/${id}`, updatedData);

      if (res.data?.success) {
        toast.success("Discount updated successfully");
        return { success: true };
      } else {
        toast.error(res.data?.message || "Failed to update discount");
        return { success: false };
      }
    } catch (error) {
      const message =
        error.response?.data?.message ||
        (error.code === "ERR_NETWORK"
          ? "Cannot connect to server"
          : "Update failed");

      toast.error(message);
      return { success: false };
    } finally {
      set({ loading: false });
    }
  },
}));

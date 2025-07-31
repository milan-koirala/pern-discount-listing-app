import { create } from "zustand";
import axios from "axios";
import toast from "react-hot-toast";

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

export const useDiscountStore = create((set, get) => ({
    discounts: [],
    shops: [], // Add shops state
    loading: false,
    error: null,
    formData: {
        title: "",
        discount_percentage: "",
        category: "",
        start_date: "",
        end_date: "",
        shop_id: "", // Add shop_id to formData
    },

    setFormData: (newFormData) =>
        set((state) => ({
            formData: { ...state.formData, ...newFormData },
        })),

    resetForm: () =>
        set({
            formData: {
                title: "",
                discount_percentage: "",
                category: "",
                start_date: "",
                end_date: "",
                shop_id: "",
            },
        }),

    fetchShops: async () => {
        set({ loading: true, error: null });
        try {
            const response = await axios.get(`${BASE_URL}/api/shops`);
            set({ shops: response.data.data, error: null });
        } catch (error) {
            console.error("Error fetching shops:", error);
            const message = error.response?.data?.message || "Failed to fetch shops";
            set({ error: message });
            toast.error(message);
        } finally {
            set({ loading: false });
        }
    },

    addDiscount: async () => {
        set({ loading: true });
        try {
            const { formData } = get();

            const startDateISO = new Date(formData.start_date).toISOString();
            const endDateISO = new Date(formData.end_date).toISOString();

            const payload = {
                ...formData,
                discount_percentage: parseFloat(formData.discount_percentage),
                start_date: startDateISO,
                end_date: endDateISO,
                shop_id: parseInt(formData.shop_id), // Ensure integer
            };

            console.log("Payload sent to API:", payload);

            await axios.post(`${BASE_URL}/api/discounts/addDiscount`, payload);

            await get().fetchDiscounts();
            get().resetForm();
            toast.success("Discount added successfully");

            const dialog = document.getElementById("add_discount_modal");
            if (dialog && dialog.close) dialog.close();
        } catch (error) {
            // console.error("Error in addDiscount function", {
            //     message: error.message,
            //     response: error.response?.data
            // });
            toast.error(error.response?.data?.message || "Something went wrong");
        } finally {
            set({ loading: false });
        }
    },

    fetchDiscounts: async (filters = {}) => {
        set({ loading: true, error: null });
        try {
            const params = new URLSearchParams(filters).toString();
            const response = await axios.get(`${BASE_URL}/api/discounts?${params}`);
            set({ discounts: response.data.data, error: null });
        } catch (error) {
            console.error("Error fetching discounts:", error);
            const message = error.response?.data?.message || "Failed to fetch discounts";
            set({ error: message });
            toast.error(message);
        } finally {
            set({ loading: false });
        }
    },
}));
import { create } from 'zustand';
import axios from 'axios';
import toast from 'react-hot-toast';

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

export const useDiscountStore = create((set, get) => ({
    discounts: [],
    loading: false,
    error: null,

    // Form state (use `title` instead of product_name)
    formData: {
        title: '',
        discount_percentage: '',
        category: '',
        start_date: '',
        end_date: '',
    },

    setFormData: (newFormData) =>
        set((state) => ({
            formData: { ...state.formData, ...newFormData },
        })),

    resetForm: () =>
        set({
            formData: {
                title: '',
                discount_percentage: '',
                category: '',
                start_date: '',
                end_date: '',
            },
        }),

    // Create a discount
    addDiscount: async (e) => {
        e.preventDefault();
        set({ loading: true });

        try {
            const { formData } = get();
            const shopId = localStorage.getItem("shop_id");

            if (!shopId) {
            toast.error("Shop ID not found. Please login.");
            return;
            }

            const payload = {
            ...formData,
            shop_id: shopId,
            };

            await axios.post(`${BASE_URL}/api/discounts`, payload);
            await get().fetchDiscounts();
            get().resetForm();
            toast.success("Discount added successfully");
            document.getElementById("add_discount_modal").close();
        } catch (error) {
            console.log("Error in addDiscount function", error);
            toast.error("Something went wrong");
        } finally {
            set({ loading: false });
        }
    },



    // Fetch discounts (with optional filters)
    fetchDiscounts: async (filters = {}) => {
        set({ loading: true, error: null });
        try {
            const params = new URLSearchParams(filters).toString();
            const response = await axios.get(`${BASE_URL}/api/discounts?${params}`);

            set({ discounts: response.data.data, error: null });
        } catch (error) {
            console.error('Error fetching discounts:', error);
            const message =
                error.response?.data?.message || 'Failed to fetch discounts';
            set({ error: message });
            toast.error(message);
        } finally {
            set({ loading: false });
        }
    },
}));

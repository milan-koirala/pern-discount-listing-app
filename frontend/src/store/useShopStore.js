import { create } from "zustand";
import axios from "axios";
import toast from "react-hot-toast";

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

export const useShopStore = create((set, get) => ({
    // State
    shops: [],
    loading: false,
    error: null,
    currentShop: null,

    // Form state
    formData: {
    shop_name: "",
    email: "",
    password: "",
    confirm_password: "",
    city: "",
    },

    setFormData: (newFormData) => set((state) => ({
    formData: { ...state.formData, ...newFormData }
    })),
    resetForm: () =>
    set({
        formData: {
        shop_name: "",
        email: "",
        password: "",
        confirm_password: "",
        city: "",
        },
    }),

    // Create a new shop
    addShop: async () => {
    set({ loading: true, error: null });
    try {
        const { formData } = get();
        await axios.post(`${BASE_URL}/api/shops/register`, {
        shop_name: formData.shop_name,
        email: formData.email,
        password: formData.password,
        city: formData.city,
        });
        set({ error: null });
        toast.success("Shop account registered successfully");
        set({ formData: { shop_name: "", email: "", password: "", confirm_password: "", city: "" } }); // Reset form
        return true; // Indicate success for navigation
    } catch (error) {
        console.error("Error in addShop", error);
        let message = "Failed to register shop";
        if (error.response) {
        if (error.response.status === 404) {
            message = "API endpoint not found. Please check the server configuration.";
        } else if (error.response.status === 400) {
            message = error.response.data.message || "Invalid input data";
        } else if (error.response.status === 409) {
            message = error.response.data.message || "Email already exists";
        } else {
            message = error.response.data?.message || message;
        }
        }
        set({ error: message });
        toast.error(message);
        throw new Error(message);
    } finally {
        set({ loading: false });
    }
    },

    // access to shop
    loginShop: async () => {
        set({ loading: true, error: null });
        try {
            const { formData } = get();
            const response = await axios.post(`${BASE_URL}/api/shops/login`, {
                email: formData.email,
                password: formData.password,
            });
            set({
                currentShop: response.data.data,
                error: null,
                formData: { ...formData, password: "", confirm_password: "" },
            });
            toast.success("Logged in successfully");
            return true; // Indicate success for navigation
        } catch (error) {
            console.error("Error in loginShop:", error);
            let message = "Failed to login";
            if (error.response) {
                if (error.response.status === 404) {
                    message = "API endpoint not found. Please check the server configuration.";
                } else if (error.response.status === 400) {
                    message = error.response.data.message || "Invalid input data";
                } else if (error.response.status === 401) {
                    message = error.response.data.message || "Invalid email or password";
                } else {
                    message = error.response.data?.message || message;
                }
            }
            set({ error: message });
            toast.error(message);
            throw new Error(message);
        } finally {
            set({ loading: false });
        }
    },

    // Fetch all shops
    fetchShops: async () => {
    set({ loading: true, error: null });
    try {
        const response = await axios.get(`${BASE_URL}/api/shops`);
        set({ shops: response.data.data, error: null });
    } catch (error) {
        console.error("Error fetching shops", error);
        const message = error.response?.data?.message || "Failed to fetch shops";
        set({ error: message, shops: [] });
    } finally {
        set({ loading: false });
    }
    },

    // Delete shop
    deleteShop: async (id) => {
    set({ loading: true, error: null });
    try {
        await axios.delete(`${BASE_URL}/api/shops/${id}`);
        set((prev) => ({
        shops: prev.shops.filter((shop) => shop.id !== id),
        }));
        toast.success("Shop deleted successfully");
    } catch (error) {
        console.error("Error deleting shop", error);
        const message = error.response?.data?.message || "Failed to delete shop";
        set({ error: message });
        toast.error(message);
    } finally {
        set({ loading: false });
    }
    },

    // Fetch single shop by ID
    fetchShop: async (id) => {
    set({ loading: true, error: null });
    try {
        const response = await axios.get(`${BASE_URL}/api/shops/${id}`);
        set({
        currentShop: response.data.data,
        formData: { ...response.data.data, password: "", confirm_password: "" }, // Don't store password
        error: null,
        });
    } catch (error) {
        console.error("Error fetching shop", error);
        const message = error.response?.data?.message || "Failed to fetch shop";
        set({ error: message, currentShop: null });
    } finally {
        set({ loading: false });
    }
    },

    // Update shop by ID
    updateShop: async (id) => {
    set({ loading: true, error: null });
    try {
        const { formData } = get();
        const response = await axios.put(`${BASE_URL}/api/shops/${id}`, {
        shop_name: formData.shop_name,
        email: formData.email,
        password: formData.password,
        city: formData.city,
        });
        set({ currentShop: response.data.data, error: null });
        toast.success("Shop updated successfully");
    } catch (error) {
        console.error("Error updating shop", error);
        const message = error.response?.data?.message || "Failed to update shop";
        set({ error: message });
        toast.error(message);
    } finally {
        set({ loading: false });
    }
    },
}));
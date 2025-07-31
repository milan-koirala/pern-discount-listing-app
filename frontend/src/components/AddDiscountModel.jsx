import { useDiscountStore } from "../store/useDiscountStore";
import { CalendarIcon, DollarSignIcon, Package2Icon, TagsIcon, StoreIcon } from "lucide-react";
import InputField from "./InputField";
import { useEffect } from "react";

function AddDiscountModal() {
    const { addDiscount, formData, setFormData, loading, shops, fetchShops } = useDiscountStore();

    useEffect(() => {
        fetchShops(); // Fetch shops when modal mounts
    }, [fetchShops]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === "discount_percentage" && (value < 0 || value > 100)) {
            alert("Discount percentage must be between 0 and 100");
            return;
        }
        setFormData({ [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const { shop_id, title, discount_percentage, category, start_date, end_date } = formData;
        if (!shop_id || !title || !discount_percentage || !category || !start_date || !end_date) {
            alert("All fields are required");
            return;
        }

        const startDate = new Date(start_date);
        const endDate = new Date(end_date);
        if (isNaN(startDate) || isNaN(endDate)) {
            alert("Please enter valid start and end dates");
            return;
        }
        if (startDate > endDate) {
            alert("End date must be after start date");
            return;
        }

        await addDiscount();
    };

    const closeModal = () => {
        const dialog = document.getElementById("add_discount_modal");
        if (dialog && dialog.close) dialog.close();
    };

    return (
        <dialog id="add_discount_modal" className="modal">
            <div className="modal-box">
                <button
                    type="button"
                    className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
                    onClick={closeModal}
                    disabled={loading}
                >
                    X
                </button>

                <h3 className="font-bold text-xl mb-6">Add New Discount</h3>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid gap-4">
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">Shop</span>
                            </label>
                            <div className="input-group">
                                <span className="input-group-addon">
                                    <StoreIcon className="w-5 h-5" />
                                </span>
                                <select
                                    name="shop_id"
                                    value={formData.shop_id}
                                    onChange={handleChange}
                                    className="select select-bordered w-full"
                                    disabled={loading}
                                >
                                    <option value="">Select a shop</option>
                                    {shops.map((shop) => (
                                        <option key={shop.id} value={shop.id}>
                                            {shop.shop_name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <InputField
                            label="Discount Title"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            placeholder="e.g., Summer Sale"
                            icon={Package2Icon}
                        />

                        <InputField
                            label="Discount Percentage"
                            name="discount_percentage"
                            type="number"
                            value={formData.discount_percentage}
                            onChange={handleChange}
                            placeholder="e.g., 20"
                            icon={DollarSignIcon}
                        />

                        <InputField
                            label="Category"
                            name="category"
                            value={formData.category}
                            onChange={handleChange}
                            placeholder="e.g., Clothing"
                            icon={TagsIcon}
                        />

                        <InputField
                            label="Start Date"
                            name="start_date"
                            type="date"
                            value={formData.start_date}
                            onChange={handleChange}
                            icon={CalendarIcon}
                        />

                        <InputField
                            label="End Date"
                            name="end_date"
                            type="date"
                            value={formData.end_date}
                            onChange={handleChange}
                            icon={CalendarIcon}
                        />
                    </div>

                    <div className="modal-action">
                        <button
                            type="button"
                            className="btn btn-ghost"
                            onClick={closeModal}
                            disabled={loading}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="btn btn-primary min-w-[120px]"
                            disabled={
                                !formData.shop_id ||
                                !formData.title ||
                                !formData.discount_percentage ||
                                !formData.category ||
                                !formData.start_date ||
                                !formData.end_date ||
                                loading
                            }
                        >
                            {loading ? (
                                <span className="loading loading-spinner loading-sm" />
                            ) : (
                                "Add Discount"
                            )}
                        </button>
                    </div>
                </form>
            </div>

            <div
                className="modal-backdrop"
                onClick={closeModal}
                style={{ cursor: "pointer" }}
            />
        </dialog>
    );
}

export default AddDiscountModal;
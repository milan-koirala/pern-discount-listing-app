import { useDiscountStore } from "../store/useDiscountStore";
import { CalendarIcon, DollarSignIcon, Package2Icon, TagsIcon } from "lucide-react";
import InputField from "./InputField";

function AddDiscountModal() {
    const { createDiscount, formData, setFormData, loading } = useDiscountStore();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const shopId = localStorage.getItem("shop_id");
        if (!shopId) return alert("Shop ID not found. Please login first.");
        await createDiscount(shopId);
    };

    return (
        <dialog id="add_discount_modal" className="modal">
        <div className="modal-box">
            {/* CLOSE BUTTON */}
            <form method="dialog">
            <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">X</button>
            </form>

            {/* MODAL HEADER */}
            <h3 className="font-bold text-xl mb-6">Add New Discount</h3>

            {/* FORM */}
            <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid gap-4">
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

            {/* ACTION BUTTONS */}
            <div className="modal-action">
                <form method="dialog">
                <button className="btn btn-ghost">Cancel</button>
                </form>
                <button
                type="submit"
                className="btn btn-primary min-w-[120px]"
                disabled={
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

        {/* BACKDROP */}
        <form method="dialog" className="modal-backdrop">
            <button>close</button>
        </form>
        </dialog>
    );
}

export default AddDiscountModal;

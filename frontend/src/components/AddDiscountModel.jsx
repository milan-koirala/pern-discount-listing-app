import { useDiscountStore } from "../store/useDiscountStore";
import { CalendarIcon, DollarSignIcon, Package2Icon, TagsIcon, StoreIcon } from "lucide-react";
import InputField from "./InputField";
import { useEffect } from "react";
import { useAuth } from "../context/AuthContext";

function AddDiscountModal() {
  const { addDiscount, formData, setFormData, loading, fetchDiscounts } = useDiscountStore();
  const { user } = useAuth();

  useEffect(() => {
    // Ensure shop_id is set from logged-in user
    if (user) {
      setFormData({ shop_id: user.id.toString() });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "discount_percentage" && (value < 0 || value > 100)) {
      alert("Discount percentage must be between 0 and 100");
      return;
    }
    setFormData({ [name]: value });
  };

  const closeModal = () => {
    const dialog = document.getElementById("add_discount_modal");
    if (dialog && dialog.close) dialog.close();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { title, discount_percentage, category, start_date, end_date, shop_id } = formData;
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

    try {
      const result = await addDiscount();
      if (result?.success) {
        // optionally refresh discounts if not already done inside store
        await fetchDiscounts();
        closeModal();
      }
    } catch (err) {
      // error toast already handled inside store
      console.error("Add discount failed:", err);
    }
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
            <InputField
              label="Shop"
              name="shop_name"
              value={user?.shop_name || ""}
              onChange={() => {}}
              placeholder="Your shop name"
              icon={StoreIcon}
              readOnly={true}
              disabled={true}
            />

            <InputField
              label="Discount Title"
              name="title"
              value={formData.title || ""}
              onChange={handleChange}
              placeholder="e.g., Summer Sale"
              icon={Package2Icon}
            />

            <InputField
              label="Discount Percentage"
              name="discount_percentage"
              type="number"
              value={formData.discount_percentage || ""}
              onChange={handleChange}
              placeholder="e.g., 20"
              icon={DollarSignIcon}
            />

            <InputField
              label="Category"
              name="category"
              value={formData.category || ""}
              onChange={handleChange}
              placeholder="e.g., Clothing"
              icon={TagsIcon}
            />

            <InputField
              label="Start Date"
              name="start_date"
              type="date"
              value={formData.start_date || ""}
              onChange={handleChange}
              icon={CalendarIcon}
            />

            <InputField
              label="End Date"
              name="end_date"
              type="date"
              value={formData.end_date || ""}
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

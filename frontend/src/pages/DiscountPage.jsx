import { useEffect, useState, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  SaveIcon,
  CalendarIcon,
  PercentIcon,
  TagIcon,
  TrashIcon,
  ArrowLeftIcon,
  BookOpenIcon,
} from "lucide-react";
import InputField from "../components/InputField";
import toast from "react-hot-toast";
import { useDiscountStore } from "../store/useDiscountStore";

function DiscountPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const {
    fetchDiscountsById,
    updateDiscount,
    deleteDiscount,
    loading: globalLoading,
    error,
  } = useDiscountStore();

  const [localData, setLocalData] = useState({
    title: "",
    category: "",
    discount_percentage: "",
    start_date: "",
    end_date: "",
  });

  const [initialData, setInitialData] = useState(null);

  // Local states to separate spinner behavior
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const data = await fetchDiscountsById(id);
      if (!data) {
        toast.error("Discount not found.");
        navigate("/?filter=my");
        return;
      }

      setLocalData(data);
      setInitialData(data);
    };

    if (id) fetchData();
  }, [id, fetchDiscountsById, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLocalData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const hasChanges = useMemo(() => {
    return (
      initialData &&
      (localData.title !== initialData.title ||
        localData.category !== initialData.category ||
        localData.discount_percentage !== initialData.discount_percentage ||
        localData.start_date !== initialData.start_date ||
        localData.end_date !== initialData.end_date)
    );
  }, [localData, initialData]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!hasChanges) return;

    try {
      setIsSubmitting(true);
      const result = await updateDiscount(id, localData);
      if (result?.success) {
        setTimeout(() => {
          navigate("/?filter=my");
        }, 300);
      }
    } catch (error) {
      toast.error("Failed to update discount.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this discount?")) {
      try {
        setIsDeleting(true);
        await deleteDiscount(id);
        navigate("/?filter=my");
      } catch (error) {
        toast.error("Failed to delete discount.");
      } finally {
        setIsDeleting(false);
      }
    }
  };

  // Full-page loading (initial fetch)
  if (globalLoading && !initialData) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="loading loading-spinner loading-lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="alert alert-error">{error}</div>
      </div>
    );
  }

  return (
    <div className="container max-w-4xl mx-auto px-4 py-8">
      <button
        onClick={() => navigate("/?filter=my")}
        className="btn btn-ghost mb-6 flex items-center gap-2"
      >
        <ArrowLeftIcon className="w-4 h-4" />
        Back to My Discounts
      </button>

      <div className="card bg-base-100 shadow-xl p-6">
        <div className="mb-6">
          <h2 className="text-xl font-bold flex items-center gap-2 mb-1">
            <BookOpenIcon className="w-6 h-6" />
            Edit Discount
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <InputField
              label="Title"
              name="title"
              value={localData.title}
              onChange={handleChange}
              icon={TagIcon}
              placeholder="Enter discount title"
            />
            <InputField
              label="Category"
              name="category"
              value={localData.category}
              onChange={handleChange}
              icon={TagIcon}
              placeholder="Enter category"
            />
            <InputField
              label="Start Date"
              name="start_date"
              type="date"
              value={localData.start_date}
              onChange={handleChange}
              icon={CalendarIcon}
            />
            <InputField
              label="End Date"
              name="end_date"
              type="date"
              value={localData.end_date}
              onChange={handleChange}
              icon={CalendarIcon}
            />
            <div className="sm:col-span-2">
              <InputField
                label="Discount Percentage"
                name="discount_percentage"
                type="number"
                value={localData.discount_percentage}
                onChange={handleChange}
                icon={PercentIcon}
                placeholder="Enter discount %"
              />
            </div>
          </div>

          {/* Save Changes */}
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 pt-4">
            {/* Delete Button */}
            <button
            type="button"
            className="btn btn-error w-full sm:w-auto sm:mb-0 mb-2"
            onClick={handleDelete}
            disabled={isDeleting}
          >
            {isDeleting ? (
              <span className="loading loading-spinner loading-sm" />
            ) : (
              <>
                <TrashIcon className="w-4 h-4 mr-2" />
                Delete
              </>
            )}
          </button>

          {/* Save Changes Button */}
          <button
              type="submit"
              className="btn btn-primary w-full sm:w-auto"
              disabled={isSubmitting || !hasChanges}
            >
              {isSubmitting ? (
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
      </div>
    </div>
  );
}

export default DiscountPage;

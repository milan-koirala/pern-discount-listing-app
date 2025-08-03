import { useEffect, useState } from "react";
import { useDiscountStore } from "../store/useDiscountStore";
import {
  RefreshCwIcon,
  UsersIcon,
  UserCheckIcon,
  PackageIcon,
} from "lucide-react";
import AddDiscountModal from "../components/AddDiscountModel";
import DiscountCard from "../components/DiscountCard";

function Homepage() {
  const {
    discounts,
    fetchDiscounts,
    fetchMyDiscounts,
    loading,
    error,
  } = useDiscountStore();

  const [filter, setFilter] = useState("all"); // Default to all

  // Fetch discounts on mount and when filter changes
  useEffect(() => {
    if (filter === "all") {
      fetchDiscounts();
    } else {
      fetchMyDiscounts();
    }
  }, [filter]);

  const handleRefresh = () => {
    if (filter === "all") {
      fetchDiscounts();
    } else {
      fetchMyDiscounts();
    }
  };

  return (
    <main className="max-w-7xl mx-auto px-4 py-8">
      {/* Header: Filter & Actions */}
      <div className="flex flex-wrap justify-between items-center mb-6 gap-4">
        {/* Filter dropdown */}
        <div className="relative w-full sm:w-48">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
            {filter === "all" ? <UsersIcon size={18} /> : <UserCheckIcon size={18} />}
          </span>
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="select select-bordered w-full pl-10"
          >
            <option value="all">All Discounts</option>
            <option value="my">My Discounts</option>
          </select>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <button
            className="btn btn-ghost btn-circle"
            onClick={handleRefresh}
            title="Refresh"
          >
            <RefreshCwIcon className="size-5" />
          </button>
          <AddDiscountModal />
        </div>
      </div>

      {/* Error alert */}
      {error && <div className="alert alert-error mb-8">{error}</div>}

      {/* No discounts */}
      {!loading && discounts.length === 0 && (
        <div className="flex flex-col justify-center items-center h-96 space-y-4">
          <div className="bg-base-100 rounded-full p-6">
            <PackageIcon className="size-12" />
          </div>
          <div className="text-center space-y-2">
            <h3 className="text-2xl font-semibold">No discounts found</h3>
            <p className="text-gray-500 max-w-sm">Try refreshing or adding new discounts.</p>
          </div>
        </div>
      )}

      {/* Discounts grid */}
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="loading loading-spinner loading-lg" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {discounts.map((discount) => (
            <DiscountCard key={discount.id} discount={discount} />
          ))}
        </div>
      )}
    </main>
  );
}

export default Homepage;

import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useDiscountStore } from "../store/useDiscountStore";
import {
  RefreshCwIcon,
  UsersIcon,
  UserCheckIcon,
  PackageIcon,
} from "lucide-react";
import DiscountCard from "../components/DiscountCard";

function Homepage() {
  const { discounts, fetchDiscounts, fetchMyDiscounts, loading, error } = useDiscountStore();

  const [searchParams, setSearchParams] = useSearchParams();

  // Get initial values from URL
  const initialSearch = searchParams.get("search") || "";
  const initialFilter = searchParams.get("filter") || "all";

  // React state
  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [filter, setFilter] = useState(initialFilter);

  // Sync search & filter state to URL with debounce
  useEffect(() => {
    const timeout = setTimeout(() => {
      const params = {};

      if (searchQuery) params.search = searchQuery;
      if (filter && filter !== "all") params.filter = filter;

      setSearchParams(params);
    }, 300);

    return () => clearTimeout(timeout);
  }, [searchQuery, filter]);

  // Fetch discounts whenever filter/search changes
  useEffect(() => {
    if (filter === "all") {
      fetchDiscounts({ search: searchQuery });
    } else {
      fetchMyDiscounts({ search: searchQuery });
    }
  }, [searchQuery, filter]);

  // Sync state with URL if user navigates with browser controls
  useEffect(() => {
    const urlSearch = searchParams.get("search") || "";
    const urlFilter = searchParams.get("filter") || "all";

    if (urlSearch !== searchQuery) setSearchQuery(urlSearch);
    if (urlFilter !== filter) setFilter(urlFilter);
  }, [searchParams]);

  const handleRefresh = () => {
    if (filter === "all") {
      fetchDiscounts({ search: searchQuery });
    } else {
      fetchMyDiscounts({ search: searchQuery });
    }
  };

  return (
    <main className="max-w-7xl mx-auto px-4 py-8">
      {/* Header: Filter, Search & Actions */}
      <div className="flex flex-wrap justify-between items-center mb-6 gap-4">
        {/* Filter dropdown */}
        <div className="relative w-full sm:w-40">
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

        {/* Search input */}
        <div className="relative w-full sm:w-[20rem]">
          <input
            type="text"
            placeholder="Search discounts or shop name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="input input-bordered w-full text-base"
          />
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

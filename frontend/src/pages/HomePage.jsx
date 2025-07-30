import { useEffect } from "react";
import { useDiscountStore } from "../store/useDiscountStore";
import { PlusCircleIcon, RefreshCwIcon } from "lucide-react";
import AddDiscountModal from "../components/AddDiscountModel";

function Homepage() {
  const { fetchDiscounts } = useDiscountStore();

  useEffect(() => {
    fetchDiscounts();
  }, [fetchDiscounts]);

  return (
    <main className="max-w-6xl mx-auto py-8">
      <div className="flex justify-between items-center mb-8">
        <button
          className="btn btn-primary"
          onClick={() =>
            document.getElementById("add_discount_modal")?.showModal()
          }
        >
          <PlusCircleIcon className="size-5 " />
          Add Discount
        </button>
        <button className="btn btn-ghost btn-circle" onClick={fetchDiscounts}>
          <RefreshCwIcon className="size-5" />
        </button>
      </div>

      <AddDiscountModal />
    </main>
  );
}

export default Homepage;

import PropTypes from "prop-types";
import {
  EditIcon,
  Trash2Icon,
  StoreIcon,
  CalendarIcon,
  ClockIcon,
  TagIcon,
} from "lucide-react";
import {
  format,
  parseISO,
  differenceInCalendarDays,
  isAfter,
  isBefore,
  isValid,
} from "date-fns";

function DiscountCard({ discount, onEdit, onDelete }) {
  let startDate = null;
  let endDate = null;

  try {
    if (discount.start_date) {
      const parsed = parseISO(discount.start_date);
      startDate = isValid(parsed) ? parsed : null;
    }
    if (discount.end_date) {
      const parsed = parseISO(discount.end_date);
      endDate = isValid(parsed) ? parsed : null;
    }
  } catch {
    // fail silently
  }

  const today = new Date();
  const isActive =
    startDate && endDate && !isBefore(today, startDate) && !isAfter(today, endDate);
  const isExpired = endDate && isAfter(today, endDate);
  const daysLeft = endDate ? differenceInCalendarDays(endDate, today) : null;

  return (
    <div className="card bg-base-100 shadow-md hover:shadow-xl transition-shadow duration-300 rounded-2xl overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-3 border-b border-base-content/10">
        <div className="flex items-center gap-3">
          <StoreIcon className="w-5 h-5 text-secondary" />
          <span className="badge badge-outline badge-lg flex items-center gap-1">
            {discount.shop_name || "Unknown Shop"}
          </span>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-lg font-bold text-primary flex items-center gap-1">
            🔖 {Number(discount.discount_percentage || 0).toFixed(0)}% OFF
          </div>
          <div>
            {isActive && (
              <span className="badge badge-success px-3 py-1 text-xs font-semibold">
                Active
              </span>
            )}
            {isExpired && (
              <span className="badge badge-error px-3 py-1 text-xs font-semibold">
                Expired
              </span>
            )}
            {!isActive && !isExpired && (
              <span className="badge badge-ghost px-3 py-1 text-xs font-semibold">
                Upcoming
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="card-body p-5">
        <h3 className="text-xl font-bold mb-3">{discount.title || "Untitled Discount"}</h3>

        <div className="flex flex-col gap-2 text-sm">
          {/* Category */}
          <div className="flex items-center gap-2">
            <TagIcon className="w-4 h-4" />
            <span className="font-medium">Category:</span>
            <span>{discount.category || "N/A"}</span>
          </div>

          {/* Validity Dates */}
          {startDate && endDate && (
            <div className="flex items-center gap-2">
              <CalendarIcon className="w-4 h-4" />
              <span className="font-medium">
                {format(startDate, "MMM d")} – {format(endDate, "MMM d")}
              </span>
            </div>
          )}

          {/* Status Clock */}
          {isActive && daysLeft !== null && (
            <div className="flex items-center gap-2">
              <ClockIcon className="w-4 h-4" />
              <span className="font-medium">
                Sale ends in {daysLeft} {daysLeft === 1 ? "day" : "days"}
              </span>
            </div>
          )}
          {isExpired && endDate && (
            <div className="flex items-center gap-2 text-error">
              <ClockIcon className="w-4 h-4" />
              <span className="font-medium">
                Expired on {format(endDate, "MMM d, yyyy")}
              </span>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="card-actions justify-end mt-5 gap-2">
          <button
            onClick={() => onEdit?.(discount)}
            className="btn btn-sm btn-outline btn-info flex items-center gap-1"
            aria-label="Edit discount"
          >
            <EditIcon className="w-4 h-4" />
            Edit
          </button>
          <button
            onClick={() => onDelete?.(discount.id)}
            className="btn btn-sm btn-outline btn-error flex items-center gap-1"
            aria-label="Delete discount"
          >
            <Trash2Icon className="w-4 h-4" />
            Delete
          </button>
        </div>
      </div>

      {/* Footer */}
      <div className="px-5 pb-3 text-xs">
        {isActive && <div className="text-success">🔥 Currently active</div>}
        {isExpired && <div className="text-error">⚠️ This discount has expired</div>}
        {!isActive && !isExpired && (
          <div className="text-muted">⏳ Upcoming discount</div>
        )}
      </div>
    </div>
  );
}

DiscountCard.propTypes = {
  discount: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    title: PropTypes.string.isRequired,
    discount_percentage: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
      .isRequired,
    category: PropTypes.string,
    shop_name: PropTypes.string,
    start_date: PropTypes.string,
    end_date: PropTypes.string,
  }).isRequired,
  onEdit: PropTypes.func,
  onDelete: PropTypes.func,
};

export default DiscountCard;

import PropTypes from "prop-types";

function InputField({
  label,
  type = "text",
  name,
  id,
  value = "",
  onChange,
  placeholder = "",
  error,
  icon: Icon,
  readOnly = false,
  disabled = false,
}) {
  const inputId = id || name;

  return (
    <div className="form-control w-full">
      <label htmlFor={inputId} className="label">
        <span className="label-text font-medium">{label}</span>
      </label>
      <div className="relative">
        {Icon && (
          <Icon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        )}
        <input
          id={inputId}
          name={name}
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className={`input input-bordered w-full rounded-lg ${
            Icon ? "pl-10" : ""
          } ${error ? "input-error" : ""} ${
            disabled ? "bg-gray-100 cursor-not-allowed" : ""
          }`}
          autoComplete="off"
          aria-invalid={!!error}
          aria-describedby={error ? `${inputId}-error` : undefined}
          readOnly={readOnly}
          disabled={disabled}
        />
      </div>
      {error && (
        <p id={`${inputId}-error`} className="mt-1 text-sm text-error">
          {error}
        </p>
      )}
    </div>
  );
}

InputField.propTypes = {
  label: PropTypes.string.isRequired,
  type: PropTypes.string,
  name: PropTypes.string.isRequired,
  id: PropTypes.string,
  value: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  placeholder: PropTypes.string,
  error: PropTypes.string,
  icon: PropTypes.elementType,
  readOnly: PropTypes.bool,
  disabled: PropTypes.bool,
};

export default InputField;

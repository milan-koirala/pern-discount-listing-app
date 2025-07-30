import PropTypes from 'prop-types';

function InputField({ label, type = "text", name, id, value, onChange, placeholder, error, icon: Icon }) {
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
                    className={`input input-bordered w-full rounded-lg ${Icon ? 'pl-10' : ''} ${error ? 'input-error' : ''}`}
                    aria-invalid={!!error}
                    aria-describedby={error ? `${inputId}-error` : undefined}
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
    value: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
    placeholder: PropTypes.string,
    error: PropTypes.string,
    icon: PropTypes.elementType,
};

export default InputField;

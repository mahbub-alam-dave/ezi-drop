export function SelectFieldDistrict({
  label,
  name,
  register,
  districts = [],
  required = false,
}) {
  return (
    <div className="flex flex-col gap-1">
      <label
        htmlFor={name}
        className="block mb-1"
      >
        {label}
      </label>

      <select
        id={name}
        {...register(name, { required })}
        className="w-full input-style text-color-soft"
        defaultValue=""
      >
        <option value="" disabled>
          Select {label}
        </option>

        {districts?.map((district) => (
          <option
            key={district.districtId}
            value={district.districtId} // 👈 returns districtId
            className="background-color"
          >
            {district.district} {/* 👈 shows district name */}
          </option>
        ))}
      </select>
    </div>
  );
}


export function SelectFieldUpazila({
  label,
  name,
  register,
  required = false,
  upazilas = [],
  disabled = false,
}) {
  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label
          htmlFor={name}
          className="block mb-1"
        >
          {label}
        </label>
      )}
      <select
        id={name}
        {...register(name, { required })}
        disabled={disabled}
        className={`border-color p-2 text-color-soft rounded outline-none transition ${
          disabled ? "background-color cursor-not-allowed" : "border-[var(--color-primary)]"
        }`}
        defaultValue=""
      >
        <option value="" disabled>
          {disabled ? "Select district first" : "Select Upazila"}
        </option>
        {upazilas.map((upazila) => (
          <option key={upazila} value={upazila} className="background-color" >
            {upazila}
          </option>
        ))}
      </select>
    </div>
  );
}
import React from "react";

type InputFieldProps = {
  required?: any;
  label?: string;
  name?: string;
  type?: string;
  placeholder?: string;
  icon?: string;
  value?: any;
  inputMode?: any;
  maxLength?: number;
  pattern?: string;
  isError?: boolean;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

export const InputField: React.FC<InputFieldProps> = ({
  required,
  label,
  type,
  name,
  icon,
  placeholder,
  value,
  inputMode,
  maxLength,
  pattern,
  isError = false,
  onChange,
}) => (
  <div className="flex flex-col justify-start gap-y-2">
    <label htmlFor={name} className="font-semibold text-lg">
      {label}
    </label>
    <div className="relative w-full h-[52px]">
      <input
        required={required}
        type={type}
        name={name}
        id={name}
        placeholder={placeholder}
        onChange={onChange}
        value={value}
        inputMode={inputMode}
        maxLength={maxLength}
        pattern={pattern}
        className={`w-full h-full px-12 rounded-3xl placeholder:text-[16px] focus:outline-none focus:ring-2 focus:ring-[#FD915A] ${
          isError ? "ring-2 ring-red-500" : "ring-1 ring-slate-300"
        }`}
      />
      <img src={icon} alt="" className="absolute top-[18px] left-[18px]" />
    </div>
  </div>
);

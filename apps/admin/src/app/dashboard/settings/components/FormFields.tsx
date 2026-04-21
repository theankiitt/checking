import React from "react";

interface InputFieldProps {
  label: string;
  value: string | number;
  onChange: (value: string) => void;
  type?: string;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
}

export function InputField({
  label,
  value,
  onChange,
  type = "text",
  placeholder,
  disabled,
  className = "",
}: InputFieldProps) {
  return (
    <div className={className}>
      <label className="block text-sm font-medium custom-font text-gray-700 mb-2">
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black disabled:bg-gray-100 disabled:cursor-not-allowed"
      />
    </div>
  );
}

interface TextAreaFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  rows?: number;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
}

export function TextAreaField({
  label,
  value,
  onChange,
  rows = 4,
  placeholder,
  disabled,
  className = "",
}: TextAreaFieldProps) {
  return (
    <div className={className}>
      <label className="block text-sm font-medium custom-font text-gray-700 mb-2">
        {label}
      </label>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={rows}
        placeholder={placeholder}
        disabled={disabled}
        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
      />
    </div>
  );
}

interface SelectFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: string[];
  disabled?: boolean;
  className?: string;
}

export function SelectField({
  label,
  value,
  onChange,
  options,
  disabled,
  className = "",
}: SelectFieldProps) {
  return (
    <div className={className}>
      <label className="block text-sm font-medium custom-font text-gray-700 mb-2">
        {label}
      </label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  );
}

interface CheckboxFieldProps {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
  description?: string;
}

export function CheckboxField({
  label,
  checked,
  onChange,
  disabled,
  description,
}: CheckboxFieldProps) {
  return (
    <div className="flex items-start">
      <div className="flex items-center h-5">
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          disabled={disabled}
          className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 disabled:cursor-not-allowed"
        />
      </div>
      <div className="ml-3 text-sm">
        <label className="font-medium text-gray-700 custom-font">{label}</label>
        {description && <p className="text-gray-500">{description}</p>}
      </div>
    </div>
  );
}

interface UrlInputProps {
  value: string;
  onChange: (val: string) => void;
}

export function UrlInput({ value, onChange }: UrlInputProps) {
  return (
    <div>
      <label className="block text-sm font-medium text-black mb-1">
        URL Path
      </label>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
        placeholder="/products/example"
      />
    </div>
  );
}

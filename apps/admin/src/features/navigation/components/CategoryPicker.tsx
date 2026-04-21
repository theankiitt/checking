import { Category } from "../types";

interface CategoryPickerProps {
  value: string;
  onChange: (catId: string, label: string) => void;
  categories: Category[];
}

export function CategoryPicker({
  value,
  onChange,
  categories,
}: CategoryPickerProps) {
  return (
    <div>
      <label className="block text-sm font-medium text-black mb-1">
        Select Category
      </label>
      <select
        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
        value={value}
        onChange={(e) => {
          const idx = e.target.selectedIndex;
          const label = e.target.options[idx].text;
          onChange(e.target.value, label);
        }}
      >
        <option value="">-- Choose a category --</option>
        {categories.map((c) => (
          <option key={c.id} value={c.id}>
            {c.name}
          </option>
        ))}
      </select>
    </div>
  );
}

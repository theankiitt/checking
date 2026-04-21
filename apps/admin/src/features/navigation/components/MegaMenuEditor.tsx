import { useState } from "react";
import { ArrowLeft, Plus, Trash2, Layout, X } from "lucide-react";
import toast from "react-hot-toast";
import { NavColumn, NavGroup, NavLink, Category, LinkSource } from "../types";
import { CategoryPicker } from "./CategoryPicker";
import { UrlInput } from "./UrlInput";

interface MegaMenuEditorProps {
  columns: NavColumn[];
  onChange: (cols: NavColumn[]) => void;
  categories: Category[];
}

export function MegaMenuEditor({
  columns,
  onChange,
  categories,
}: MegaMenuEditorProps) {
  const [activeColumnIndex, setActiveColumnIndex] = useState<number | null>(
    null,
  );

  const addColumn = () => {
    onChange([...columns, { title: "New Column", items: [] }]);
  };

  const updateColumn = (index: number, newCol: NavColumn) => {
    const newCols = [...columns];
    newCols[index] = newCol;
    onChange(newCols);
  };

  const removeColumn = (index: number) => {
    const newCols = [...columns];
    newCols.splice(index, 1);
    onChange(newCols);
  };

  if (activeColumnIndex !== null && columns[activeColumnIndex]) {
    return (
      <ColumnEditor
        column={columns[activeColumnIndex]}
        onChange={(newCol) => updateColumn(activeColumnIndex, newCol)}
        onBack={() => setActiveColumnIndex(null)}
        categories={categories}
      />
    );
  }

  return (
    <div className="space-y-3 mt-4 border-t pt-4">
      <h3 className="font-bold text-black flex items-center gap-2">
        <Layout className="w-4 h-4" />
        Step 2: Mega Menu Columns
      </h3>
      <p className="text-sm text-black mb-2">
        Define the columns that appear in the dropdown.
      </p>

      <div className="space-y-2">
        {columns.map((col, idx) => (
          <div
            key={idx}
            className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200"
          >
            <span className="font-medium text-black">
              {col.title || "(Untitled Column)"}
            </span>
            <div className="flex gap-2">
              <button
                onClick={() => setActiveColumnIndex(idx)}
                className="text-blue-600 hover:text-blue-800 text-sm font-medium px-2 py-1"
              >
                Edit Content
              </button>
              <button
                onClick={() => removeColumn(idx)}
                className="text-red-500 hover:text-red-700 p-1"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={addColumn}
        className="w-full py-2 border border-dashed border-blue-300 text-blue-600 rounded-lg hover:bg-blue-50 flex items-center justify-center text-sm font-medium"
      >
        <Plus className="w-4 h-4 mr-2" />
        Add Column
      </button>
    </div>
  );
}

interface ColumnEditorProps {
  column: NavColumn;
  onChange: (col: NavColumn) => void;
  onBack: () => void;
  categories: Category[];
}

function ColumnEditor({
  column,
  onChange,
  onBack,
  categories,
}: ColumnEditorProps) {
  const hasGroups = !!column.groups && column.groups.length > 0;
  const hasItems = !!column.items && column.items.length > 0;
  const mode = hasGroups ? "groups" : "items";

  const [viewMode, setViewMode] = useState<"groups" | "items">(mode);
  const [editingGroupIndex, setEditingGroupIndex] = useState<number | null>(
    null,
  );

  const toggleMode = (m: "groups" | "items") => {
    if (m === viewMode) return;
    if ((m === "groups" && hasItems) || (m === "items" && hasGroups)) {
      return;
    }
    setViewMode(m);
    if (m === "groups") onChange({ ...column, items: undefined, groups: [] });
    else onChange({ ...column, groups: undefined, items: [] });
  };

  const updateTitle = (t: string) => onChange({ ...column, title: t });

  const addGroup = () => {
    const newGroups = [...(column.groups || [])];
    newGroups.push({ title: "New Group", items: [] });
    onChange({ ...column, groups: newGroups });
  };

  const updateGroup = (idx: number, grp: NavGroup) => {
    const newGroups = [...(column.groups || [])];
    newGroups[idx] = grp;
    onChange({ ...column, groups: newGroups });
  };

  const removeGroup = (idx: number) => {
    const newGroups = [...(column.groups || [])];
    newGroups.splice(idx, 1);
    onChange({ ...column, groups: newGroups });
  };

  if (editingGroupIndex !== null && column.groups?.[editingGroupIndex]) {
    return (
      <GroupEditor
        group={column.groups[editingGroupIndex]}
        onChange={(g) => updateGroup(editingGroupIndex, g)}
        onBack={() => setEditingGroupIndex(null)}
        categories={categories}
      />
    );
  }

  return (
    <div className="space-y-4">
      <button
        onClick={onBack}
        className="flex items-center text-sm text-black hover:text-gray-900 mb-2"
      >
        <ArrowLeft className="w-4 h-4 mr-1" /> Back to Columns
      </button>

      <div>
        <label className="block text-sm font-medium text-black mb-1">
          Column Title
        </label>
        <input
          type="text"
          value={column.title}
          onChange={(e) => updateTitle(e.target.value)}
          className="w-full border p-2 rounded-lg"
          placeholder="e.g., Achar, Tea"
        />
      </div>

      <div className="flex gap-4 border-b border-gray-200">
        <button
          onClick={() => toggleMode("items")}
          className={`pb-2 text-sm font-medium px-2 ${
            viewMode === "items"
              ? "text-blue-600 border-b-2 border-blue-600"
              : "text-black"
          }`}
        >
          Direct Links
        </button>
        <button
          onClick={() => toggleMode("groups")}
          className={`pb-2 text-sm font-medium px-2 ${
            viewMode === "groups"
              ? "text-blue-600 border-b-2 border-blue-600"
              : "text-black"
          }`}
        >
          Grouped Links
        </button>
      </div>

      {viewMode === "groups" ? (
        <div className="space-y-3">
          {column.groups?.map((grp, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
            >
              <span className="font-medium text-sm text-black">
                {grp.title}
              </span>
              <div className="flex gap-2">
                <button
                  onClick={() => setEditingGroupIndex(idx)}
                  className="text-blue-600 text-xs font-bold px-2 py-1"
                >
                  Edit
                </button>
                <button
                  onClick={() => removeGroup(idx)}
                  className="text-red-500"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
          <button
            onClick={addGroup}
            className="w-full py-2 bg-blue-50 text-blue-600 rounded-lg text-sm font-medium text-center"
          >
            + Add Group
          </button>
        </div>
      ) : (
        <ItemsList
          items={column.items || []}
          onChange={(items) => onChange({ ...column, items })}
          categories={categories}
        />
      )}
    </div>
  );
}

interface GroupEditorProps {
  group: NavGroup;
  onChange: (g: NavGroup) => void;
  onBack: () => void;
  categories: Category[];
}

function GroupEditor({
  group,
  onChange,
  onBack,
  categories,
}: GroupEditorProps) {
  return (
    <div className="space-y-4">
      <button
        onClick={onBack}
        className="flex items-center text-sm text-black hover:text-gray-900 mb-2"
      >
        <ArrowLeft className="w-4 h-4 mr-1" /> Back to Column
      </button>

      <div>
        <label className="block text-sm font-medium text-black mb-1">
          Group Title
        </label>
        <input
          type="text"
          value={group.title}
          onChange={(e) => onChange({ ...group, title: e.target.value })}
          className="w-full border p-2 rounded-lg"
          placeholder="e.g., Veg, Non-Veg"
        />
      </div>

      <div className="border-t pt-4">
        <h4 className="text-xs font-bold text-black uppercase tracking-wider mb-3">
          Links in this Group
        </h4>
        <ItemsList
          items={group.items}
          onChange={(items) => onChange({ ...group, items })}
          categories={categories}
        />
      </div>
    </div>
  );
}

interface ItemsListProps {
  items: NavLink[];
  onChange: (items: NavLink[]) => void;
  categories: Category[];
}

function ItemsList({ items, onChange, categories }: ItemsListProps) {
  const [adding, setAdding] = useState(false);
  const [newItem, setNewItem] = useState({
    label: "",
    href: "",
    source: "category" as LinkSource,
    catId: "",
  });

  const handleAdd = () => {
    let href = newItem.href;
    let label = newItem.label;

    if (newItem.source === "category") {
      const cat = categories.find((c) => c.id === newItem.catId);
      if (cat) {
        href = `/products/${cat.name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`;
        if (!label) label = cat.name;
      }
    }

    if (!label) {
      toast.error("Label required");
      return;
    }

    onChange([...items, { label, href }]);
    setAdding(false);
    setNewItem({ label: "", href: "", source: "category", catId: "" });
  };

  const remove = (idx: number) => {
    const n = [...items];
    n.splice(idx, 1);
    onChange(n);
  };

  return (
    <div className="space-y-2">
      {items.map((item, idx) => (
        <div
          key={idx}
          className="flex justify-between items-center bg-white border p-2 rounded text-sm"
        >
          <div>
            <div className="font-medium text-black">{item.label}</div>
            <div className="text-black text-xs">{item.href}</div>
          </div>
          <button onClick={() => remove(idx)} className="text-red-500">
            <X className="w-4 h-4" />
          </button>
        </div>
      ))}

      {adding ? (
        <div className="bg-gray-50 p-3 rounded-lg space-y-3 border border-blue-200">
          <div className="flex gap-2 text-xs">
            <button
              onClick={() => setNewItem({ ...newItem, source: "category" })}
              className={`px-2 py-1 rounded ${
                newItem.source === "category" ? "bg-white shadow" : ""
              }`}
            >
              Category
            </button>
            <button
              onClick={() => setNewItem({ ...newItem, source: "custom" })}
              className={`px-2 py-1 rounded ${
                newItem.source === "custom" ? "bg-white shadow" : ""
              }`}
            >
              Custom
            </button>
          </div>

          {newItem.source === "category" ? (
            <CategoryPicker
              value={newItem.catId}
              onChange={(id, label) =>
                setNewItem({
                  ...newItem,
                  catId: id,
                  label: newItem.label || label,
                })
              }
              categories={categories}
            />
          ) : (
            <UrlInput
              value={newItem.href}
              onChange={(v) => setNewItem({ ...newItem, href: v })}
            />
          )}

          <div>
            <input
              placeholder="Label"
              className="w-full border p-2 rounded text-sm"
              value={newItem.label}
              onChange={(e) =>
                setNewItem({ ...newItem, label: e.target.value })
              }
            />
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleAdd}
              className="bg-blue-600 text-white px-3 py-1 rounded text-sm"
            >
              Add
            </button>
            <button
              onClick={() => setAdding(false)}
              className="text-black px-3 py-1 text-sm"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setAdding(true)}
          className="text-sm text-blue-600 hover:underline flex items-center"
        >
          <Plus className="w-3 h-3 mr-1" /> Add Link
        </button>
      )}
    </div>
  );
}

import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface CartItem {
  id: string;
  name: string;
  slug: string;
  price: number;
  comparePrice?: number;
  image?: string;
  quantity: number;
  categoryId?: string;
  subCategoryId?: string;
}

interface CartState {
  items: CartItem[];
  isOpen: boolean;
}

const loadCartFromStorage = (): CartItem[] => {
  if (typeof window === "undefined") return [];
  try {
    const stored = localStorage.getItem("cart");
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
};

const saveCartToStorage = (items: CartItem[]) => {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem("cart", JSON.stringify(items));
  } catch {
    // ignore
  }
};

const initialState: CartState = {
  items: loadCartFromStorage(),
  isOpen: false,
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addItem: (state, action: PayloadAction<Omit<CartItem, "quantity"> & { quantity?: number }>) => {
      const { id, quantity = 1, ...rest } = action.payload;
      const existing = state.items.find((item) => item.id === id);

      if (existing) {
        existing.quantity += quantity;
      } else {
        state.items.push({ ...rest, id, quantity });
      }

      saveCartToStorage(state.items);
    },

    removeItem: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter((item) => item.id !== action.payload);
      saveCartToStorage(state.items);
    },

    updateQuantity: (state, action: PayloadAction<{ id: string; quantity: number }>) => {
      const { id, quantity } = action.payload;
      const item = state.items.find((item) => item.id === id);

      if (item) {
        if (quantity <= 0) {
          state.items = state.items.filter((i) => i.id !== id);
        } else {
          item.quantity = quantity;
        }
      }

      saveCartToStorage(state.items);
    },

    clearCart: (state) => {
      state.items = [];
      saveCartToStorage([]);
    },

    toggleCart: (state) => {
      state.isOpen = !state.isOpen;
    },

    closeCart: (state) => {
      state.isOpen = false;
    },
  },
});

export const { addItem, removeItem, updateQuantity, clearCart, toggleCart, closeCart } = cartSlice.actions;
export default cartSlice.reducer;

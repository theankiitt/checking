"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  deliveryDate?: string;
}

interface CartContextType {
  cartItems: CartItem[];
  cartItemCount: number;
  cartTotal: number;
  isLoaded: boolean;
  addToCart: (item: Omit<CartItem, "quantity">, quantity?: number) => void;
  removeFromCart: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const getCookie = (name: string): string | null => {
  if (typeof document === "undefined") return null;
  const nameLenEqual = name.length + 1;
  return document.cookie
    .split(";")
    .map((c) => c.trim())
    .filter((cookie) => cookie.substring(0, nameLenEqual) === `${name}=`)
    .map((cookie) => decodeURIComponent(cookie.substring(nameLenEqual)))[0] || null;
};

const setCookie = (name: string, value: string, days: number = 30): void => {
  if (typeof document === "undefined") return;
  const date = new Date();
  date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
  const expires = `expires=${date.toUTCString()}`;
  document.cookie = `${name}=${encodeURIComponent(value)};${expires};path=/`;
};

const deleteCookie = (name: string): void => {
  if (typeof document === "undefined") return;
  document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;`;
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};

interface CartProviderProps {
  children: ReactNode;
}

export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  const getCartKey = (): string => {
    return "cart";
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      const cartKey = getCartKey();
      const savedCart = getCookie(cartKey);
      
      if (savedCart) {
        try {
          setCartItems(JSON.parse(savedCart));
        } catch (e) {
        }
      }
      setIsLoaded(true);
    }
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined" && isLoaded) {
      const cartKey = getCartKey();
      setCookie(cartKey, JSON.stringify(cartItems), 30);
    }
  }, [cartItems, isLoaded]);

  const cartItemCount = cartItems.reduce(
    (total, item) => total + item.quantity,
    0,
  );
  const cartTotal = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0,
  );

  const addToCart = (
    item: Omit<CartItem, "quantity">,
    quantity: number = 1,
  ) => {
    const deliveryDate = new Date();
    deliveryDate.setDate(deliveryDate.getDate() + 7);
    const deliveryDateStr = deliveryDate.toISOString();

    setCartItems((prevItems) => {
      const existingItem = prevItems.find(
        (cartItem) => cartItem.id === item.id,
      );

      if (existingItem) {
        return prevItems.map((cartItem) =>
          cartItem.id === item.id
            ? { ...cartItem, quantity: cartItem.quantity + quantity }
            : cartItem,
        );
      } else {
        return [...prevItems, { ...item, quantity, deliveryDate: deliveryDateStr }];
      }
    });
  };

  const removeFromCart = (itemId: string) => {
    setCartItems((prevItems) => prevItems.filter((item) => item.id !== itemId));
  };

  const updateQuantity = (itemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(itemId);
      return;
    }

    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.id === itemId ? { ...item, quantity } : item,
      ),
    );
  };

  const clearCart = () => {
    setCartItems([]);
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        cartItemCount,
        cartTotal,
        isLoaded,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

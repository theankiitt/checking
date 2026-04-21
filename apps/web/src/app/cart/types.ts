export interface CartItemType {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  variant?: string;
  deliveryDate?: string;
}

export interface CartItemProps {
  item: CartItemType;
  onUpdateQuantity: (id: string, quantity: number) => void;
  onRemove: (id: string) => void;
}

export interface OrderSummaryProps {
  subtotal: number;
  total: number;
  discount: number;
  itemCount: number;
  promoCode?: string;
  onApplyPromo?: (code: string) => void;
  onRemovePromo?: () => void;
}

export interface CartCalculations {
  subtotal: number;
  discount: number;
  total: number;
}

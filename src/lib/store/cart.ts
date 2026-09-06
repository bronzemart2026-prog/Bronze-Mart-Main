import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { CartItem, Product } from '@/lib/types';

interface CartState {
  items: CartItem[];
  isOpen: boolean;
  addItem: (product: Product, quantity?: number, variant?: string) => void;
  removeItem: (productId: string, variant?: string) => void;
  updateQuantity: (productId: string, quantity: number, variant?: string) => void;
  clearCart: () => void;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
  getTotalItems: () => number;
  getSubtotal: () => number;
  getShippingFee: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,

      addItem: (product: Product, quantity = 1, variant) => {
        set((state) => {
          const existingIndex = state.items.findIndex(
            (item) =>
              item.product.id === product.id &&
              item.selectedVariant === variant
          );

          if (existingIndex > -1) {
            const updatedItems = [...state.items];
            updatedItems[existingIndex].quantity += quantity;
            return { items: updatedItems, isOpen: true };
          }

          const newItem: CartItem = {
            id: `${product.id}-${variant || 'default'}`,
            product,
            quantity,
            selectedVariant: variant,
          };

          return { items: [...state.items, newItem], isOpen: true };
        });
      },

      removeItem: (productId: string, variant) => {
        set((state) => ({
          items: state.items.filter(
            (item) =>
              !(item.product.id === productId && item.selectedVariant === variant)
          ),
        }));
      },

      updateQuantity: (productId: string, quantity: number, variant) => {
        if (quantity <= 0) {
          get().removeItem(productId, variant);
          return;
        }

        set((state) => ({
          items: state.items.map((item) => {
            if (item.product.id === productId && item.selectedVariant === variant) {
              return { ...item, quantity };
            }
            return item;
          }),
        }));
      },

      clearCart: () => set({ items: [] }),
      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),
      toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),

      getTotalItems: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0);
      },

      getSubtotal: () => {
        return get().items.reduce(
          (total, item) => total + item.product.price * item.quantity,
          0
        );
      },

      getShippingFee: () => {
        const subtotal = get().getSubtotal();
        if (subtotal === 0) return 0;
        return subtotal >= 150 ? 0 : 15; // Free shipping over $150
      },
    }),
    {
      name: 'bronze-mart-cart-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ items: state.items }),
    }
  )
);

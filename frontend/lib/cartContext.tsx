'use client';
import { createContext, useContext } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from './api';

type CartItem = {
  productId: number;
  quantity:  number;
  name:      string;
  price:     number;
  total:     number;
};

type CartContextType = {
  cart:           CartItem[];
  totalItems:     number;
  totalPrice:     number;
  isLoading:      boolean;
  addToCart:      (productId: number, name: string, quantity?: number) => void;
  removeFromCart: (productId: number) => void;
  clearCart:      () => void;
};

const CartContext = createContext<CartContextType | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const queryClient = useQueryClient();

  const { data: cart = [], isLoading } = useQuery<CartItem[]>({
    queryKey: ['cart'],
    queryFn:  () => api.get('/api/cart').then(r => r.data),
  });

  const totalItems = cart.reduce((sum, i) => sum + i.quantity, 0);
  const totalPrice = cart.reduce((sum, i) => sum + i.total, 0);

  const addMutation = useMutation({
    mutationFn: ({ productId, quantity }: { productId: number; quantity: number }) =>
      api.post('/api/cart', { productId, quantity }),
    onSuccess: (_, { productId }) => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
      const found = cart.find(i => i.productId === productId);
      const name  = found?.name ?? 'Sản phẩm';
      // import toast trực tiếp ở đây để tránh circular import
      import('react-hot-toast').then(({ default: toast }) => {
        toast.success(`Đã thêm "${name}" vào giỏ 🛒`);
      });
    },
  });

  const removeMutation = useMutation({
    mutationFn: (productId: number) => api.delete(`/api/cart/${productId}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
      import('react-hot-toast').then(({ default: toast }) => {
        toast.success('Đã xoá khỏi giỏ hàng 🗑️');
      });
    },
  });

  const clearMutation = useMutation({
    mutationFn: () => api.delete('/api/cart'),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
      import('react-hot-toast').then(({ default: toast }) => {
        toast.success('Đã xoá toàn bộ giỏ hàng 🧹');
      });
    },
  });

  return (
    <CartContext.Provider value={{
      cart,
      totalItems,
      totalPrice,
      isLoading,
      addToCart:      (productId, name, quantity = 1) =>
        addMutation.mutate({ productId, quantity }),
      removeFromCart: (productId) => removeMutation.mutate(productId),
      clearCart:      () => clearMutation.mutate(),
    }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart phải dùng trong CartProvider');
  return ctx;
}
'use client';
import Link from 'next/link';
import { useCart } from '@/lib/cartContext';

export default function CartPage() {
  const { cart, totalItems, totalPrice, isLoading, removeFromCart, clearCart } = useCart();

  if (isLoading) {
    return <p className="text-center py-12 text-gray-400">Đang tải giỏ hàng...</p>;
  }

  if (cart.length === 0) {
    return (
      <div className="text-center py-16">
        <p className="text-5xl mb-4">🛒</p>
        <p className="text-gray-500 mb-6">Giỏ hàng đang trống</p>
        <Link
          href="/products"
          className="inline-block bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600"
        >
          Mua sắm ngay →
        </Link>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">
          🛒 Giỏ hàng
          <span className="text-gray-400 text-base font-normal ml-2">
            ({totalItems} sản phẩm)
          </span>
        </h1>
        <button
          onClick={clearCart}
          className="text-red-500 hover:text-red-700 text-sm font-medium border border-red-200 px-3 py-1 rounded hover:bg-red-50"
        >
          🧹 Xoá tất cả
        </button>
      </div>

      {/* Danh sách item */}
      <div className="space-y-3 mb-6">
        {cart.map(item => (
          <div
            key={item.productId}
            className="flex justify-between items-center p-4 border rounded-lg bg-white shadow-sm text-black"
          >
            <div>
              <p className="font-medium">{item.name}</p>
              <p className="text-sm text-gray-500 mt-1">
                {item.price.toLocaleString()}đ × {item.quantity} =&nbsp;
                <span className="text-blue-600 font-bold">
                  {item.total.toLocaleString()}đ
                </span>
              </p>
            </div>
            <button
              onClick={() => removeFromCart(item.productId)}
              className="text-red-400 hover:text-red-600 text-2xl ml-4 leading-none"
              title="Xoá khỏi giỏ"
            >
              ×
            </button>
          </div>
        ))}
      </div>

      {/* Tổng tiền + Thanh toán */}
      <div className="border-t pt-4">
        <div className="flex justify-between items-center text-lg font-bold mb-4">
          <span>Tổng thanh toán</span>
          <span className="text-blue-600">{totalPrice.toLocaleString()}đ</span>
        </div>
        <button
          onClick={() => alert('Tính năng thanh toán sẽ làm ở buổi sau!')}
          className="w-full bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 font-medium text-lg"
        >
          Thanh toán →
        </button>
        <Link
          href="/products"
          className="block text-center text-gray-400 hover:text-gray-600 text-sm mt-3"
        >
          ← Tiếp tục mua sắm
        </Link>
      </div>
    </div>
  );
}
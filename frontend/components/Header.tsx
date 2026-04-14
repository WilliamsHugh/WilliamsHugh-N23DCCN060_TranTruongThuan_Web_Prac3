'use client';
import Link from 'next/link';
import { useCart } from '@/lib/cartContext';

export default function Header() {
  const { totalItems, totalPrice } = useCart();

  return (
    <header className="bg-white border-b shadow-sm sticky top-0 z-50">
      <div className="max-w-2xl mx-auto px-6 py-3 flex justify-between items-center">

        <Link href="/" className="text-xl font-bold text-blue-600">
          🛍️ Fullstack Shop
        </Link>

        <nav className="flex items-center gap-6">
          <Link
            href="/products"
            className="text-gray-600 hover:text-blue-600 text-sm font-medium"
          >
            Sản phẩm
          </Link>

          <Link href="/cart" className="relative flex items-center gap-1 text-sm font-medium text-gray-600 hover:text-blue-600">
            🛒 Giỏ hàng
            {totalItems > 0 && (
              <span className="absolute -top-2 -right-3 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                {totalItems > 99 ? '99+' : totalItems}
              </span>
            )}
          </Link>
        </nav>

        {totalPrice > 0 && (
          <span className="text-sm text-gray-500 hidden sm:block">
            Tổng: <strong className="text-blue-600">{totalPrice.toLocaleString()}đ</strong>
          </span>
        )}

      </div>
    </header>
  );
}
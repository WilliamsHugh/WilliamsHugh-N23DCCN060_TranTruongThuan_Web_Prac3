'use client';
import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import api from '@/lib/api';

type Product = { id: number; name: string; price: number };

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [name, setName]   = useState('');
  const [price, setPrice] = useState('');

  const fetchProducts = async () => {
    try {
      const res = await api.get('/api/products');
      setProducts(res.data);
    } catch {
      toast.error('Không thể kết nối server!');
    }
  };

  useEffect(() => { fetchProducts(); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !price) {
      toast.error('Vui lòng điền đầy đủ thông tin!');
      return;
    }
    await toast.promise(
      api.post('/api/products', { name, price: Number(price) }),
      {
        loading: 'Đang lưu...',
        success: 'Thêm sản phẩm thành công!',
        error:   'Có lỗi xảy ra!',
      }
    );
    setName('');
    setPrice('');
    fetchProducts();
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Bạn chắc chắn muốn xoá?')) return;
    try {
      await api.delete(`/api/products/${id}`);
      setProducts(prev => prev.filter(p => p.id !== id));  // optimistic
      toast.success('Đã xoá sản phẩm');
    } catch {
      toast.error('Xoá thất bại, thử lại!');
      fetchProducts();  // rollback
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Quản lý sản phẩm</h1>

      <form onSubmit={handleSubmit} className="flex gap-2 mb-6">
        <input
          value={name}
          onChange={e => setName(e.target.value)}
          placeholder="Tên sản phẩm"
          className="border rounded px-3 py-2 flex-1"
        />
        <input
          value={price}
          onChange={e => setPrice(e.target.value)}
          placeholder="Giá"
          type="number"
          className="border rounded px-3 py-2 w-32"
        />
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Thêm
        </button>
      </form>

      <div>
        {products.map(p => (
          <div
            key={p.id}
            className="flex justify-between items-center p-3 border rounded mb-2"
          >
            <span>{p.name} — {p.price.toLocaleString()}đ</span>
            <button
              onClick={() => handleDelete(p.id)}
              className="text-red-500 hover:text-red-700 text-sm font-medium"
            >
              Xoá
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
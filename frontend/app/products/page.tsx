'use client';
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import api from '@/lib/api';
import { useCart } from '@/lib/cartContext';
import { productToast } from '@/lib/toast';

type Product = { id: number; name: string; price: number };

export default function ProductsPage() {
  const queryClient   = useQueryClient();
  const { addToCart } = useCart();

  const [name, setName]   = useState('');
  const [price, setPrice] = useState('');

  const [editingId, setEditingId] = useState<number | null>(null);
  const [editName, setEditName]   = useState('');
  const [editPrice, setEditPrice] = useState('');

  // ── FETCH ────────────────────────────────────────────────────
  const { data: products = [], isLoading } = useQuery<Product[]>({
    queryKey: ['products'],
    queryFn:  () => api.get('/api/products').then(r => r.data),
  });

  // ── THÊM ─────────────────────────────────────────────────────
  const addMutation = useMutation({
    mutationFn: (data: { name: string; price: number }) =>
      api.post('/api/products', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      productToast.addSuccess();
      setName('');
      setPrice('');
    },
    onError: productToast.addError,
  });

  // ── SỬA ──────────────────────────────────────────────────────
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<Product> }) =>
      api.put(`/api/products/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      productToast.updateSuccess();
      setEditingId(null);
    },
    onError: productToast.updateError,
  });

  // ── XOÁ ──────────────────────────────────────────────────────
  const deleteMutation = useMutation({
    mutationFn: (id: number) => api.delete(`/api/products/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      productToast.deleteSuccess();
    },
    onError: productToast.deleteError,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !price) {
      toast.error('Vui lòng điền đầy đủ thông tin!');
      return;
    }
    addMutation.mutate({ name, price: Number(price) });
  };

  const startEdit = (p: Product) => {
    setEditingId(p.id);
    setEditName(p.name);
    setEditPrice(String(p.price));
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">📦 Danh sách sản phẩm</h1>

      {/* Form thêm mới */}
      <form onSubmit={handleSubmit} className="flex gap-2 mb-6 p-4 bg-gray-50 rounded-lg text-black">
        <input
          value={name}
          onChange={e => setName(e.target.value)}
          placeholder="Tên sản phẩm"
          className="border rounded px-3 py-2 flex-1 text-sm"
        />
        <input
          value={price}
          onChange={e => setPrice(e.target.value)}
          placeholder="Giá (đ)"
          type="number"
          className="border rounded px-3 py-2 w-32 text-sm"
        />
        <button
          type="submit"
          disabled={addMutation.isPending}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 text-sm disabled:opacity-50"
        >
          {addMutation.isPending ? '⏳...' : '+ Thêm'}
        </button>
      </form>

      {isLoading && (
        <p className="text-center text-gray-400 py-8">Đang tải...</p>
      )}

      {/* Danh sách sản phẩm */}
      <div className="space-y-2">
        {products.map(p => (
          <div key={p.id} className="border rounded-lg p-3 bg-white shadow-sm text-black">

            {editingId !== p.id ? (
              /* Chế độ xem thường */
              <div className="flex justify-between items-center gap-2">
                <div>
                  <p className="font-medium text-sm">{p.name}</p>
                  <p className="text-blue-600 text-sm font-bold">
                    {p.price.toLocaleString()}đ
                  </p>
                </div>
                <div className="flex gap-2 items-center shrink-0">
                  <button
                    onClick={() => addToCart(p.id, p.name)}
                    className="bg-green-500 text-white px-3 py-1 rounded text-xs hover:bg-green-600"
                  >
                    🛒 Thêm vào giỏ
                  </button>
                  <button
                    onClick={() => startEdit(p)}
                    className="text-blue-500 hover:text-blue-700 text-sm px-2"
                    title="Sửa"
                  >
                    ✏️
                  </button>
                  <button
                    onClick={() => {
                      if (confirm('Xoá sản phẩm này?')) deleteMutation.mutate(p.id);
                    }}
                    className="text-red-500 hover:text-red-700 text-sm px-2"
                    title="Xoá"
                  >
                    🗑️
                  </button>
                </div>
              </div>

            ) : (
              /* Chế độ edit inline */
              <div className="flex gap-2 items-center">
                <input
                  value={editName}
                  onChange={e => setEditName(e.target.value)}
                  className="border rounded px-2 py-1 flex-1 text-sm"
                />
                <input
                  value={editPrice}
                  onChange={e => setEditPrice(e.target.value)}
                  type="number"
                  className="border rounded px-2 py-1 w-28 text-sm"
                />
                <button
                  onClick={() =>
                    updateMutation.mutate({
                      id: p.id,
                      data: { name: editName, price: Number(editPrice) },
                    })
                  }
                  disabled={updateMutation.isPending}
                  className="bg-green-500 text-white px-3 py-1 rounded text-sm disabled:opacity-50"
                >
                  {updateMutation.isPending ? '...' : '✅ Lưu'}
                </button>
                <button
                  onClick={() => setEditingId(null)}
                  className="text-gray-500 hover:text-gray-700 text-sm px-2"
                >
                  ✖️
                </button>
              </div>
            )}

          </div>
        ))}
      </div>
    </div>
  );
}
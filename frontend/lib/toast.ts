import toast from 'react-hot-toast';

// ── SẢN PHẨM ─────────────────────────────────────────────────
export const productToast = {
  addSuccess:    () => toast.success('Thêm sản phẩm thành công!'),
  addError:      () => toast.error('Thêm sản phẩm thất bại!'),
  updateSuccess: () => toast.success('Cập nhật sản phẩm thành công!'),
  updateError:   () => toast.error('Cập nhật thất bại, thử lại!'),
  deleteSuccess: () => toast.success('Đã xoá sản phẩm', { icon: '🗑️' }),
  deleteError:   () => toast.error('Xoá thất bại, thử lại!'),
};

// ── GIỎ HÀNG ─────────────────────────────────────────────────
export const cartToast = {
  addSuccess:    (name: string) =>
    toast.success(`Đã thêm "${name}" vào giỏ hàng`, { icon: '🛒' }),
  removeSuccess: () => toast.success('Đã xoá khỏi giỏ hàng', { icon: '🗑️' }),
  clearSuccess:  () => toast.success('Đã xoá toàn bộ giỏ hàng', { icon: '🧹' }),
  empty:         () => toast.error('Giỏ hàng đang trống!', { icon: '🛒' }),
};

// ── KẾT NỐI ──────────────────────────────────────────────────
export const serverToast = {
  connectionError: () =>
    toast.error('Không thể kết nối server, kiểm tra lại!', { duration: 5000 }),
  notFound: () => toast.error('Không tìm thấy dữ liệu!'),
};

// ── PROMISE WRAPPER (dùng cho mọi async action) ───────────────
export function promiseToast<T>(
  promise: Promise<T>,
  messages: { loading: string; success: string; error: string }
) {
  return toast.promise(promise, messages);
}
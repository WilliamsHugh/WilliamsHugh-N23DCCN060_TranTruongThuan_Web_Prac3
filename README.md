# Fullstack Shop — LAB 3

Ứng dụng quản lý sản phẩm và giỏ hàng fullstack, kết nối **NextJS 15** (frontend) với **Express** (backend).

---
## Thông tin sinh viên

| Thông tin     | Chi tiết                                                             |
|---------------|----------------------------------------------------------------------|
| **Họ và tên** | Trần Trường Thuận                                                    |
| **MSSV**      | N23DCCN060                                                           |
| **Môn học**   | Thực hành Web                                                        |

---

## Công nghệ sử dụng

| Phía | Công nghệ |
|------|-----------|
| Frontend | Next.js 15, TypeScript, Tailwind CSS |
| Backend | Node.js, Express |
| HTTP Client | Axios |
| Server State | TanStack React Query v5 |
| Toast | react-hot-toast |
| Lưu trữ | File JSON (fs.promises) |

---

## Cấu trúc dự án

```
fullstack-shop/
├── backend/
│   ├── server.js       # Express server — toàn bộ API
│   ├── data.json       # Dữ liệu sản phẩm (tự tạo khi chạy lần đầu)
│   ├── cart.json       # Dữ liệu giỏ hàng (tự tạo khi chạy lần đầu)
│   └── package.json
└── frontend/
    ├── app/
    │   ├── products/page.tsx   # Trang quản lý sản phẩm
    │   ├── cart/page.tsx       # Trang giỏ hàng
    │   ├── layout.tsx          # Root layout + Toaster
    │   └── providers.tsx       # QueryClient + CartProvider
    ├── components/
    │   └── Header.tsx          # Navbar + badge giỏ hàng
    └── lib/
        ├── api.ts              # Axios instance
        ├── cartContext.tsx     # Cart state (React Context + React Query)
        └── toast.ts            # Toast helper tập trung
```

---

## Cài đặt và chạy

### 1. Clone / tải về

```bash
git clone https://github.com/WilliamsHugh/WilliamsHugh-N23DCCN060_TranTruongThuan_Web_Prac3.git
cd fullstack-shop
```

### 2. Chạy Backend

```bash
cd backend
npm install
node server.js
# Backend chạy tại http://localhost:5000
```

### 3. Chạy Frontend

Mở tab terminal mới:

```bash
cd frontend
npm install
npm run dev
# Frontend chạy tại http://localhost:3000
```

### 4. Mở trình duyệt

| URL | Trang |
|-----|-------|
| http://localhost:3000 | Trang chủ |
| http://localhost:3000/products | Quản lý sản phẩm |
| http://localhost:3000/cart | Giỏ hàng |

---

## API Endpoints

### Products

| Method | Endpoint | Mô tả |
|--------|----------|-------|
| GET | `/api/products` | Lấy danh sách sản phẩm |
| POST | `/api/products` | Thêm sản phẩm mới |
| PUT | `/api/products/:id` | Cập nhật sản phẩm |
| DELETE | `/api/products/:id` | Xoá sản phẩm |

**POST/PUT body:**
```json
{
  "name": "Tên sản phẩm",
  "price": 150000
}
```

### Cart

| Method | Endpoint | Mô tả |
|--------|----------|-------|
| GET | `/api/cart` | Lấy giỏ hàng (có join tên + giá) |
| POST | `/api/cart` | Thêm vào giỏ (tự tăng SL nếu đã có) |
| DELETE | `/api/cart/:productId` | Xoá 1 sản phẩm khỏi giỏ |
| DELETE | `/api/cart` | Xoá toàn bộ giỏ hàng |

**POST body:**
```json
{
  "productId": 1,
  "quantity": 2
}
```

---

## Tính năng đã hoàn thành

### Cơ bản (Lab yêu cầu)
- [x] Thiết lập CORS + Proxy NextJS
- [x] GET danh sách sản phẩm từ backend
- [x] Form thêm sản phẩm (POST)
- [x] Xoá sản phẩm với optimistic update (DELETE)
- [x] Toast thông báo thành công / lỗi
- [x] Debug với DevTools và terminal log

### Nâng cao (Bonus)
- [x] **Nâng cao 1** — Sửa sản phẩm inline (PUT)
- [x] **Nâng cao 2** — React Query: cache tự động, `invalidateQueries`, `isPending`
- [x] **Nâng cao 3** — Lưu dữ liệu vào `data.json` / `cart.json`, không mất khi restart server
- [x] **Nâng cao 4** — Giỏ hàng hoàn chỉnh: thêm/xoá/xoá hết, badge real-time trên header

---

## Các khái niệm quan trọng

### CORS
Lỗi xảy ra ở **trình duyệt** khi server không gửi header `Access-Control-Allow-Origin`. Hai cách xử lý:
- Dùng middleware `cors()` trên Express
- Dùng proxy `rewrites` trong `next.config.ts` (cách khuyến nghị cho production)

### Optimistic Update
Cập nhật UI **ngay lập tức** trước khi chờ server phản hồi. Nếu server lỗi thì rollback lại.

```ts
// Xoá khỏi state ngay
setProducts(prev => prev.filter(p => p.id !== id));
// Nếu lỗi → gọi lại fetchProducts() để rollback
```

### React Query
Thay thế `useEffect + fetch + useState` thủ công bằng:
- `useQuery` — fetch + cache + loading state tự động
- `useMutation` — gửi dữ liệu + `invalidateQueries` tự refetch

---

## Lỗi thường gặp

| Lỗi | Nguyên nhân | Cách fix |
|-----|-------------|----------|
| CORS error | Thiếu `cors()` middleware | Thêm vào `server.js` |
| `ERR_CONNECTION_REFUSED` | Backend chưa chạy | Chạy `node server.js` |
| 400 Bad Request | Thiếu `Content-Type: application/json` | Axios tự thêm — kiểm tra `api.ts` |
| 404 Not Found | Sai URL hoặc sai method | Kiểm tra Network tab trong DevTools |
| Toast không hiện | Thiếu `<Toaster>` trong layout | Kiểm tra `layout.tsx` |

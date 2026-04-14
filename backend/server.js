const express = require('express');
const cors    = require('cors');
const fs      = require('fs').promises;
const path    = require('path');

const app       = express();
const DATA_PATH = path.join(__dirname, 'data.json');
const CART_PATH = path.join(__dirname, 'cart.json');

app.use(cors({
  origin: 'http://localhost:3000',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type'],
}));
app.use(express.json());

// Log mọi request — giúp debug
app.use((req, _, next) => {
  console.log(`[${new Date().toLocaleTimeString()}] ${req.method} ${req.url}`);
  next();
});

// ── Helper đọc/ghi ────────────────────────────────────────────
async function readData() {
  try {
    const raw = await fs.readFile(DATA_PATH, 'utf-8');
    return JSON.parse(raw);
  } catch {
    // File chưa tồn tại → trả về data mặc định
    const defaults = [
      { id: 1, name: 'Áo thun basic',   price: 150000 },
      { id: 2, name: 'Quần jeans slim', price: 450000 },
    ];
    await writeData(defaults);
    return defaults;
  }
}

async function writeData(data) {
  await fs.writeFile(DATA_PATH, JSON.stringify(data, null, 2), 'utf-8');
}

async function readCart() {
  try {
    const raw = await fs.readFile(CART_PATH, 'utf-8');
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

async function writeCart(data) {
  await fs.writeFile(CART_PATH, JSON.stringify(data, null, 2), 'utf-8');
}

// ── PRODUCTS ─────────────────────────────────────────────────

// GET — lấy danh sách
app.get('/api/products', async (req, res) => {
  try {
    const products = await readData();
    res.json(products);
  } catch {
    res.status(500).json({ error: 'Lỗi đọc dữ liệu' });
  }
});

// POST — thêm mới
app.post('/api/products', async (req, res) => {
  try {
    const { name, price } = req.body;
    if (!name || !price)
      return res.status(400).json({ error: 'Thiếu dữ liệu' });

    const products   = await readData();
    const newProduct = { id: Date.now(), name, price: Number(price) };
    products.push(newProduct);
    await writeData(products);
    res.status(201).json(newProduct);
  } catch {
    res.status(500).json({ error: 'Lỗi lưu dữ liệu' });
  }
});

// PUT — cập nhật
app.put('/api/products/:id', async (req, res) => {
  try {
    const id       = Number(req.params.id);
    const products = await readData();
    const index    = products.findIndex(p => p.id === id);
    if (index === -1)
      return res.status(404).json({ error: 'Không tìm thấy sản phẩm' });

    products[index] = { ...products[index], ...req.body };
    await writeData(products);
    res.json(products[index]);
  } catch {
    res.status(500).json({ error: 'Lỗi cập nhật dữ liệu' });
  }
});

// DELETE — xoá
app.delete('/api/products/:id', async (req, res) => {
  try {
    const id       = Number(req.params.id);
    const products = await readData();
    const index    = products.findIndex(p => p.id === id);
    if (index === -1)
      return res.status(404).json({ error: 'Không tìm thấy sản phẩm' });

    products.splice(index, 1);
    await writeData(products);
    res.json({ message: 'Đã xoá thành công' });
  } catch {
    res.status(500).json({ error: 'Lỗi xoá dữ liệu' });
  }
});

// ── CART ─────────────────────────────────────────────────────

// GET — lấy giỏ hàng (join với products để lấy tên + giá)
app.get('/api/cart', async (req, res) => {
  try {
    const cart     = await readCart();
    const products = await readData();

    const result = cart
      .map(item => {
        const product = products.find(p => p.id === item.productId);
        if (!product) return null;
        return {
          ...item,
          name:  product.name,
          price: product.price,
          total: product.price * item.quantity,
        };
      })
      .filter(Boolean);

    res.json(result);
  } catch {
    res.status(500).json({ error: 'Lỗi đọc giỏ hàng' });
  }
});

// POST — thêm vào giỏ (nếu đã có thì tăng số lượng)
app.post('/api/cart', async (req, res) => {
  try {
    const { productId, quantity = 1 } = req.body;
    if (!productId)
      return res.status(400).json({ error: 'Thiếu productId' });

    const products = await readData();
    const product  = products.find(p => p.id === Number(productId));
    if (!product)
      return res.status(404).json({ error: 'Sản phẩm không tồn tại' });

    const cart  = await readCart();
    const index = cart.findIndex(i => i.productId === Number(productId));

    if (index > -1) {
      cart[index].quantity += Number(quantity);
    } else {
      cart.push({ productId: Number(productId), quantity: Number(quantity) });
    }

    await writeCart(cart);
    res.status(201).json({ message: 'Đã thêm vào giỏ' });
  } catch {
    res.status(500).json({ error: 'Lỗi thêm vào giỏ hàng' });
  }
});

// DELETE — xoá 1 item khỏi giỏ
app.delete('/api/cart/:productId', async (req, res) => {
  try {
    const productId = Number(req.params.productId);
    const cart      = await readCart();
    const newCart   = cart.filter(i => i.productId !== productId);
    await writeCart(newCart);
    res.json({ message: 'Đã xoá khỏi giỏ hàng' });
  } catch {
    res.status(500).json({ error: 'Lỗi xoá giỏ hàng' });
  }
});

// DELETE — xoá toàn bộ giỏ
app.delete('/api/cart', async (req, res) => {
  try {
    await writeCart([]);
    res.json({ message: 'Đã xoá toàn bộ giỏ hàng' });
  } catch {
    res.status(500).json({ error: 'Lỗi xoá giỏ hàng' });
  }
});

app.listen(5000, () =>
  console.log('✅ Backend chạy tại http://localhost:5000')
);
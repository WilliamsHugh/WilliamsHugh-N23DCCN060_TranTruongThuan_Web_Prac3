'use client';
import { useEffect, useState } from 'react';

export default function Home() {
  const [products, setProducts] = useState<Array<{id: string; name: string}>>([]);
  useEffect(() => {
    fetch('http://localhost:5000/api/products')
      .then(r => r.json())
      .then(data => setProducts(data))
      .catch(console.error);
  }, []);
  return <div>
    {products.map(product => (
        <div key={product.id}>{product.name}</div>
      ))}
  </div>;
}
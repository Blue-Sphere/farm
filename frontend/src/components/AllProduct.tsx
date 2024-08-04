import ProductCard from "./ProductCard";
import { useState, useEffect } from "react";

interface Product {
  id: number;
  name: string;
  quantity: number;
  price: number;
}

export default function AllProduct() {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    fetch("http://localhost:8000/product")
      .then((response) => response.json())
      .then((data) => setProducts(data));
  });
  return (
    <>
      {products.map((product) => (
        <div key={product.id}>
          <ProductCard product={product} />
        </div>
      ))}
    </>
  );
}

"use client";

import { useEffect } from "react";

import { CartProvider } from "@/providers/cart";
import { ProductOptionsProvider, useProductOptions } from "@/providers/product-options";

import { Cart } from "@/components/cart";
import { ProductOptionsCard } from "@/components/product/product-options-card";

import { productsExample } from "@/data";

function Content() {
  const setProduct = useProductOptions((s) => s.setProduct);

  useEffect(() => {
    setProduct(productsExample[0]);
  }, []);

  return (
    <div className={s.container}>
      <div className={s.optionsCard}>
        <ProductOptionsCard />
      </div>

      <div className={s.cartCard}>
        <div className={s.title}>Cart</div>

        <div className={s.cart}>
          <Cart showCheckoutBtn={false} />
        </div>
      </div>
    </div>
  );
}

export function AddUpdateDeleteCart() {
  return (
    <CartProvider>
      <ProductOptionsProvider>
        <Content />
      </ProductOptionsProvider>
    </CartProvider>
  );
}

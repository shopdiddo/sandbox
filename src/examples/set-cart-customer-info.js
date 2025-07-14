"use client";

import { useEffect } from "react";
import { AnimatePresence } from "motion/react";

import { CartProvider, useCart } from "@/providers/cart";
import { ProductOptionsProvider, useProductOptions } from "@/providers/product-options";

import { Cart } from "@/components/cart";
import { ProductOptionsCard } from "@/components/product/product-options-card";
import { Checkout } from "@/components/checkout";

import { productsExample } from "@/data";

import s from "./set-cart-customer.module.css";

function Content() {
  const setProduct = useProductOptions((s) => s.setProduct);
  const cart = useCart((s) => s.cart);

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

        <div className={s.cartContent}>
          <Cart showCheckoutBtn={false} />
        </div>
      </div>

      <div className={s.checkoutCard}>
        <div className={s.title}>Set Customer Info</div>

        <AnimatePresence>
          {!!cart?.length ? (
            <>
              <div className={s.checkoutContent}>
                <Checkout checkoutBtnText="Set Customer info" />
              </div>
            </>
          ) : (
            <div className={s.emptyState}>Try adding some products to the cart, then you can set customer info.</div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

export function SetCartCustomerInfo() {
  return (
    <CartProvider>
      <ProductOptionsProvider>
        <Content />
      </ProductOptionsProvider>
    </CartProvider>
  );
}

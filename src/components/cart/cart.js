"use client";

import { motion } from "motion/react";

import { useCart } from "@/providers/cart";

import { CartFooter } from "@/components/cart/cart-footer";
import { CartItems } from "@/components/cart/cart-items";

import s from "./cart.module.css";

export function Cart({ onCheckout, showCheckoutBtn = true }) {
  const cart = useCart((s) => s.cart);
  const isLoading = useCart((s) => s.isLoading);
  const isError = useCart((s) => s.isError);
  const error = useCart((s) => s.error);

  return (
    <div className={s.cartContainer}>
      {isLoading && <div className={s.loading}>Updating cart...</div>}

      {!isLoading && isError && (
        <div className={s.error}>
          <code>error: {error?.toString()}</code>
        </div>
      )}

      {!isLoading && !isError && !cart?.length && (
        <motion.div
          className={s.emptyCart}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className={s.emptyCartText}>Your cart is empty</div>
        </motion.div>
      )}

      {!!cart?.length && <CartItems />}

      {showCheckoutBtn && <CartFooter onCheckout={onCheckout} />}
    </div>
  );
}

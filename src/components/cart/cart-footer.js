"use client";

import { motion } from "motion/react";
import { CreditCard01 } from "@untitledui/icons";

import { useCart } from "@/providers/cart";

import s from "./cart-footer.module.css";

export function CartFooter({ onCheckout = () => {} }) {
  const cart = useCart((s) => s.cart);
  // const totalPrice = useCart((s) => s.cart.reduce((t, i) => t + i.price * i.quantity, 0));
  const total = useCart((s) => s.cost.total);

  return (
    <motion.div
      className={s.footer}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.2 }}
    >
      <div className={s.cartTotal}>
        <div className={s.cartTotalLabel}>Total</div>
        <div className={s.cartTotalPrice}>{total}</div>
      </div>

      <button disabled={!cart?.length} className={s.checkoutBtn} onClick={onCheckout}>
        <CreditCard01 className={s.checkoutIcon} />
        Checkout
      </button>
    </motion.div>
  );
}

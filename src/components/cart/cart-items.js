"use client";

import { motion } from "motion/react";

import { useCart } from "@/providers/cart";

import { CartItem } from "@/components/cart/cart-item";

import { variants } from "@/utils/animation-variants";

import s from "./cart-items.module.css";

export function CartItems() {
  const cart = useCart((s) => s.cart);

  return (
    <motion.div className={s.container} variants={variants.stagger} initial="inactive" animate="active">
      {cart.map((item, index) => (
        <CartItem key={`cart-item-${item.id}`} {...{ item, index }} />
      ))}
    </motion.div>
  );
}

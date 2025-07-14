"use client";

import { motion } from "motion/react";

import { useCart } from "@/providers/cart";

import { variants } from "@/utils/animation-variants";

import s from "./cart-item.module.css";

export function CartItem({ item, index }) {
  const updateQuantity = useCart((s) => s.updateQuantity);
  const removeFromCart = useCart((s) => s.removeFromCart);

  return (
    <motion.div
      className={s.cartItem}
      variants={variants.item}
      layout
      layoutId={`layout-id-${item.id}`}
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{
        duration: 0.3,
        delay: index * 0.05,
        type: "spring",
        stiffness: 300,
        damping: 30,
      }}
    >
      <div className={s.cartItemImage}>
        <img src={item.image} alt={item.name} />
      </div>

      <div className={s.cartItemDetails}>
        <div className={s.cartItemName}>{item.title}</div>

        <div className={s.cartItemMeta}>
          <div className={s.cartItemColor}>
            {/* <div className={s.cartColorSwatch} style={{ "--color": item.hexColor }} /> */}
            {/* <span className={s.cartItemSize}>{item.size}</span> */}
          </div>
        </div>

        <div className={s.cartItemPrice}>{item.price}</div>
      </div>

      <div className={s.cartItemControls}>
        <div className={s.cartItemQuantity}>
          <button
            onClick={() => updateQuantity(item.id, item.quantity - 1)}
            disabled={item.quantity === 1}
            className={s.quantityBtn}
          >
            -
          </button>

          <div className={s.quantityValue}>{item.quantity}</div>

          <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className={s.quantityBtn}>
            +
          </button>
        </div>

        <button onClick={() => removeFromCart(item.id)} className={s.removeBtn}>
          Remove
        </button>
      </div>
    </motion.div>
  );
}

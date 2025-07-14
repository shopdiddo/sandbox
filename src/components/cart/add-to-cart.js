"use client";

import { useMemo, useCallback } from "react";
import { motion } from "motion/react";

import { useCart } from "@/providers/cart";
import { useProductOptions } from "@/providers/product-options";

import s from "./add-to-cart.module.css";

export function AddToCartBtn({ onAddToCart }) {
  const addToCart = useCart((s) => s.addToCart);
  const isCartLoading = useCart((s) => s.isLoading);

  const selectedVariant = useProductOptions((s) => s.selectedVariant);
  const quantity = useProductOptions((s) => s.quantity);

  const onButtonClick = useCallback(async () => {
    await addToCart(selectedVariant.external_id, quantity);

    onAddToCart();
  }, [isCartLoading, onAddToCart, addToCart, quantity, selectedVariant]);

  const isSelectedVariantUnavailable = useMemo(() => !selectedVariant?.external_id, [selectedVariant]);

  return (
    <motion.button
      className={s.addToCartBtn}
      onClick={onButtonClick}
      disabled={isCartLoading || isSelectedVariantUnavailable}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      {isSelectedVariantUnavailable ? (
        "Unavailable"
      ) : isCartLoading ? (
        <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} className={s.addingText}>
          Adding...
        </motion.span>
      ) : (
        "Add to cart"
      )}
    </motion.button>
  );
}

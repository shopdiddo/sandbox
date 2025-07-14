"use client";

import { useProductOptions } from "@/providers/product-options";

import s from "./quantity-selector.module.css";

export function QuantitySelector() {
  const quantity = useProductOptions((s) => s.quantity);
  const setQuantity = useProductOptions((s) => s.setQuantity);

  return (
    <div className={s.quantity}>
      <button
        onClick={() => {
          if (quantity > 1) {
            setQuantity(quantity - 1);
          }
        }}
        disabled={quantity === 1}
        className={s.quantityBtn}
      >
        -
      </button>

      <div className={s.quantityValue}>{quantity}</div>

      <button
        onClick={() => {
          if (quantity < 99) {
            setQuantity(quantity + 1);
          }
        }}
        className={s.quantityBtn}
      >
        +
      </button>
    </div>
  );
}

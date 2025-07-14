"use client";

import { motion } from "motion/react";

import { useProductOptions } from "@/providers/product-options";

import { ProductImageCarousel } from "@/components/product/product-image-carousel";
import { OptionSelectors } from "@/components/selectors/option-selector";
import { QuantitySelector } from "@/components/selectors/quantity-selector";
import { AddToCartBtn } from "@/components/cart/add-to-cart";

import s from "./product-options-card.module.css";

export function ProductOptionsCard({ onAddToCart = () => {} }) {
  const product = useProductOptions((s) => s.product);
  const selectedVariant = useProductOptions((s) => s.selectedVariant);

  if (!product) return <></>;

  return (
    <div className={s.container}>
      <div className={s.details}>
        <div className={s.carousel}>
          <ProductImageCarousel product={product} />
        </div>

        <div className={s.title}>{product.title}</div>
        <div className={s.price}>{selectedVariant?.price}</div>
        <div className={s.description}>{product.description}</div>

        <div className={s.selectors}>
          <OptionSelectors />
        </div>
      </div>

      <motion.div
        className={s.footer}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.2 }}
      >
        <QuantitySelector />

        <div className={s.addToCartBtnContainer}>
          <AddToCartBtn onAddToCart={onAddToCart} />
        </div>
      </motion.div>
    </div>
  );
}

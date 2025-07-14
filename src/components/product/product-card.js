"use client";

import s from "./product-card.module.css";

import { teams } from "@/data";

export function ProductCard({ product }) {
  return (
    <div className={s.container}>
      <div className={s.imgBgContainer}>
        <img className={s.img} src={product.featured_image} />
      </div>

      <div className={s.imgContainer}>
        <img className={s.img} src={product.featured_image} />
      </div>

      <div className={s.nameContainer}>
        {!!product.team && (
          <div className={s.teams}>
            <div className={s.logoContainer}>
              <img className={s.logo} src={teams[product.team].logo} />
            </div>
          </div>
        )}

        <div className={s.name}>{product.title}</div>
      </div>
    </div>
  );
}

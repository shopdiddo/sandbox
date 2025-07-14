"use client";

import { ProductSearchProvider } from "@/providers/product-search";

import { ProductSearchResults } from "@/components/product/product-search-results";

import s from "./products-by-bestseller.module.css";

function Content() {
  return (
    <div className={s.container}>
      <div className={s.card}>
        <div className={s.header}>Top K Best Selling Products</div>

        <div className={s.content}>
          <ProductSearchResults />
        </div>
      </div>
    </div>
  );
}

export function ProductsByBestseller() {
  return (
    <ProductSearchProvider>
      <Content />
    </ProductSearchProvider>
  );
}

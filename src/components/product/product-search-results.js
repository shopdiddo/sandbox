"use client";

import { useProductSearch } from "@/providers/product-search";

import { ProductCard } from "@/components/product/product-card";

import s from "./product-search-results.module.css";

export function ProductSearchResults({ onProductClick = () => {} }) {
  const products = useProductSearch((s) => s.products);
  const isLoading = useProductSearch((s) => s.isLoading);
  const isError = useProductSearch((s) => s.isError);
  const error = useProductSearch((s) => s.error);

  return (
    <div className={s.container}>
      {isLoading && <div className={s.loading}> Loading... </div>}

      {!isLoading && isError && <div> error: {error.toString()}</div>}

      {!isLoading && !isError && !products?.length && <div className={s.noProducts}>No products found</div>}

      {!isLoading &&
        !isError &&
        !!products?.length &&
        products.map((product, i) => (
          <div
            key={`res-${i}`}
            className={s.item}
            onClick={() => {
              onProductClick(product);
            }}
          >
            <ProductCard product={product} />
          </div>
        ))}
    </div>
  );
}

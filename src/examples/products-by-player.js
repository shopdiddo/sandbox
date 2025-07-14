"use client";

import { ProductSearchProvider } from "@/providers/product-search";

import { ProductSearchResults } from "@/components/product/product-search-results";
import { PlayerSelector } from "@/components/selectors/player-selector";

import { players } from "@/data";

import s from "./products-by-player.module.css";

function Content() {
  return (
    <div className={s.container}>
      <div className={s.card}>
        <div className={s.header}>
          <PlayerSelector players={players} />
        </div>

        <div className={s.content}>
          <ProductSearchResults />
        </div>
      </div>
    </div>
  );
}

export function ProductsByPlayer() {
  return (
    <ProductSearchProvider>
      <Content />
    </ProductSearchProvider>
  );
}

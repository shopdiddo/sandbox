"use client";

import { ProductSearchProvider } from "@/providers/product-search";

import { ProductSearchResults } from "@/components/product/product-search-results";
import { TeamSelector } from "@/components/selectors/team-selector";

import s from "./products-by-team.module.css";

const teams = [
  {
    acronym: "ATL",
    shortName: "Hawks",
    logo: "./nba-team-logos/atlanta hawks.svg",
  },
  {
    acronym: "BOS",
    shortName: "Celtics",
    logo: "./nba-team-logos/boston celtics.svg",
  },
  {
    acronym: "BKN",
    shortName: "Nets",
    logo: "./nba-team-logos/brooklyn nets.svg",
  },
];

function Content() {
  return (
    <div className={s.container}>
      <div className={s.card}>
        <div className={s.header}>
          <TeamSelector teams={teams} />
        </div>

        <div className={s.content}>
          <ProductSearchResults />
        </div>
      </div>
    </div>
  );
}

export function ProductsByTeam() {
  return (
    <ProductSearchProvider>
      <Content />
    </ProductSearchProvider>
  );
}

"use client";

import { useProductSearch } from "@/providers/product-search";

import { useMemo } from "react";

import s from "./team-selector.module.css";

export function TeamSelector({ teams }) {
  const selectedTeam = useProductSearch((s) => s.filters.team);
  const setProductSearchFilters = useProductSearch((s) => s.setFilters);

  if (!teams?.length) {
    return <></>;
  }

  return (
    <div className={s.selectorGroup}>
      <div className={s.teamSelector}>
        <div className={s.teamSelectorContainer}>
          {teams.map((team, i) => (
            <div
              key={`team-selector-${i}`}
              className={`${s.teamOption} ${selectedTeam === team.acronym ? s.selected : ""}`}
              onClick={() => {
                setProductSearchFilters({ team: team.acronym });
              }}
            >
              <img className={s.teamLogo} src={team.logo} loading="lazy" />

              <div className={s.teamInfo}>
                <div className={s.teamName}>{team.shortName}</div>
                <div className={s.teamAcronym}>{team.acronym}</div>
              </div>
            </div>
          ))}

          <div
            className={s.teamOrb}
            style={{
              left: selectedTeam
                ? `${(100 / teams.length) * (teams.findIndex((t) => t.acronym === selectedTeam) - 0.25)}%`
                : "0%",
            }}
          />
        </div>
      </div>
    </div>
  );
}

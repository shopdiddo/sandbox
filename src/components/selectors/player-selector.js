"use client";

import { useProductSearch } from "@/providers/product-search";

import s from "./player-selector.module.css";

export function PlayerSelector({ players }) {
  const selectedPlayer = useProductSearch((s) => s.filters.player);
  const setProductSearchFilters = useProductSearch((s) => s.setFilters);

  if (!players?.length) {
    return <></>;
  }

  return (
    <div className={s.selectorGroup}>
      <div className={s.playerSelector}>
        <div className={s.playerSelectorContainer}>
          {players.map((player, i) => (
            <div
              key={`player-selector-${i}`}
              className={`${s.playerOption} ${selectedPlayer === player.name ? s.selected : ""}`}
              onClick={() => {
                setProductSearchFilters({ player: player.name });
              }}
            >
              <img className={s.playerImg} src={player.image} loading="lazy" />

              <div className={s.playerInfo}>
                <div className={s.playerAcronym}>{player.team.acronym}</div>
                <div className={s.playerName}>{player.name}</div>
              </div>
            </div>
          ))}

          <div
            className={s.playerOrb}
            style={{
              left: selectedPlayer
                ? `${(100 / players.length) * (players.findIndex((t) => t.name === selectedPlayer) - 0.2)}%`
                : "0%",
            }}
          />
        </div>
      </div>
    </div>
  );
}

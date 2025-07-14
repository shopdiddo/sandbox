"use client";

import { useContext, createContext, useRef } from "react";
import { createStore, useStore } from "zustand";

const OverlayContext = createContext();

function makeOverlayStore() {
  return createStore((set) => ({
    state: null,
    history: [],

    setState: (x) => set((s) => ({ state: x, history: s.state ? [...s.history, s.state] : [] })),
    goBack: (x) => set((s) => ({ state: s.history.at(-1) || "", history: s.history.slice(0, -1) })),
    clearHistory: (x) => set((s) => ({ history: [] })),
  }));
}

export function useOverlay(selector) {
  const store = useContext(OverlayContext);

  if (!store) {
    console.error("using overlay context outside its provider");
  }

  return useStore(store, selector);
}

export function OverlayProvider({ children }) {
  const store = useRef();

  if (!store.current) {
    store.current = makeOverlayStore();
  }

  return <OverlayContext.Provider value={store.current}>{children}</OverlayContext.Provider>;
}

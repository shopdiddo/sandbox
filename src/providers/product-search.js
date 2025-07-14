"use client";

import { createContext, useContext, useRef, useEffect } from "react";
import { useStore, createStore } from "zustand";
import { useQuery } from "@tanstack/react-query";
import { mockFetch } from "@/data/mock-api";

const ProductSearchContext = createContext();

function makeProductSearchStore() {
  return createStore((set) => ({
    // e.g. { team: '', tags: {}, productsPer: 5 }
    filters: {},
    products: [],
    isSuccess: false,
    isLoading: false,
    isError: false,
    error: null,

    setFilters: (f) => set((s) => ({ filters: { ...s.filters, ...f } })),
    setProducts: (p) => set(() => ({ products: p })),
    setQueryState: ({ data, isSuccess, isLoading, isError, error }) =>
      set(() => ({
        products: data || [],
        isSuccess,
        isLoading,
        isError,
        error,
      })),
  }));
}

export function useProductSearch(selector) {
  const store = useContext(ProductSearchContext);

  if (!store) {
    console.error("useProducts used outside of its provider");
  }

  return useStore(store, selector);
}

export function useAutoQueryProducts() {
  const setQueryState = useProductSearch((s) => s.setQueryState);
  const filters = useProductSearch((s) => s.filters);

  const { data, isSuccess, isLoading, isError, error } = useQuery({
    queryKey: ["products", filters],
    queryFn: async () => {
      const res = await mockFetch("/products", {
        method: "POST",
        body: JSON.stringify(filters),
      });

      return res.json();
    },
    // refetchInterval: refetchInterval * 1000,
    // select: (data) => {
    //   return orderBy(data, [sort.field, sort.order]);
    // },
  });

  useEffect(() => {
    setQueryState({ data, isLoading, isError, isSuccess, error });
  }, [data, isLoading, isError, isSuccess, error, setQueryState]);
}

function AutoProductSearchEffect() {
  useAutoQueryProducts();
  return null;
}

export function ProductSearchProvider({ children }) {
  const store = useRef();

  if (!store.current) {
    store.current = makeProductSearchStore();
  }

  return (
    <ProductSearchContext.Provider value={store.current}>
      <AutoProductSearchEffect />
      {children}
    </ProductSearchContext.Provider>
  );
}

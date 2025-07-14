"use client";

import { useContext, useRef, createContext, useEffect } from "react";
import { useStore, createStore } from "zustand";

const ProductOptionsContext = createContext();

function makeProductOptionsStore(product) {
  return createStore((set) => ({
    product,
    variants: [],
    optionNames: [],
    optionValues: [],
    selectedOptionIdxs: [],
    selectedVariant: null,
    quantity: 1,

    setProduct: ({ option_values: optionValues, option_names: optionNames, variants, ...product }) =>
      set({
        quantity: 1,
        product,
        variants,
        optionNames,
        optionValues,
        selectedVariant: variants[0],
        selectedOptionIdxs:
          variants?.[0].option_values?.map((val, i) =>
            optionValues[optionNames[i]].findIndex(({ value }) => value === val)
          ) || [],
      }),

    setSelectedOptionIdx: (nameIdx, valIdx) =>
      set((s) => {
        const selectedOptionIdxs = s.selectedOptionIdxs.slice();

        selectedOptionIdxs[nameIdx] = valIdx;

        const selectedVariant = s.variants.find((variant) =>
          variant.option_values.every((v, i) => s.optionValues[s.optionNames[i]][selectedOptionIdxs[i]]?.value === v)
        );

        return { selectedOptionIdxs, selectedVariant };
      }),

    setQuantity: (q) => set({ quantity: q }),
  }));
}

export function useProductOptions(selector) {
  const store = useContext(ProductOptionsContext);

  if (!store) {
    console.error("using product details store outside its provider");
  }

  return useStore(store, selector);
}

export function ProductOptionsProvider({ children }) {
  const store = useRef();

  if (!store.current) {
    store.current = makeProductOptionsStore();
  }

  return <ProductOptionsContext.Provider value={store.current}>{children}</ProductOptionsContext.Provider>;
}

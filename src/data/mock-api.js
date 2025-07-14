"use client";

import { formatPrice, sleep } from "@/utils/helpers";

import { rawProductsResponseExample } from "@/data";

const mockAPI = {
  "/products": async (filters) => {
    await sleep(0.5);

    return rawProductsResponseExample.products.map((p) => {
      p.variants = p.variants.map(({ currency, price, ...v }) => ({ ...v, price: formatPrice(price, currency) }));
      return p;
    });
  },
};

export const mockFetch = async (endpointStr, { method, body = "{}" }) => {
  const data = await mockAPI[endpointStr](JSON.parse(body));

  return {
    json: () => data,
  };
};

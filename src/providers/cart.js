import { createContext, useContext, useRef, useEffect } from "react";
import { createStore, useStore } from "zustand";
import { persist } from "zustand/middleware";
import { formatPrice } from "@/utils/helpers";

const formatCartResponse = (data) => {
  const cost = {
    shipping: data.cost?.shipping?.value ? formatPrice(data.cost?.shipping?.value, data.cost?.shipping?.currency) : "-",
    tax: data.cost?.tax?.value ? formatPrice(data.cost?.tax?.value, data.cost?.tax?.currency) : "-",
    subtotal: data.cost?.subtotal?.value ? formatPrice(data.cost?.subtotal?.value, data.cost?.subtotal?.currency) : "-",
    total: data.cost?.total?.value ? formatPrice(data.cost?.total?.value, data.cost?.total?.currency) : "-",
  };

  const cart = data.stores
    ?.map((store) =>
      store.cart_lines.map(({ quantity, variant }) => {
        const { price, ...variantData } = variant;

        return {
          quantity,
          price: formatPrice(price?.value, price?.currency),
          ...variantData,
        };
      })
    )
    .flat();

  if (!cart) {
    return { cost, cart: [], cartId: "0" };
  }

  return { cost, cart, cartId: data.id };
};

const CartContext = createContext({});

function makeCartStore() {
  return createStore(
    persist(
      (set, get) => ({
        cartId: "0",
        cart: [],
        cost: {
          shipping: null,
          tax: null,
          subtotal: null,
          total: null,
        },

        isLoading: false,
        isError: false,
        error: null,

        addToCart: async (variantId, quantity) => {
          if (!variantId || quantity > 500) {
            return;
          }

          const cartId = get().cartId || "0";

          try {
            // Optimistic update for UI
            set((s) => ({
              cart: s.cart.map((x) => (x.id === variantId ? { ...x, quantity: x.quantity + quantity } : x)),
            }));

            set({ isLoading: true });

            const res = await fetch("http://localhost:8080/cart/add", {
              method: "POST",
              body: JSON.stringify({
                cart_id: cartId,
                item: {
                  variant_id: variantId,
                  quantity,
                },
              }),
            });
            const data = await res.json();

            set(formatCartResponse(data));
          } catch (error) {
            set({ isError: true, error });
          } finally {
            set({ isLoading: false });
          }
        },

        refreshCart: async () => {
          const cartId = get().cartId;

          if (!cartId || cartId === "0") {
            return;
          }

          try {
            set({ isLoading: true });

            const res = await fetch(`http://localhost:8080/cart/${cartId}`);
            const data = await res.json();

            if (!res.ok) {
              throw new Error(`failed to refresh cart: ${JSON.stringify(data?.errors || {})}`);
            }

            set(formatCartResponse(data));
            set({ isError: false, error: null });
          } catch (error) {
            set({ isError: true, error, cart: [] });
          } finally {
            set({ isLoading: false });
          }
        },

        updateQuantity: async (variantId, quantity) => {
          if (!variantId || quantity > 500) {
            return;
          }

          const cartId = get().cartId;

          try {
            // Optimistic update for UI
            set((s) => ({
              cart: s.cart.map((x) => (x.id === variantId ? { ...x, quantity } : x)),
            }));
            set({ isLoading: true });

            const res = await fetch("http://localhost:8080/cart/update", {
              method: "POST",
              body: JSON.stringify({
                cart_id: cartId,
                item: {
                  variant_id: variantId,
                  quantity,
                },
              }),
            });
            const data = await res.json();

            set(formatCartResponse(data));
          } catch (error) {
            set({ isError: true, error });
          } finally {
            set({ isLoading: false });
          }
        },

        removeFromCart: async (variantId) => {
          const cartId = get().cartId;

          if (!cartId || !variantId) {
            return;
          }

          try {
            // Optimistic update for UI
            set((s) => ({
              isLoading: true,
              cart: s.cart.filter((x) => x.id !== variantId),
            }));

            const res = await fetch("http://localhost:8080/cart/items", {
              method: "DELETE",
              body: JSON.stringify({
                cart_id: cartId,
                variant_id: variantId,
              }),
            });
            const data = await res.json();

            set(formatCartResponse(data));
          } catch (error) {
            set({ isError: true, error });
          } finally {
            set({ isLoading: false });
          }
        },
      }),
      {
        name: "cart",
        partialize: ({ cartId }) => ({ cartId }),
      }
    )
  );
}

export function useCart(selector) {
  const store = useContext(CartContext);

  if (!store) {
    console.error("using cart store outside its provider");
  }

  return useStore(store, selector);
}

export function CartProvider({ children }) {
  const store = useRef();

  if (!store.current) {
    store.current = makeCartStore();
  }

  useEffect(() => {
    store.current.getState().refreshCart();
  }, []);

  return <CartContext.Provider value={store.current}>{children}</CartContext.Provider>;
}

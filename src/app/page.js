"use client";

import { ProductsByBestseller } from "@/examples/products-by-bestseller";
import { ProductsByTeam } from "@/examples/products-by-team";
import { ProductsByPlayer } from "@/examples/products-by-player";
import { AddUpdateDeleteCart } from "@/examples/add-update-delete-cart";
import { SetCartCustomerInfo } from "@/examples/set-cart-customer-info";

export default function Home() {
  // return <ProductsByBestseller />;
  // return <ProductsByTeam />;
  // return <ProductsByPlayer />;
  // return <AddUpdateDeleteCart />
  return <SetCartCustomerInfo />;
}

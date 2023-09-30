import type { Database } from "./db";

export type Subscription = Database["public"]["Tables"]["subscriptions"]["Row"];
export type Product = Database["public"]["Tables"]["products"]["Row"];
export type Price = Database["public"]["Tables"]["prices"]["Row"];

export interface ProductWithPrices extends Product {
  prices: Price[];
}
export interface PriceWithProduct extends Price {
  products: Product | null;
}
export interface SubscriptionWithProduct extends Subscription {
  prices: PriceWithProduct | null;
}

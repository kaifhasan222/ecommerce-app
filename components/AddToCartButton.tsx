// components/AddToCartButton.tsx
"use client";

import React from "react";
import { useCart } from "../context/CartContext";
import type { Product } from "../context/CartContext";
import { cartButton } from "@/styles/styles";

export default function AddToCartButton({ product }: { product: Product }) {
  const { cart, addToCart } = useCart();

  // check if product is already in cart
  const inCart = cart.some((item) => item.id === product.id);

  return (
    <button
      className={cartButton}
      onClick={() => !inCart && addToCart(product)}
      aria-label={`Add ${product.title} to cart`}
      disabled={inCart}
    >
      {inCart ? "Added" : "Add to Cart"}
    </button>
  );
}

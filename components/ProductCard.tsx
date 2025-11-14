// components/ProductCard.tsx
"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useCart, type Product } from "../context/CartContext";
import { ShoppingCart } from "lucide-react";
import {
  addToCartBtn,
  addToCartBtnDisabled,
  emptyCart,
  productCard,
  productImage,
  productImageContainer,
  productImageLoaded,
  productPrice,
  productTitle,
} from "@/styles/styles";
import { cx } from "@emotion/css";
import Image from "next/image";
import Tooltip from "./Tooltip";

export default function ProductCard({
  product,
  onAddToCart,
}: {
  product: Product;
  onAddToCart: (p: Product) => void;
}) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const imgRef = useRef<HTMLImageElement | null>(null);
  const { cart } = useCart();
  const inCart = cart.some((item) => item.id === product.id);
  useEffect(() => {
    if (!imgRef.current) return;
    let observer: IntersectionObserver | null = null;
    if ("IntersectionObserver" in window) {
      observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            if (imgRef.current && !imgRef.current.src) {
              imgRef.current.src = product.image;
            }
            observer?.disconnect();
          }
        },
        { rootMargin: "100px" }
      );
      observer.observe(imgRef.current);
    } else {
      imgRef.current.src = product.image;
    }
    return () => observer?.disconnect();
  }, [product.image]);

  return (
    <article className={productCard} role="article" aria-label={product.title}>
      <Link
        href={`/product/${product.id}`}
        className={productImageContainer}
        aria-label={`Open ${product.title}`}
      >
        {!imageLoaded && !imageError && <div className={emptyCart} />}
        <Image
          src={product.image}
          alt={product.title}
          width={100}
          height={100}
          className={cx({
            [productImage]: !imageLoaded,
            [productImageLoaded]: imageLoaded,
          })}
          onLoad={() => setImageLoaded(true)}
          onError={() => setImageError(true)}
        />
      </Link>

      <Tooltip text={product.title}>
        <h3 className={productTitle}>{product.title}</h3>
      </Tooltip>
      <p className={productPrice} aria-label={`Price: $${product.price}`}>
        ${product.price.toFixed(2)}
      </p>
      <button
        onClick={() => onAddToCart(product)}
        className={cx(addToCartBtn, { [addToCartBtnDisabled]: inCart })}
        aria-label={`Add ${product.title} to cart`}
        disabled={inCart}
      >
        <ShoppingCart size={16} />

        {inCart ? "Added" : "Add to Cart"}
      </button>
    </article>
  );
}

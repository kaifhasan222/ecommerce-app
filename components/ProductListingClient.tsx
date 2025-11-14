"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import type { Product } from "../context/CartContext";
import ProductCard from "./ProductCard";
import Filters from "./Filters";
import { useCart } from "../context/CartContext";
import CartDrawer from "./CartDrawer";
import ProductSkeleton from "./ProductSkeleton";
import {
  cartBadge,
  cartButton,
  clearFiltersBtn,
  contentWrapper,
  emptyCart,
  filterRotate,
  header,
  headerTitle,
  mainContent,
  productGrid,
  productListing,
  searchBar,
  searchInput,
} from "@/styles/styles";
import { ShoppingCart } from "lucide-react";
import Header from "./Header";
import Footer from "./Footer";

type Props = {
  initialProducts: Product[];
};

function useDebounce<T>(value: T, delay = 500) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return debounced;
}

export default function ProductListingClient({ initialProducts }: Props) {
  const [products, setProducts] = useState<Product[]>(initialProducts || []);
  const [loading, setLoading] = useState(
    !initialProducts || initialProducts.length === 0
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [priceRange, setPriceRange] = useState({ min: "", max: "" });
  const [isMobile, setIsMobile] = useState<boolean>(
    typeof window !== "undefined" ? window.innerWidth < 768 : false
  );
  const [visibleCount, setVisibleCount] = useState(12);

  const {  addToCart , cartOpen, setCartOpen } = useCart();

  const debouncedSearch = useDebounce(searchTerm, 500);

  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  useEffect(() => {
    if (initialProducts && initialProducts.length > 0) return;
    let mounted = true;
    const fetchClient = async () => {
      setLoading(true);
      try {
        const res = await fetch("https://fakestoreapi.com/products");
        const data: Product[] = await res.json();
        if (mounted) setProducts(data);
      } catch {
        // ignore
      } finally {
        if (mounted) setLoading(false);
      }
    };
    fetchClient();
    return () => {
      mounted = false;
    };
  }, [initialProducts]);

  const categories = useMemo(
    () => [...new Set(products.map((p) => p.category))],
    [products]
  );

  const filtered = useMemo(() => {
    const s = debouncedSearch.toLowerCase().trim();
    return products.filter((p) => {
      const matchesSearch = !s || p.title.toLowerCase().includes(s);
      const matchesCategory =
        !selectedCategory || p.category === selectedCategory;
      const matchesPrice =
        (!priceRange.min || p.price >= parseFloat(priceRange.min)) &&
        (!priceRange.max || p.price <= parseFloat(priceRange.max));
      return matchesSearch && matchesCategory && matchesPrice;
    });
  }, [products, debouncedSearch, selectedCategory, priceRange]);

  // infinite scroll using container scroll
  const containerRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const onScroll = () => {
      if (el.scrollTop + el.clientHeight >= el.scrollHeight - 300) {
        setVisibleCount((v) => Math.min(filtered.length, v + 8));
      }
    };
    el.addEventListener("scroll", onScroll);
    return () => el.removeEventListener("scroll", onScroll);
  }, [filtered.length]);

  useEffect(() => {
    setVisibleCount(12);
  }, [debouncedSearch, selectedCategory, priceRange]);

  const handleClearFilters = () => {
    setSelectedCategory("");
    setPriceRange({ min: "", max: "" });
    setSearchTerm("");
  };
  return (
    <div className="app">

      <main className={mainContent} role="main">
        <div className={searchBar}>
          <svg style={{ width: 18, height: 18 }} viewBox="0 0 24 24">
            <path
              fill="currentColor"
              d="M9.5 3a6.5 6.5 0 016.3 8.03l4.6 4.6-1.4 1.4-4.6-4.6A6.5 6.5 0 119.5 3m0 2A4.5 4.5 0 109.5 14a4.5 4.5 0 000-9z"
            />
          </svg>
          <input
            type="search"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            aria-label="Search products"
            className={searchInput}
          />
          <button
            className={clearFiltersBtn}
            onClick={handleClearFilters}
            aria-label="Clear filters"
          >
            Clear
          </button>
        </div>

        <div className={contentWrapper}>
          <Filters
            categories={categories}
            selectedCategory={selectedCategory}
            priceRange={priceRange}
            onCategoryChange={setSelectedCategory}
            onPriceChange={setPriceRange}
            isMobile={isMobile}
          />

          <section
            className={productListing}
            aria-label="Product list"
            ref={containerRef}
          >
            {loading ? (
              <div className={productGrid}>
                {Array.from({ length: 8 }).map((_, i) => (
                  <ProductSkeleton key={i} />
                ))}
              </div>
            ) : (
              <div className={productGrid}>
                {filtered.slice(0, visibleCount).map((p) => (
                  <div key={p.id}>
                    <ProductCard product={p} onAddToCart={addToCart} />
                  </div>
                ))}
              </div>
            )}

            {!loading && filtered.length === 0 && (
              <p className={emptyCart}>No products found</p>
            )}
          </section>
        </div>
      </main>
      <CartDrawer isOpen={cartOpen} onClose={() => setCartOpen(false)} />
    </div>
  );
}

"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ShoppingCart } from "lucide-react";
import {
  header,
  headerTitle,
  cartButton,
  cartBadge,
  nav,
  navLink,
  navLinkActive,
  pageChangeBanner,
} from "@/styles/styles";
import { useCart } from "@/context/CartContext";

type Props = {
  title?: string;
  cartCount?: number;
};

export default function Header({
  title = "E-Commerce Store",
  cartCount = 0,
}: Props) {
  const pathname = usePathname();
  const prevPathRef = useRef<string | null>(null);
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    // If prevPath exists and changed, show a tiny banner
    const prev = prevPathRef.current;
    if (prev !== null && prev !== pathname) {
      setShowBanner(true);
      const t = setTimeout(() => setShowBanner(false), 1600);
      return () => clearTimeout(t);
    }
    prevPathRef.current = pathname;
  }, [pathname]);

  const isActive = (path: string) => {
    // simple active check: pathname startsWith path (for root = '/')
    if (path === "/") return pathname === "/" || pathname === "";
    return pathname?.startsWith(path);
    };
    const { cart, setCartOpen, cartOpen } = useCart();

  return (
    <header className={header} role="banner">
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <h1 className={headerTitle}>{title}</h1>

        <nav className={nav} aria-label="Primary navigation">
          <Link
            href="/"
            className={`${navLink} ${isActive("/") ? navLinkActive : ""}`}
          >
            Home
          </Link>
          <Link
            href="/"
            className={`${navLink} ${isActive("/about") ? navLinkActive : ""}`}
          >
            About
          </Link>
        </nav>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <button
          onClick={() => setCartOpen(true)}
          className={cartButton}
          aria-label={`Shopping cart with ${cartCount} items`}
        >
          <ShoppingCart size={16} />
           {cart.length > 0 && <span className={cartBadge}>{cart.length}</span>}
        </button>
      </div>

      {showBanner && <div className={pageChangeBanner}>Page changed</div>}
    </header>
  );
}

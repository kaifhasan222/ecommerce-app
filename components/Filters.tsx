// components/Filters.tsx
"use client";

import React, { useEffect, useState } from "react";
import { Filter, ChevronDown } from "lucide-react";
import { cx } from "@emotion/css";
import {
  filterContent,
  filterGroup,
  filterHeading,
  filterInput,
  filterRotate,
  filters,
  filtersMobile,
  filterToggle,
  priceInputs,
} from "@/styles/styles";

type Props = {
  categories: string[];
  selectedCategory: string;
  priceRange: { min: string; max: string };
  onCategoryChange: (s: string) => void;
  onPriceChange: (v: { min: string; max: string }) => void;
  isMobile: boolean;
};

export default function Filters({
  categories,
  selectedCategory,
  priceRange,
  onCategoryChange,
  onPriceChange,
  isMobile,
}: Props) {
  const [isOpen, setIsOpen] = useState(!isMobile);

  useEffect(() => {
    setIsOpen(!isMobile);
  }, [isMobile]);

  return (
    <aside
      className={cx({
        [filters]: !isMobile,
        [filtersMobile]: isMobile,
      })}
      role="complementary"
      aria-label="Product filters"
    >
      {isMobile && (
        <button
          className={filterToggle}
          onClick={() => setIsOpen(!isOpen)}
          aria-expanded={isOpen}
        >
          <span style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <Filter size={18} />
            Filters
          </span>
          <ChevronDown size={18} className={isOpen ? filterRotate : ""} />
        </button>
      )}

      <div className={cx({ [filterContent]: isOpen })}>
        {isOpen && (
          <>
            <div className={filterGroup}>
              <h3 className={filterHeading}>Category</h3>
              <select
                value={selectedCategory}
                onChange={(e) => onCategoryChange(e.target.value)}
                aria-label="Filter by category"
                className={filterInput}
              >
                <option value="">All Categories</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div className={filterGroup}>
              <h3>Price Range</h3>
              <div className={priceInputs}>
                <input
                  type="number"
                  placeholder="Min"
                  value={priceRange.min}
                  onChange={(e) =>
                    onPriceChange({ ...priceRange, min: e.target.value })
                  }
                  aria-label="Minimum price"
                  className={filterInput}
                />
                <span>-</span>
                <input
                  type="number"
                  placeholder="Max"
                  value={priceRange.max}
                  onChange={(e) =>
                    onPriceChange({ ...priceRange, max: e.target.value })
                  }
                  aria-label="Maximum price"
                  className={filterInput}
                />
              </div>
            </div>
          </>
        )}
      </div>
    </aside>
  );
}

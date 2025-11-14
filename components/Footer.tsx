"use client";

import { footerContainer, footerText } from "@/styles/styles";

export default function Footer() {
  return (
    <footer className={footerContainer} role="contentinfo">
      <div className={footerText}>
        © {new Date().getFullYear()} My E-Commerce Store. All rights reserved.
      </div>
    </footer>
  );
}

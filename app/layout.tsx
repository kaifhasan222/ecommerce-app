import "./globals";
import { CartProvider } from "../context/CartContext";

export const metadata = {
  title: "Ecommerce App",
  description: "Next.js App Router E-commerce Demo",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <CartProvider>{children}</CartProvider>
      </body>
    </html>
  );
}

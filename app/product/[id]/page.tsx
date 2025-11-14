// app/product/[id]/page.tsx
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { Product } from "@/context/CartContext";
import AddToCartButton from "@/components/AddToCartButton";
import {
  detailContainer,
  productDetail,
  detailLeft,
  detailImage,
  detailRight,
  detailCategory,
  detailPrice,
  detailDesc,
  buttonGroup,
  secondaryBtn,
  animatedDetail,
} from "@/styles/styles";

type Params = Promise<{ id: string }>;

async function fetchProduct(id: string): Promise<Product | null> {
  const res = await fetch(`https://fakestoreapi.com/products/${id}`, {
    next: { revalidate: 60 },
  });
  if (!res.ok) return null;
  return res.json();
}

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const { id } = await params;
  const product = await fetchProduct(id);
  if (!product) {
    return {
      title: "Product not found",
      description: "Product not found",
    };
  }
  return {
    title: `${product.title} — E-Commerce Store`,
    description: product.description,
    openGraph: {
      title: product.title,
      description: product.description,
      images: [{ url: product.image }],
    },
  };
}

export default async function ProductPage({ params }: { params: Params }) {
  const { id } = await params;
  const product = await fetchProduct(id);
  if (!product) return notFound();

  return (
    <div className={`app ${detailContainer}`}>
      <main className={`${productDetail} ${animatedDetail}`}>
        <div className={detailLeft}>
          <img
            src={product.image}
            alt={product.title}
            className={detailImage}
          />
        </div>

        <div className={detailRight}>
          <h1>{product.title}</h1>
          <p className={detailCategory}>{product.category}</p>
          <p className={detailPrice}>${product.price.toFixed(2)}</p>
          <p className={detailDesc}>{product.description}</p>

          <div className={buttonGroup}>
            <AddToCartButton product={product} />
            <Link href="/">
              <button className={secondaryBtn}>Back to listing</button>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}

// app/page.tsx
import ProductListingClient from '@/components/ProductListingClient'
import type { Product } from '../context/CartContext'

async function fetchProducts(): Promise<Product[]> {
  const res = await fetch('https://fakestoreapi.com/products', { next: { revalidate: 60 } })
  if (!res.ok) return []
  return res.json()
}

export default async function HomePage() {
  const initialProducts = await fetchProducts()
  return <ProductListingClient initialProducts={initialProducts} />
}

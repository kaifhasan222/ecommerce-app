// components/ProductSkeleton.tsx
'use client'

import { skeleton, skeletonButton, skeletonImage, skeletonText, skeletonTextShort } from "@/styles/styles"

export default function ProductSkeleton() {
  return (
    <div className={skeleton}>
      <div className={skeletonImage} />
      <div className={skeletonText} />
      <div className={skeletonTextShort} />
      <div className={skeletonButton} />
    </div>
  )
}

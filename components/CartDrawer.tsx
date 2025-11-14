// components/CartDrawer.tsx
'use client'

import React, { useState } from 'react'
import { X, Minus, Plus, Trash2, Loader } from 'lucide-react'
import { useCart } from '../context/CartContext'
import { cx } from '@emotion/css';
import { cartDrawer, cartDrawerOpen, cartFooter, cartHeader, cartItem, cartItemDetails, cartItems, cartItemTitle, cartOverlay, cartOverlayOpen, cartTotal, checkoutBtn, checkoutBtnDisabled, checkoutError, checkoutSuccess, emptyCart, quantityButton, quantityControls, removeBtn, spin, spinAnimation } from '@/styles/styles';
import Image from 'next/image';

export default function CartDrawer({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const { cart, removeFromCart, updateQuantity, calculateTotal, clearCart } = useCart()
  const [isCheckingOut, setIsCheckingOut] = useState(false)
  const [checkoutStatus, setCheckoutStatus] = useState<'success' | 'error' | null>(null)

  const handleCheckout = async () => {
    setIsCheckingOut(true)
    setCheckoutStatus(null)
    try {
      const response = await fetch('https://fakestoreapi.com/carts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: 1,
          date: new Date().toISOString(),
          products: cart.map(item => ({ productId: item.id, quantity: item.quantity }))
        })
      })
      if (!response.ok) throw new Error('Checkout failed')
      setCheckoutStatus('success')
      setTimeout(() => {
        clearCart()
        onClose()
        setCheckoutStatus(null)
      }, 1200)
    } catch {
      setCheckoutStatus('error')
    } finally {
      setIsCheckingOut(false)
    }
  }

  return (
    <>
      <div  className={cx(cartOverlay,{[cartOverlayOpen]:isOpen}) } onClick={onClose} />
      <div  className={cx(cartDrawer,{[cartDrawerOpen]:isOpen}) } role="dialog" aria-label="Shopping cart">
        <div className={cartHeader}>
          <h2>Shopping Cart ({cart.length})</h2>
          <button onClick={onClose} aria-label="Close cart">
            <X size={24} />
          </button>
        </div>

        <div className={cartItems}>
          {cart.length === 0 ? (
            <p className={emptyCart}>Your cart is empty</p>
          ) : (
            cart.map(item => (
              <div key={item.id} className={cartItem}>
                <Image src={item.image} alt={item.title} width={50} height={50} />
                <div className={cartItemDetails}>
                  <h4  className={cartItemTitle}>{item.title}</h4>
                  <p>${item.price.toFixed(2)}</p>
                  <div className={quantityControls}>
                            <button onClick={() => updateQuantity(item.id, -1)} aria-label="Decrease quantity" className={ quantityButton}>
                      <Minus size={16} />
                    </button>
                    <span>{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.id, 1)} aria-label="Increase quantity" className={ quantityButton}>
                      <Plus size={16} />
                    </button>
                    <button onClick={() => removeFromCart(item.id)} className={removeBtn} aria-label="Remove item">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {cart.length > 0 && (
          <div className={cartFooter}>
            <div className={cartTotal}>
              <strong>Total:</strong>
              <strong>${calculateTotal.toFixed(2)}</strong>
            </div>
            <button onClick={handleCheckout} disabled={isCheckingOut} className={checkoutBtn}>
              {isCheckingOut ? <Loader className={spinAnimation} size={18} /> : 'Checkout'}
            </button>

            {checkoutStatus === 'success' && <p className={checkoutSuccess}>Order placed successfully!</p>}
            {checkoutStatus === 'error' && <p className={checkoutError}>Checkout failed. Please try again.</p>}
          </div>
        )}
      </div>
    </>
  )
}

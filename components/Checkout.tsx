'use client';

import React, { useState } from 'react';
import axios from 'axios';
import { useCart } from '../context/CartContext';
import { checkoutBtnDisabled } from '@/styles/styles';

export default function Checkout() {
  const { items, total, clear } = useCart() as any;
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const doCheckout = async () => {
    setLoading(true); setMessage(null);
    try {
      const res = await axios.post('/api/checkout', { items, total });
      setMessage(`Order placed: ${res.data.orderId}`);
      clear();
    } catch (e: any) {
      setMessage(e?.response?.data?.message || 'Checkout failed');
    } finally { setLoading(false); }
  };

  return (
    <div style={{ padding: '1rem' }}>
      <h3>Checkout</h3>
      <p>Total: ₹{total.toFixed(0)}</p>
      <button className={checkoutBtnDisabled} onClick={doCheckout} disabled={loading || items.length === 0}>
        {loading ? 'Processing...' : 'Place order'}
      </button>
      {message && <div role="status" style={{ marginTop: 8 }}>{message}</div>}
    </div>
  );
}

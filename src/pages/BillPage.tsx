import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState } from '../store';
import { clearOrder } from '../store/slices/orderSlice';
import { clearCart } from '../store/slices/cartSlice';
import { formatInr } from '../utils/currency';

const BillPage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const { currentOrder: order } = useSelector((state: RootState) => state.order);
  const [isPaid, setIsPaid] = useState(false);

  useEffect(() => {
    if (!order) {
      navigate('/');
    }
  }, [navigate, order]);

  const handlePay = () => {
    setIsPaid(true);
    setTimeout(() => {
      dispatch(clearOrder());
      dispatch(clearCart());
    }, 2000);
  };

  if (!order) return null;

  if (isPaid) {
    return (
      <div className="animate-scale-in" style={{ 
        padding: '32px', 
        minHeight: '100vh', 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        justifyContent: 'center',
        textAlign: 'center',
        background: 'white'
      }}>
        <div style={{ 
          width: '100px', 
          height: '100px', 
          background: '#00C897', 
          borderRadius: '35%', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          color: 'white',
          fontSize: '3rem',
          marginBottom: '24px',
          boxShadow: '0 20px 40px rgba(0, 200, 151, 0.2)',
          transform: 'rotate(-5deg)'
        }}>
          ✓
        </div>
        <h2 style={{ fontSize: '1.8rem', fontWeight: '800', marginBottom: '12px' }}>Payment Successful!</h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', marginBottom: '40px', lineHeight: '1.6' }}>
          Thank you for dining with us, <br /><strong style={{ color: 'var(--text)' }}>{order.customerName}</strong>!<br />
          Your receipt has been submitted.
        </p>
        <button className="btn-primary" onClick={() => navigate('/')}>
          Place a New Order
        </button>
      </div>
    );
  }

  const tax = order.total * 0.05;
  const grandTotal = order.total + tax;

  return (
    <div className="animate-slide-up" style={{ 
      padding: '24px', 
      minHeight: '100vh', 
      display: 'flex', 
      flexDirection: 'column',
      background: 'white'
    }}>
      <header style={{ marginBottom: '32px', textAlign: 'center' }}>
        <div onClick={() => navigate('/status')} style={{ position: 'absolute', left: '24px', cursor: 'pointer', fontSize: '1.2rem' }}>←</div>
        <h2 style={{ fontSize: '1.5rem', fontWeight: '800' }}>Final <span style={{ color: 'var(--primary)' }}>Invoice</span></h2>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Table {order.tableId} • {new Date().toLocaleDateString()}</p>
      </header>

      <div className="glass-card" style={{ marginBottom: '32px', padding: '24px', background: '#F8F9FA', border: 'none' }}>
        <h4 style={{ fontSize: '1rem', fontWeight: '700', marginBottom: '20px', textTransform: 'uppercase', letterSpacing: '1px' }}>Order Details</h4>
        <div style={{ display: 'grid', gap: '12px' }}>
          {order.items.map((item: any, idx: number) => (
            <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.95rem' }}>
              <span style={{ color: 'var(--text-muted)' }}>{item.quantity}x <span style={{ color: 'var(--text)', fontWeight: '600' }}>{item.name}</span></span>
              <span style={{ fontWeight: '700' }}>{formatInr(item.price * item.quantity)}</span>
            </div>
          ))}
          <div style={{ borderTop: '1px dashed #DDD', marginTop: '16px', paddingTop: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.95rem', marginBottom: '8px' }}>
              <span style={{ color: 'var(--text-muted)' }}>Subtotal</span>
              <span style={{ fontWeight: '600' }}>{formatInr(order.total)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.95rem', marginBottom: '16px' }}>
              <span style={{ color: 'var(--text-muted)' }}>Service Tax (5%)</span>
              <span style={{ fontWeight: '600' }}>{formatInr(tax)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontWeight: '700', fontSize: '1.1rem' }}>Total Amount</span>
              <span style={{ fontSize: '1.5rem', fontWeight: '800', color: 'var(--primary)' }}>{formatInr(grandTotal)}</span>
            </div>
          </div>
        </div>
      </div>

      <div style={{ flex: 1 }}>
        <h4 style={{ fontSize: '1rem', fontWeight: '700', marginBottom: '16px', textTransform: 'uppercase', letterSpacing: '1px' }}>Payment Method</h4>
        <div style={{ display: 'grid', gap: '12px' }}>
          <button 
            className="animate-scale-in"
            onClick={() => handlePay()}
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '16px', 
              width: '100%', 
              textAlign: 'left',
              padding: '20px',
              borderRadius: '20px',
              border: '2px solid #F0F0F0',
              background: 'white',
              cursor: 'pointer',
              transition: 'all 0.3s ease'
            }}
          >
            <div style={{ fontSize: '2rem', background: '#F0F9FF', padding: '10px', borderRadius: '15px' }}>📱</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: '700', fontSize: '1rem' }}>Instant QR Pay</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Google Pay, Apple Pay, Cards</div>
            </div>
            <div style={{ color: '#DDD' }}>→</div>
          </button>

          <button 
            className="animate-scale-in"
            onClick={() => handlePay()}
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '16px', 
              width: '100%', 
              textAlign: 'left',
              padding: '20px',
              borderRadius: '20px',
              border: '2px solid #F0F0F0',
              background: 'white',
              cursor: 'pointer',
              transition: 'all 0.3s ease'
            }}
          >
            <div style={{ fontSize: '2rem', background: '#F0FFF7', padding: '10px', borderRadius: '15px' }}>💰</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: '700', fontSize: '1rem' }}>Pay at Counter</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Pay in person with cash/card</div>
            </div>
            <div style={{ color: '#DDD' }}>→</div>
          </button>
        </div>
      </div>

      <div style={{ padding: '24px 0', textAlign: 'center' }}>
        <p style={{ fontSize: '0.85rem', color: '#BBB' }}>
          Thank you for dining with iOrder!
        </p>
      </div>
    </div>
  );
};

export default BillPage;

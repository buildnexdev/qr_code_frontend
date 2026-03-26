import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState } from '../store';
import { updateProgress } from '../store/slices/orderSlice';
import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

const OrderStatusPage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const { currentOrder: order, progress } = useSelector((state: RootState) => state.order);

  useEffect(() => {
    if (!order) {
      navigate('/');
      return;
    }

    const pollStatus = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/orders`);
        const latestOrder = res.data.find((o: any) => o.id === order.id);
        if (latestOrder && latestOrder.status === 'Served') {
          dispatch(updateProgress({ progress: 100, statusText: 'Your meal is served!' }));
        } else if (progress < 95) {
          // Keep a slow "preparing" progress for visual appeal, but cap it at 95 until Served
          dispatch(updateProgress({ progress: progress + 1, statusText: 'Preparing your meal...' }));
        }
      } catch (error) {
        console.error('Error polling status:', error);
      }
    };

    const interval = setInterval(pollStatus, 3000);
    return () => clearInterval(interval);
  }, [dispatch, navigate, order, progress]);

  if (!order) return null;

  return (
    <div className="animate-slide-up" style={{ 
      padding: '24px', 
      minHeight: '100vh', 
      display: 'flex', 
      flexDirection: 'column',
      background: 'white'
    }}>
      <header style={{ marginBottom: '40px', textAlign: 'center' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '4px' }}>Order <span style={{ color: 'var(--primary)' }}>#1234</span></h2>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Table {order.tableId} • {order.customerName}</p>
      </header>

      <div className="glass-card" style={{ textAlign: 'center', marginBottom: '32px', border: 'none', background: '#F8F9FA' }}>
        <div style={{ position: 'relative', width: '160px', height: '160px', margin: '0 auto 24px' }}>
          <svg style={{ transform: 'rotate(-90deg)', width: '100%', height: '100%' }}>
            <circle cx="80" cy="80" r="70" fill="none" stroke="#EFEFEF" strokeWidth="8" />
            <circle cx="80" cy="80" r="70" fill="none" stroke="url(#statusGradient)" strokeWidth="8" 
              strokeDasharray="440" 
              strokeDashoffset={440 - (440 * progress) / 100}
              strokeLinecap="round"
              style={{ transition: 'stroke-dashoffset 0.5s ease' }}
            />
            <defs>
              <linearGradient id="statusGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FF3D68" />
                <stop offset="100%" stopColor="#FF8E53" />
              </linearGradient>
            </defs>
          </svg>
          <div style={{ 
            position: 'absolute', 
            top: '50%', 
            left: '50%', 
            transform: 'translate(-50%, -50%)',
            fontSize: '1.8rem',
            fontWeight: '800',
            color: 'var(--text)'
          }}>
            {progress}%
          </div>
        </div>
        <h3 style={{ fontSize: '1.25rem', fontWeight: '700', marginBottom: '8px', color: 'var(--primary)' }}>{order.status}</h3>
        <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>We're crafting your perfect meal.</p>
      </div>

      <div style={{ flex: 1 }}>
        <h4 style={{ fontSize: '1rem', fontWeight: '700', marginBottom: '16px', textTransform: 'uppercase', letterSpacing: '1px' }}>Your Selection</h4>
        <div style={{ background: '#F9F9F9', borderRadius: '16px', padding: '16px', display: 'grid', gap: '12px' }}>
          {order.items.map((item: any, idx: number) => (
            <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '8px', overflow: 'hidden' }}>
                  <img src={item.image} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
                <div>
                  <div style={{ fontSize: '0.9rem', fontWeight: '600' }}>{item.quantity}x {item.name}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>${item.price.toFixed(2)} each</div>
                </div>
              </div>
              <div style={{ fontWeight: '700', fontSize: '0.95rem' }}>${(item.price * item.quantity).toFixed(2)}</div>
            </div>
          ))}
          <div style={{ marginTop: '12px', paddingTop: '12px', borderTop: '1px solid #EEE', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontWeight: '700', fontSize: '1.1rem' }}>Total</span>
            <span style={{ fontSize: '1.2rem', fontWeight: '800', color: 'var(--primary)' }}>${order.total.toFixed(2)}</span>
          </div>
        </div>
      </div>

      <div style={{ marginTop: '30px' }}>
        <button 
          onClick={() => navigate('/bill')} 
          disabled={progress < 100}
          className="btn-primary" 
          style={{ 
            opacity: progress < 100 ? 0.6 : 1,
            cursor: progress < 100 ? 'not-allowed' : 'pointer'
          }}
        >
          {progress < 100 ? 'Awaiting Service...' : 'Finalize & Get Bill →'}
        </button>
      </div>
    </div>
  );
};

export default OrderStatusPage;

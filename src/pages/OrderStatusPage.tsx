import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState } from '../store';
import { updateProgress, setOrderStatus } from '../store/slices/orderSlice';
import axios from 'axios';
import { formatInr } from '../utils/currency';

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
        
        if (latestOrder) {
          // Sync backend status to Redux
          if (latestOrder.status !== order.status) {
            dispatch(setOrderStatus(latestOrder.status));
          }

          // Map status to progress for a better UX
          let targetProgress = progress;
          let statusText = progress < 95 ? 'Preparing your meal...' : 'Finishing touches...';

          switch (latestOrder.status) {
            case 'Pending':
              targetProgress = Math.max(progress, 15);
              statusText = 'Order received by kitchen';
              break;
            case 'Preparing':
              targetProgress = Math.max(progress, 55);
              statusText = 'Chef is preparing your meal';
              break;
            case 'Ready':
              targetProgress = Math.max(progress, 90);
              statusText = 'Order is ready to serve!';
              break;
            case 'Served':
              targetProgress = 100;
              statusText = 'Your meal is served!';
              break;
          }

          if (targetProgress !== progress) {
            dispatch(updateProgress({ progress: targetProgress, statusText }));
          }
        }
      } catch (error) {
        console.error('Error polling status:', error);
      }
    };

    const interval = setInterval(pollStatus, 3000);
    return () => clearInterval(interval);
  }, [dispatch, navigate, order, progress]);

  if (!order) return null;

  // Defensive values for UI
  const orderId = order.id ? order.id.toString().slice(-4) : '....';
  const tableId = order.tableId || 'General';
  const customerName = order.customerName || 'Guest';
  const totalAmount = Number(order.total || 0);

  return (
    <div className="animate-slide-up" style={{ 
      padding: '24px', 
      minHeight: '100vh', 
      display: 'flex', 
      flexDirection: 'column',
      background: 'white'
    }}>
      <header style={{ marginBottom: '40px', textAlign: 'center' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '4px' }}>Order <span style={{ color: 'var(--primary)' }}>#{orderId}</span></h2>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Table {tableId} • {customerName}</p>
      </header>

      {/* ... previous progress circle code ... */}
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
        <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>{progress >= 100 ? 'Enjoy your meal!' : 'We\'re crafting your perfect meal.'}</p>
      </div>

      <div style={{ flex: 1 }}>
        <h4 style={{ fontSize: '1rem', fontWeight: '700', marginBottom: '16px', textTransform: 'uppercase', letterSpacing: '1px' }}>Your Selection</h4>
        <div style={{ background: '#F9F9F9', borderRadius: '16px', padding: '16px', display: 'grid', gap: '12px' }}>
          {(order.items || []).map((item: any, idx: number) => (
            <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '8px', overflow: 'hidden', background: '#EEE', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <img src={item.image} alt={item.name} style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} />
                </div>
                <div>
                  <div style={{ fontSize: '0.9rem', fontWeight: '600' }}>{item.quantity}x {item.name}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{formatInr(item.price)} each</div>
                </div>
              </div>
              <div style={{ fontWeight: '700', fontSize: '0.95rem' }}>{formatInr(item.price * item.quantity)}</div>
            </div>
          ))}
          <div style={{ marginTop: '12px', paddingTop: '12px', borderTop: '1px solid #EEE', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontWeight: '700', fontSize: '1.1rem' }}>Total</span>
            <span style={{ fontSize: '1.2rem', fontWeight: '800', color: 'var(--primary)' }}>{formatInr(totalAmount)}</span>
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

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState } from '../store';
import { addToCart, removeFromCart } from '../store/slices/cartSlice';
import { submitOrder } from '../store/slices/orderSlice';
import { fetchMenu } from '../store/slices/menuSlice';
import type { AppDispatch } from '../store';
import { formatInr } from '../utils/currency';

const MENU_IMG_FALLBACK =
  'https://images.unsplash.com/photo-1493770348161-369560ae357d?w=800&q=80';

const MenuPage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  
  const { items: menuItems, categories, loading: menuLoading } = useSelector((state: RootState) => state.menu);
  const cartItems = useSelector((state: RootState) => state.cart.items);
  const { totalAmount: totalPrice, totalQuantity: totalItems } = useSelector((state: RootState) => state.cart);
  const { name: customerName, tableId, partySize } = useSelector((state: RootState) => state.user);

  const [activeCategory, setActiveCategory] = useState('All');

  useEffect(() => {
    if (!customerName) {
      navigate('/');
    }
    dispatch(fetchMenu());
  }, [customerName, navigate, dispatch]);

  const cartMap = cartItems.reduce((acc, item) => ({ ...acc, [item.id]: item.quantity }), {} as { [key: number]: number });

  const filteredFoods =
    activeCategory === 'All'
      ? menuItems
      : menuItems.filter((f) => f.category === activeCategory);

  const handleSubmitOrder = () => {
    if (totalItems === 0) return;
    
    const label =
      partySize > 1 ? `${customerName} (${partySize} guests)` : customerName;

    const order = {
      customerName: label,
      tableId,
      items: cartItems,
      total: totalPrice,
      status: 'Preparing',
      timestamp: new Date().toISOString()
    };

    dispatch(submitOrder(order));
    navigate('/status');
  };

  return (
    <div className="animate-slide-up" style={{ 
      background: 'white', 
      minHeight: '100vh',
      paddingTop: '80px',
      paddingBottom: '120px'
    }}>
      {/* Sticky Header */}
      <header style={{ 
        position: 'fixed', 
        top: 0, 
        left: 0, 
        right: 0, 
        background: 'rgba(255, 255, 255, 0.9)', 
        backdropFilter: 'blur(10px)',
        zIndex: 1000,
        padding: '16px 20px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottom: '1px solid #EEE'
      }}>
        <div onClick={() => navigate('/')} style={{ cursor: 'pointer', fontSize: '1.2rem' }}>←</div>
        <div style={{ textAlign: 'center' }}>
          <h2 style={{ fontSize: '1.1rem', fontWeight: '700' }}>Table {tableId}</h2>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            {partySize} guest{partySize !== 1 ? 's' : ''} · {customerName}
          </p>
        </div>
        <div style={{ width: '24px' }}></div>
      </header>

      {/* Category Pills */}
      <div style={{ 
        display: 'flex', 
        gap: '10px', 
        overflowX: 'auto', 
        padding: '10px 20px',
        marginBottom: '20px',
        scrollbarWidth: 'none'
      }}>
        {categories.map(cat => (
          <button 
            key={cat}
            onClick={() => setActiveCategory(cat)}
            style={{ 
              padding: '8px 20px', 
              borderRadius: '20px',
              whiteSpace: 'nowrap',
              fontSize: '0.9rem',
              fontWeight: '600',
              background: activeCategory === cat ? 'var(--primary)' : '#F5F5F5',
              color: activeCategory === cat ? 'white' : 'var(--text-muted)',
              transition: 'all 0.3s ease'
            }}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Food Grid */}
      <div style={{ padding: '0 20px', display: 'grid', gap: '24px' }}>
        {menuLoading ? (
          <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>Loading menu…</div>
        ) : filteredFoods.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '48px 20px', color: 'var(--text-muted)' }}>
            <p style={{ fontSize: '1.05rem', marginBottom: '8px', color: 'var(--text)' }}>No dishes available</p>
            <p style={{ fontSize: '0.9rem' }}>
              The restaurant has not published menu items yet, or everything is marked unavailable in admin.
            </p>
          </div>
        ) : (
          filteredFoods.map((food) => (
          <div key={food.id} className="animate-scale-in" style={{
            display: 'flex',
            flexDirection: 'column',
            borderRadius: '20px',
            overflow: 'hidden',
            background: 'white',
            border: '1px solid #F0F0F0',
            boxShadow: '0 4px 15px rgba(0,0,0,0.03)'
          }}>
            <div
              style={{
                position: 'relative',
                width: '100%',
                minHeight: '200px',
                height: 'min(48vw, 280px)',
                background: '#F2F2F2',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <img
                src={food.image?.trim() ? food.image : MENU_IMG_FALLBACK}
                alt={food.name}
                style={{
                  maxWidth: '100%',
                  maxHeight: '100%',
                  width: 'auto',
                  height: 'auto',
                  objectFit: 'contain',
                  display: 'block',
                }}
                onError={(e) => {
                  (e.target as HTMLImageElement).src = MENU_IMG_FALLBACK;
                }}
              />
              <div
                style={{
                  position: 'absolute',
                  bottom: '12px',
                  right: '12px',
                  background: 'rgba(255,255,255,0.95)',
                  padding: '6px 12px',
                  borderRadius: '12px',
                  fontWeight: '700',
                  color: 'var(--primary)',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                }}
              >
                {formatInr(food.price)}
              </div>
            </div>
            <div style={{ padding: '16px' }}>
              <h3 style={{ fontSize: '1.1rem', marginBottom: '6px' }}>{food.name}</h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '16px' }}>{food.description}</p>
              
              <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '15px' }}>
                {cartMap[food.id] > 0 ? (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', background: '#F5F5F5', padding: '4px', borderRadius: '25px' }}>
                    <button 
                      onClick={() => dispatch(removeFromCart(food.id))}
                      style={{ width: '30px', height: '30px', borderRadius: '50%', background: 'white', fontWeight: '700', boxShadow: '0 2px 5px rgba(0,0,0,0.1)' }}
                    >
                      -
                    </button>
                    <span style={{ fontWeight: '700', minWidth: '20px', textAlign: 'center' }}>{cartMap[food.id]}</span>
                    <button 
                      onClick={() => dispatch(addToCart(food))}
                      style={{ width: '30px', height: '30px', borderRadius: '50%', background: 'var(--primary)', color: 'white', fontWeight: '700', boxShadow: '0 4px 8px rgba(255,61,104,0.3)' }}
                    >
                      +
                    </button>
                  </div>
                ) : (
                  <button 
                    onClick={() => dispatch(addToCart(food))}
                    className="btn-primary"
                    style={{ width: 'auto', padding: '10px 20px', fontSize: '0.85rem' }}
                  >
                    Add to Cart
                  </button>
                )}
              </div>
            </div>
          </div>
          ))
        )}
      </div>

      {/* Floating Cart Button */}
      {totalItems > 0 && (
        <div className="animate-slide-up" style={{ 
          position: 'fixed', 
          bottom: '20px', 
          left: '20px', 
          right: '20px', 
          background: 'var(--gradient)',
          color: 'white',
          padding: '16px 24px',
          borderRadius: '24px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          boxShadow: '0 15px 40px rgba(255, 61, 104, 0.4)',
          zIndex: 1001,
          cursor: 'pointer'
        }} onClick={handleSubmitOrder}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ background: 'rgba(255,255,255,0.2)', padding: '8px 14px', borderRadius: '14px', fontWeight: '700' }}>
              {totalItems}
            </div>
            <div>
              <div style={{ fontSize: '0.75rem', opacity: 0.9 }}>Items selected</div>
              <div style={{ fontSize: '1.2rem', fontWeight: '700' }}>{formatInr(totalPrice)}</div>
            </div>
          </div>
          <div style={{ fontWeight: '700', letterSpacing: '1px' }}>
            CHECKOUT →
          </div>
        </div>
      )}
    </div>
  );
};

export default MenuPage;

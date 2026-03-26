import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState } from '../store';
import { setUser } from '../store/slices/userSlice';

const WelcomePage: React.FC = () => {
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.user);
  const [name, setName] = useState(user.name);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  const tableId = searchParams.get('table') || user.tableId;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      dispatch(setUser({ name: name.trim(), tableId }));
      navigate('/menu');
    }
  };

  return (
    <div className="animate-slide-up" style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      justifyContent: 'center', 
      minHeight: '100vh',
      padding: '24px',
      background: 'white',
      textAlign: 'center'
    }}>
      <div style={{ marginBottom: '40px', position: 'relative' }}>
        <div className="animate-scale-in" style={{
          width: '120px',
          height: '120px',
          background: 'var(--gradient)',
          borderRadius: '35%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 20px',
          boxShadow: '0 15px 35px rgba(255, 61, 104, 0.3)',
          transform: 'rotate(-5deg)'
        }}>
           <span style={{ fontSize: '3rem', color: 'white' }}>🍽️</span>
        </div>
        <h1 style={{ fontSize: '2.4rem', fontWeight: '700', lineHeight: '1.2', marginBottom: '8px' }}>
          iOrder <span style={{ color: 'var(--primary)' }}>Menu</span>
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem' }}>
          Sustainable & Digital Dining
        </p>
      </div>

      <div className="glass-card" style={{ width: '100%', maxWidth: '380px' }}>
        <div style={{ marginBottom: '24px' }}>
          <span style={{ 
            background: 'rgba(255, 61, 104, 0.1)', 
            color: 'var(--primary)', 
            padding: '6px 12px', 
            borderRadius: '20px', 
            fontSize: '0.85rem',
            fontWeight: '600',
            textTransform: 'uppercase'
          }}>
            Table: {tableId}
          </span>
        </div>

        <form onSubmit={handleSubmit} style={{ textAlign: 'left' }}>
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '10px', fontWeight: '500', color: 'var(--text-muted)' }}>
              What's your name?
            </label>
            <input 
              type="text" 
              className="input-field"
              placeholder="e.g. Alex Johnson"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          
          <button type="submit" className="btn-primary">
            Explore Menu
          </button>
        </form>
      </div>

      <div style={{ marginTop: 'auto', padding: '40px 0 20px' }}>
        <p style={{ fontSize: '0.9rem', color: '#AAA' }}>
          Step 1 of 4 • Secure Ordering
        </p>
      </div>
    </div>
  );
};

export default WelcomePage;

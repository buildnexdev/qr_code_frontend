import React, { useState, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState } from '../store';
import { setUser } from '../store/slices/userSlice';

const WelcomePage: React.FC = () => {
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.user);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  /** QR from Tables page uses `?tableId=123`; support legacy `?table=` */
  const tableFromQr = useMemo(() => {
    const tid = searchParams.get('tableId') || searchParams.get('table');
    if (tid != null && String(tid).trim() !== '') return String(tid).trim();
    return user.tableId || 'General';
  }, [searchParams, user.tableId]);

  const [partySize, setPartySize] = useState(
    user.partySize >= 1 ? user.partySize : 1
  );
  const [name, setName] = useState(user.name);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const guests = Math.min(99, Math.max(1, Math.floor(Number(partySize)) || 1));
    if (!name.trim()) return;
    dispatch(
      setUser({
        name: name.trim(),
        tableId: tableFromQr,
        partySize: guests,
      })
    );
    navigate('/menu');
  };

  return (
    <div
      className="animate-slide-up"
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        padding: '24px',
        background: 'white',
        textAlign: 'center',
      }}
    >
      <div style={{ marginBottom: '40px', position: 'relative' }}>
        <div
          className="animate-scale-in"
          style={{
            width: '120px',
            height: '120px',
            background: 'var(--gradient)',
            borderRadius: '35%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 20px',
            boxShadow: '0 15px 35px rgba(255, 61, 104, 0.3)',
            transform: 'rotate(-5deg)',
          }}
        >
          <span
            style={{
              fontSize: '2.25rem',
              fontWeight: 800,
              color: 'white',
              letterSpacing: '-0.04em',
              fontFamily: 'system-ui, sans-serif',
            }}
          >
            QR
          </span>
        </div>
        <h1 style={{ fontSize: '2.4rem', fontWeight: '700', lineHeight: '1.2', marginBottom: '8px' }}>
          QR Order <span style={{ color: 'var(--primary)' }}>Menu</span>
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem' }}>
          Scan, order, and pay from your table
        </p>
      </div>

      <div className="glass-card" style={{ width: '100%', maxWidth: '380px' }}>
        <div style={{ marginBottom: '24px' }}>
          <span
            style={{
              background: 'rgba(255, 61, 104, 0.1)',
              color: 'var(--primary)',
              padding: '6px 12px',
              borderRadius: '20px',
              fontSize: '0.85rem',
              fontWeight: '600',
              textTransform: 'uppercase',
            }}
          >
            Table: {tableFromQr}
          </span>
        </div>

        <form onSubmit={handleSubmit} style={{ textAlign: 'left' }}>
          <div style={{ marginBottom: '20px' }}>
            <label
              style={{
                display: 'block',
                marginBottom: '10px',
                fontWeight: '600',
                color: 'var(--text)',
              }}
            >
              1. How many guests?
            </label>
            <input
              type="number"
              min={1}
              max={99}
              className="input-field"
              inputMode="numeric"
              value={partySize}
              onChange={(e) => setPartySize(Number(e.target.value))}
              required
            />
            <p style={{ margin: '8px 0 0', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              Party size for this order
            </p>
          </div>

          <div style={{ marginBottom: '24px' }}>
            <label
              style={{
                display: 'block',
                marginBottom: '10px',
                fontWeight: '600',
                color: 'var(--text)',
              }}
            >
              2. Your name
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
            View menu &amp; choose meals
          </button>
        </form>
      </div>

      <div style={{ marginTop: 'auto', padding: '40px 0 20px' }}>
        <p style={{ fontSize: '0.9rem', color: '#AAA' }}>Step 1 of 2 • Menu loads from the restaurant</p>
      </div>
    </div>
  );
};

export default WelcomePage;

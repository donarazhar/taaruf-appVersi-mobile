import { useEffect, useState, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

function GoogleCallback() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const processed = useRef(false);

  useEffect(() => {
    // Handle redirect from API with token in URL params
    const token = searchParams.get('token');
    const userParam = searchParams.get('user');
    const isAdmin = searchParams.get('is_admin');
    const role = searchParams.get('role');
    const errorParam = searchParams.get('error');

    if (errorParam) {
      setError(decodeURIComponent(errorParam));
      setLoading(false);
      return;
    }

    if (!token) {
      setError('Token tidak ditemukan');
      setLoading(false);
      return;
    }

    if (processed.current) return;
    processed.current = true;

    try {
      // Parse user data from URL
      const user = userParam ? JSON.parse(decodeURIComponent(userParam)) : null;

      // Save to localStorage
      localStorage.setItem('token', token);
      if (user) {
        localStorage.setItem('user', JSON.stringify(user));
      }
      localStorage.setItem('is_admin', isAdmin === 'true');
      localStorage.setItem('role', role || 'karyawan');

      // Redirect based on role
      if (isAdmin === 'true' || role === 'super_admin') {
        navigate('/admin/dashboard');
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      setError('Gagal memproses data login');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [searchParams, navigate]);

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '16px'
      }}>
        <div style={{
          width: '40px',
          height: '40px',
          border: '3px solid #E5E7EB',
          borderTopColor: '#0053C5',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite'
        }}></div>
        <p style={{ color: '#6B7280' }}>Memproses login Google...</p>
        <style>{`
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '16px',
        padding: '20px'
      }}>
        <div style={{
          background: '#FEF2F2',
          color: '#DC2626',
          padding: '16px 24px',
          borderRadius: '8px',
          textAlign: 'center'
        }}>
          <p>⚠️ {error}</p>
        </div>
        <button
          onClick={() => navigate('/login')}
          style={{
            padding: '12px 24px',
            background: '#0053C5',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer'
          }}
        >
          Kembali ke Login
        </button>
      </div>
    );
  }

  return null;
}

export default GoogleCallback;


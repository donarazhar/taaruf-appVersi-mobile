import { useEffect, useState, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

function GoogleCallback() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const processed = useRef(false);

  useEffect(() => {
    const code = searchParams.get('code');
    
    if (!code) {
      setError('Kode otorisasi tidak ditemukan');
      setLoading(false);
      return;
    }

    if (processed.current) return;
    processed.current = true;

    // Kirim code ke backend
    const handleCallback = async () => {
      try {
        const response = await fetch(`http://localhost:8000/api/auth/google/callback?code=${code}`, {
          method: 'GET',
          headers: {
            'Accept': 'application/json'
          }
        });

        const data = await response.json();

        if (data.status === 'success') {
          // Login berhasil
          localStorage.setItem('token', data.token);
          localStorage.setItem('user', JSON.stringify(data.user));
          localStorage.setItem('is_admin', data.is_admin || false);
          localStorage.setItem('role', data.role || 'karyawan');
          
          if (data.is_admin || data.role === 'super_admin') {
            navigate('/admin/dashboard');
          } else {
            navigate('/dashboard');
          }
        } else if (data.status === 'pending') {
          // Akun pending approval
          navigate('/login', { 
            state: { message: data.message, type: 'info' } 
          });
        } else {
          setError(data.message || 'Gagal login dengan Google');
        }
      } catch (err) {
        setError('Terjadi kesalahan saat memproses login');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    handleCallback();
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

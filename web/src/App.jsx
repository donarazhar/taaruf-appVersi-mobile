import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './index.css';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import AdminDashboard from './pages/AdminDashboard';
import AdminUsers from './pages/AdminUsers';
import AdminBerita from './pages/AdminBerita';
import AdminYoutube from './pages/AdminYoutube';
import AdminSettings from './pages/AdminSettings';
import GoogleCallback from './pages/GoogleCallback';

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Google OAuth Callback */}
        <Route path="/auth/google/callback" element={<GoogleCallback />} />

        {/* Admin Routes */}
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/users" element={<AdminUsers />} />
        <Route path="/admin/approvals" element={<AdminDashboard />} />
        <Route path="/admin/berita" element={<AdminBerita />} />
        <Route path="/admin/youtube" element={<AdminYoutube />} />
        <Route path="/admin/settings" element={<AdminSettings />} />

        {/* User Dashboard - redirect to mobile */}
        <Route path="/dashboard" element={
          <div style={{
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
            padding: '40px',
            background: '#F8FAFC'
          }}>
            <h1 style={{ fontSize: '2rem', marginBottom: '16px', color: '#1E293B' }}>📱</h1>
            <h2 style={{ fontSize: '1.5rem', marginBottom: '12px', color: '#1E293B' }}>Akses via Mobile</h2>
            <p style={{ color: '#64748B', maxWidth: '400px', marginBottom: '24px' }}>
              Halaman ini hanya tersedia di aplikasi mobile.
              Silakan download aplikasi Ta'aruf Jodohku di smartphone Anda.
            </p>
            <a
              href="/"
              style={{
                display: 'inline-block',
                padding: '10px 20px',
                background: '#4F46E5',
                color: 'white',
                textDecoration: 'none',
                borderRadius: '8px',
                fontWeight: '500',
                transition: 'background 0.2s',
              }}
              onMouseOver={(e) => e.target.style.background = '#4338CA'}
              onMouseOut={(e) => e.target.style.background = '#4F46E5'}
            >
              ← Kembali ke Beranda
            </a>
          </div>
        } />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;

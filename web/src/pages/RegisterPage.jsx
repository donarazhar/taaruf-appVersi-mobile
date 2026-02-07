import { useState } from 'react';
import { Link } from 'react-router-dom';
import { API_URL } from '../config/api';
import './Auth.css';

function RegisterPage() {
    const [formData, setFormData] = useState({
        nama: '',
        email: '',
        jenkel: '',
        nohp: '',
        password: '',
        password_confirmation: ''
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (formData.password !== formData.password_confirmation) {
            setError('Password tidak cocok');
            return;
        }

        setIsLoading(true);

        try {
            const response = await fetch(`${API_URL}/auth/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Registrasi gagal');
            }

            setSuccess(`Registrasi berhasil! NIP Anda: ${data.nip}. Silakan tunggu persetujuan admin untuk dapat login.`);

            // Clear form
            setFormData({
                nama: '',
                email: '',
                jenkel: '',
                nohp: '',
                password: '',
                password_confirmation: ''
            });

        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    const handleGoogleRegister = async () => {
        try {
            const response = await fetch(`${API_URL}/auth/google`);
            const data = await response.json();

            if (data.url) {
                window.location.href = data.url;
            }
        } catch (err) {
            setError('Gagal menghubungi server Google');
        }
    };

    return (
        <div className="auth-page">
            <div className="auth-container">
                <div className="auth-card register-card">
                    <div className="auth-header">
                        <Link to="/" className="auth-logo">
                            <span className="logo-icon">💍</span>
                            <span className="logo-text">Ta'aruf Jodohku</span>
                        </Link>
                        <h1 className="auth-title">Buat Akun Baru</h1>
                        <p className="auth-subtitle">Daftar untuk memulai perjalanan ta'aruf Anda</p>
                    </div>

                    {error && (
                        <div className="auth-error">
                            <span>⚠️</span> {error}
                        </div>
                    )}

                    {success && (
                        <div className="auth-success">
                            <span>✅</span> {success}
                        </div>
                    )}

                    {/* Google Register Button */}
                    <button
                        type="button"
                        className="google-button"
                        onClick={handleGoogleRegister}
                    >
                        <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                            <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.874 2.684-6.615z" fill="#4285F4" />
                            <path d="M9.003 18c2.43 0 4.467-.806 5.956-2.18l-2.909-2.26c-.806.54-1.836.86-3.047.86-2.344 0-4.328-1.584-5.036-3.711H.96v2.332C2.44 15.983 5.482 18 9.003 18z" fill="#34A853" />
                            <path d="M3.964 10.712c-.18-.54-.282-1.117-.282-1.71 0-.593.102-1.17.282-1.71V4.96H.957C.347 6.175 0 7.55 0 9.002c0 1.452.348 2.827.957 4.042l3.007-2.332z" fill="#FBBC05" />
                            <path d="M9.003 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.464.891 11.428 0 9.002 0 5.48 0 2.44 2.017.96 4.96l3.006 2.332c.71-2.127 2.693-3.711 5.037-3.711z" fill="#EA4335" />
                        </svg>
                        Daftar dengan Google
                    </button>

                    <div className="auth-divider">
                        <span>atau daftar manual</span>
                    </div>

                    <form onSubmit={handleSubmit} className="auth-form">
                        <div className="form-group">
                            <label htmlFor="nama">Nama Lengkap</label>
                            <input
                                type="text"
                                id="nama"
                                name="nama"
                                value={formData.nama}
                                onChange={handleChange}
                                placeholder="Masukkan nama lengkap"
                                required
                            />
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label htmlFor="email">Email</label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    placeholder="contoh@gmail.com"
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="nohp">Nomor HP</label>
                                <input
                                    type="tel"
                                    id="nohp"
                                    name="nohp"
                                    value={formData.nohp}
                                    onChange={handleChange}
                                    placeholder="08xxxxxxxxxx"
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label htmlFor="jenkel">Jenis Kelamin</label>
                            <select
                                id="jenkel"
                                name="jenkel"
                                value={formData.jenkel}
                                onChange={handleChange}
                                required
                            >
                                <option value="">Pilih jenis kelamin</option>
                                <option value="L">Laki-laki (Ikhwan)</option>
                                <option value="P">Perempuan (Akhwat)</option>
                            </select>
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label htmlFor="password">Password</label>
                                <input
                                    type="password"
                                    id="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    placeholder="Minimal 6 karakter"
                                    minLength={6}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="password_confirmation">Konfirmasi Password</label>
                                <input
                                    type="password"
                                    id="password_confirmation"
                                    name="password_confirmation"
                                    value={formData.password_confirmation}
                                    onChange={handleChange}
                                    placeholder="Ulangi password"
                                    required
                                />
                            </div>
                        </div>

                        <div className="form-info">
                            <span>ℹ️</span>
                            <p>Setelah mendaftar, akun Anda perlu diverifikasi oleh admin. Anda akan dapat login setelah akun disetujui.</p>
                        </div>

                        <button
                            type="submit"
                            className="auth-button"
                            disabled={isLoading}
                        >
                            {isLoading ? 'Memproses...' : 'Daftar Sekarang'}
                        </button>
                    </form>

                    <div className="auth-footer">
                        <p>Sudah punya akun? <Link to="/login">Masuk di sini</Link></p>
                    </div>
                </div>

                <div className="auth-decoration">
                    <div className="decoration-content">
                        <h2>Bergabung Bersama Kami</h2>
                        <p>Platform ta'aruf eksklusif dengan pendampingan profesional menuju pernikahan berkah.</p>
                        <ul className="decoration-features">
                            <li>✓ Pendaftaran mudah dengan email atau Google</li>
                            <li>✓ Proses verifikasi oleh admin</li>
                            <li>✓ Privasi data terjaga dengan aman</li>
                            <li>✓ Menuju pernikahan yang berkah</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default RegisterPage;

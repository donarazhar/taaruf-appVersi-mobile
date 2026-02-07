import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { API_URL } from '../config/api';
import './Admin.css';

function AdminSettings() {
    const [activityLogs, setActivityLogs] = useState([]);
    const [backups, setBackups] = useState([]);
    const [loadingLogs, setLoadingLogs] = useState(true);
    const [loadingBackups, setLoadingBackups] = useState(true);
    const [backupInProgress, setBackupInProgress] = useState(false);
    const [message, setMessage] = useState(null);
    const navigate = useNavigate();

    const token = localStorage.getItem('token');
    const isAdmin = localStorage.getItem('is_admin') === 'true';
    const adminUser = JSON.parse(localStorage.getItem('user') || '{}');

    useEffect(() => {
        if (!token || !isAdmin) {
            navigate('/login');
            return;
        }
        fetchActivityLogs();
        fetchBackups();
    }, [token, isAdmin, navigate]);

    const fetchActivityLogs = async () => {
        setLoadingLogs(true);
        try {
            const response = await fetch(`${API_URL}/admin/activity-logs`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await response.json();
            setActivityLogs(data.data || []);
        } catch (error) {
            console.error('Error fetching activity logs:', error);
        } finally {
            setLoadingLogs(false);
        }
    };

    const fetchBackups = async () => {
        setLoadingBackups(true);
        try {
            const response = await fetch(`${API_URL}/admin/backups`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await response.json();
            setBackups(data.data || []);
        } catch (error) {
            console.error('Error fetching backups:', error);
        } finally {
            setLoadingBackups(false);
        }
    };

    const handleCreateBackup = async () => {
        setBackupInProgress(true);
        setMessage(null);
        try {
            const response = await fetch(`${API_URL}/admin/backups/create`, {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await response.json();
            setMessage({ type: 'success', text: data.message || 'Backup berhasil dibuat!' });
            fetchBackups();
        } catch (error) {
            setMessage({ type: 'error', text: 'Gagal membuat backup' });
        } finally {
            setBackupInProgress(false);
        }
    };

    const handleDeleteBackup = async (filename) => {
        if (!confirm('Yakin ingin menghapus backup ini?')) return;

        try {
            await fetch(`${API_URL}/admin/backups/${filename}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            setMessage({ type: 'success', text: 'Backup berhasil dihapus' });
            fetchBackups();
        } catch (error) {
            setMessage({ type: 'error', text: 'Gagal menghapus backup' });
        }
    };

    const handleClearLogs = async () => {
        if (!confirm('Yakin ingin menghapus semua activity logs?')) return;

        try {
            await fetch(`${API_URL}/admin/activity-logs/clear`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            setMessage({ type: 'success', text: 'Activity logs berhasil dihapus' });
            fetchActivityLogs();
        } catch (error) {
            setMessage({ type: 'error', text: 'Gagal menghapus logs' });
        }
    };

    const handleLogout = () => {
        localStorage.clear();
        navigate('/login');
    };

    const getInitials = (name) => {
        if (!name) return 'A';
        return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleString('id-ID', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const formatBytes = (bytes) => {
        if (!bytes) return '0 B';
        const k = 1024;
        const sizes = ['B', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    const getActionBadge = (action) => {
        const actionMap = {
            'login': 'badge-success',
            'logout': 'badge-warning',
            'create': 'badge-blue',
            'update': 'badge-blue',
            'delete': 'badge-danger',
            'approve': 'badge-success',
            'reject': 'badge-danger'
        };
        return actionMap[action] || 'badge';
    };

    return (
        <div className="admin-layout">
            {/* Sidebar */}
            <aside className="admin-sidebar">
                <div className="sidebar-header">
                    <div className="sidebar-logo">💍</div>
                    <span className="sidebar-title">Ta'aruf Admin</span>
                </div>

                <nav className="sidebar-nav">
                    <span className="nav-label">Menu Utama</span>
                    <Link to="/admin/dashboard" className="nav-item">
                        <span className="nav-item-icon">📊</span>
                        Dashboard
                    </Link>
                    <Link to="/admin/users" className="nav-item">
                        <span className="nav-item-icon">👥</span>
                        Daftar Pengguna
                    </Link>
                    <Link to="/admin/approvals" className="nav-item">
                        <span className="nav-item-icon">✅</span>
                        Persetujuan
                    </Link>

                    <div className="nav-divider"></div>
                    <span className="nav-label">Konten</span>
                    <Link to="/admin/berita" className="nav-item">
                        <span className="nav-item-icon">📰</span>
                        Berita
                    </Link>
                    <Link to="/admin/youtube" className="nav-item">
                        <span className="nav-item-icon">🎥</span>
                        Video
                    </Link>

                    <div className="nav-divider"></div>
                    <span className="nav-label">Pengaturan</span>
                    <Link to="/admin/settings" className="nav-item active">
                        <span className="nav-item-icon">⚙️</span>
                        Pengaturan
                    </Link>
                </nav>

                <div className="sidebar-footer">
                    <div className="admin-profile">
                        <div className="admin-avatar">{getInitials(adminUser.name)}</div>
                        <div className="admin-info">
                            <span className="admin-name">{adminUser.name || 'Admin'}</span>
                            <span className="admin-email">{adminUser.email}</span>
                        </div>
                    </div>
                    <button onClick={handleLogout} className="logout-btn">
                        <span>🚪</span> Keluar
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="admin-main">
                <header className="admin-header">
                    <div className="header-row">
                        <div className="header-content">
                            <h1>Pengaturan Sistem</h1>
                            <p>Activity logs, backup database, dan pengaturan sistem lainnya</p>
                        </div>
                    </div>
                </header>

                {message && (
                    <div className={`alert-${message.type}`}>
                        {message.type === 'success' ? '✅' : '❌'} {message.text}
                    </div>
                )}

                {/* Backup Section */}
                <section className="admin-section">
                    <div className="section-header">
                        <h2><span>💾</span> Database Backup</h2>
                        <button
                            className="btn-primary"
                            onClick={handleCreateBackup}
                            disabled={backupInProgress}
                        >
                            {backupInProgress ? '⏳ Creating...' : '+ Buat Backup'}
                        </button>
                    </div>

                    {loadingBackups ? (
                        <div className="empty-state">
                            <div className="spinner"></div>
                            <p>Memuat data backup...</p>
                        </div>
                    ) : backups.length === 0 ? (
                        <div className="empty-state">
                            <div className="empty-icon">📦</div>
                            <h3>Belum Ada Backup</h3>
                            <p>Klik "Buat Backup" untuk membuat backup database.</p>
                        </div>
                    ) : (
                        <div className="backup-list">
                            {backups.map((backup, index) => (
                                <div key={index} className="backup-item">
                                    <div className="backup-icon">📦</div>
                                    <div className="backup-info">
                                        <span className="backup-name">{backup.filename}</span>
                                        <span className="backup-meta">
                                            {formatBytes(backup.size)} • {formatDate(backup.created_at)}
                                        </span>
                                    </div>
                                    <div className="backup-actions">
                                        <a
                                            href={`${API_URL}/admin/backups/${backup.filename}/download`}
                                            className="btn-edit"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                        >
                                            ⬇️ Download
                                        </a>
                                        <button
                                            className="btn-delete"
                                            onClick={() => handleDeleteBackup(backup.filename)}
                                        >
                                            🗑️ Hapus
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </section>

                {/* Activity Logs Section */}
                <section className="admin-section">
                    <div className="section-header">
                        <h2>
                            <span>📋</span> Activity Logs
                            <span className="section-badge">{activityLogs.length}</span>
                        </h2>
                        <button className="btn-secondary" onClick={handleClearLogs}>
                            🗑️ Clear Logs
                        </button>
                    </div>

                    {loadingLogs ? (
                        <div className="empty-state">
                            <div className="spinner"></div>
                            <p>Memuat activity logs...</p>
                        </div>
                    ) : activityLogs.length === 0 ? (
                        <div className="empty-state">
                            <div className="empty-icon">📋</div>
                            <h3>Belum Ada Aktivitas</h3>
                            <p>Activity logs akan muncul saat ada aktivitas di sistem.</p>
                        </div>
                    ) : (
                        <div className="table-container">
                            <table className="admin-table">
                                <thead>
                                    <tr>
                                        <th>Waktu</th>
                                        <th>User</th>
                                        <th>Aksi</th>
                                        <th>Deskripsi</th>
                                        <th>IP Address</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {activityLogs.map((log, index) => (
                                        <tr key={index}>
                                            <td>{formatDate(log.created_at)}</td>
                                            <td>
                                                <div className="user-cell">
                                                    <div className="user-avatar" style={{ width: 32, height: 32, fontSize: '0.75rem' }}>
                                                        {getInitials(log.user_name)}
                                                    </div>
                                                    <span>{log.user_name || 'System'}</span>
                                                </div>
                                            </td>
                                            <td>
                                                <span className={`badge ${getActionBadge(log.action)}`}>
                                                    {log.action}
                                                </span>
                                            </td>
                                            <td>{log.description}</td>
                                            <td><code>{log.ip_address || '-'}</code></td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </section>
            </main>
        </div>
    );
}

export default AdminSettings;

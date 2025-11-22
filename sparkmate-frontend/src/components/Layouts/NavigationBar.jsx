import { Heart, Shield } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const NavigationBar = () => {
  const { user } = useAuth();

  if (!user) return null;

  const isAdmin = user?.role === 'ADMIN' || user?.email === 'admin@sparkmate.com';

  return (
    <nav className="navbar">
      <div className="nav-logo">
        <Heart size={24} fill="#ff006e" />
        SparkMate
      </div>
      {isAdmin && (
        <Link 
          to="/admin" 
          style={{
            padding: '8px 16px',
            background: 'rgba(255, 0, 110, 0.2)',
            border: '1px solid rgba(255, 0, 110, 0.3)',
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            color: '#ff006e',
            textDecoration: 'none',
            fontSize: '14px',
            fontWeight: '600',
            transition: 'all 0.3s'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'rgba(255, 0, 110, 0.3)';
            e.currentTarget.style.transform = 'scale(1.05)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'rgba(255, 0, 110, 0.2)';
            e.currentTarget.style.transform = 'scale(1)';
          }}
        >
          <Shield size={18} />
          Admin
        </Link>
      )}
    </nav>
  );
};

export default NavigationBar;

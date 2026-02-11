import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export function LogoutPage() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    async function handleLogout() {
      await logout();
      navigate('/');
    }
    handleLogout();
  }, [logout, navigate]);

  return <div className="container mx-auto px-4 py-8">Logging out...</div>;
}

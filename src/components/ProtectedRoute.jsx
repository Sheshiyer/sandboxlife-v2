import { useEffect, useState } from 'react';
import { Navigate, useParams } from 'react-router-dom';
import { supabase } from '../utils/supabase';
import PropTypes from 'prop-types';

export default function ProtectedRoute({ children }) {
  const { userId } = useParams();
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session && session.user) {
          if (userId && session.user.id !== userId) {
            setAuthenticated(false);
          } else {
            setAuthenticated(true);
          }
        } else {
          setAuthenticated(false);
        }
      } catch (error) {
        setAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session && session.user) {
        if (userId && session.user.id !== userId) {
          setAuthenticated(false);
        } else {
          setAuthenticated(true);
        }
      } else {
        setAuthenticated(false);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, [userId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-bgpapyrus flex items-center justify-center">
        <div className="text-slate-600">Loading...</div>
      </div>
    );
  }

  if (!authenticated) {
    return <Navigate to="/" replace />;
  }

  return children;
}

ProtectedRoute.propTypes = {
  children: PropTypes.node.isRequired,
};

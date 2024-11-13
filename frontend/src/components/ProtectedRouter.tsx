import { useAuth } from '../contexts/AuthContext';
import { Outlet, useNavigate } from 'react-router-dom';
import Layout from './Layout';
import Loading from './Loading';

const ProtectedRouter = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  if (isAuthenticated === false) {
    navigate('/', { replace: true });
    return <Loading />;
  }

  return (
    <Layout>
      <Outlet />
    </Layout>
  );
};

export default ProtectedRouter;

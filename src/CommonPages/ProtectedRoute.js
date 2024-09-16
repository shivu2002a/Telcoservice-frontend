import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ isAdmin, isUser, children }) => {
  if (!isAdmin && !isUser) {
    // Redirect to login if neither admin nor user
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;

import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Login from './components/Login';
import Registration from './components/Registration';
import ForgotPassword from './components/ForgotPassword';
import Home from './components/Home';
import BookDetails from './components/BookDetails';
import Profile from './components/Profile';
import AdminBooks from './components/AdminBooks';
import AdminBookForm from './components/AdminBookForm';
import AdminUsers from './components/AdminUsers';
import { fetchUsers } from './features/UserSlice';
import { fetchBooks } from './features/BooksSlice';
import { fetchReviews } from './features/ReviewsSlice';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

const PrivateRoute = ({ children }) => {
  const email = useSelector((state) => state.user.user.email);
  return email ? children : <Navigate to="/" replace />;
};

const AdminRoute = ({ children }) => {
  const user = useSelector((state) => state.user.user);
  if (!user?.email) return <Navigate to="/" replace />;
  if (user.role !== 'admin') return <Navigate to="/home" replace />;
  return children;
};

function App() {
  const dispatch = useDispatch();
  const email = useSelector((state) => state.user.user.email);
  const role = useSelector((state) => state.user.user.role);

  useEffect(() => {
    dispatch(fetchUsers());
    dispatch(fetchBooks());
    dispatch(fetchReviews());
  }, [dispatch]);

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            email ? (
              <Navigate to={role === 'admin' ? '/admin/books' : '/home'} replace />
            ) : (
              <Login />
            )
          }
        />
        <Route path="/register" element={<Registration />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route
          path="/home"
          element={
            <PrivateRoute>
              <Home />
            </PrivateRoute>
          }
        />
        <Route
          path="/book/:id"
          element={
            <PrivateRoute>
              <BookDetails />
            </PrivateRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <PrivateRoute>
              <Profile />
            </PrivateRoute>
          }
        />
        <Route
          path="/admin/books"
          element={
            <AdminRoute>
              <AdminBooks />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/books/add"
          element={
            <AdminRoute>
              <AdminBookForm mode="add" />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/books/:id/edit"
          element={
            <AdminRoute>
              <AdminBookForm mode="edit" />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/users"
          element={
            <AdminRoute>
              <AdminUsers />
            </AdminRoute>
          }
        />
        <Route
          path="*"
          element={
            <Navigate
              to={email ? (role === 'admin' ? '/admin/books' : '/home') : '/'}
              replace
            />
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

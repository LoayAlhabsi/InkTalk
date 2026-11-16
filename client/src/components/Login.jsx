import { useEffect, useState } from 'react';
import { Alert, Button, FormGroup, Input, Label } from 'reactstrap';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { LoginValidation } from '../validations/LoginValidation';
import { login, resetStatus } from '../features/UserSlice';
import AuthLayout from './AuthLayout';

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isError, isSuccess, message, user } = useSelector((state) => state.user);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (isSuccess && user?.email) {
      navigate(user.role === 'admin' ? '/admin/books' : '/home', { replace: true });
    }
  }, [isSuccess, user, navigate]);

  const handleLogin = (values) => {
    dispatch(resetStatus());
    dispatch(login(values));
  };

  return (
    <AuthLayout
      eyebrow="Welcome back"
      title="Login"
      subtitle="Your next great read is waiting. Log in to your InkTalk account."
      footer={
        <div className="auth-footer">
          <p className="mb-0">
            New User? <Link to="/register">Register now</Link>
          </p>
          <hr className="auth-divider" />
          <div className="admin-row">
            <span>Admin?</span>
            <button
              type="button"
              className="admin-login-link"
              onClick={() => {
                dispatch(resetStatus());
                dispatch(login({ email: 'admin@inktalk.com', password: 'admin123' }));
              }}
            >
              Admin login →
            </button>
          </div>
        </div>
      }
    >
      <Formik
        initialValues={{ email: '', password: '' }}
        validationSchema={LoginValidation}
        onSubmit={handleLogin}
      >
        <Form>
          {isError && <Alert color="danger">{message}</Alert>}
          <FormGroup>
            <Label for="email">Email</Label>
            <Field
              name="email"
              type="email"
              placeholder="Enter email"
              className="form-control"
            />
            <ErrorMessage name="email" component="p" className="field-error" />
          </FormGroup>
          <FormGroup>
            <Label for="password">Password</Label>
            <div className="password-field">
              <Field
                name="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter a password"
                className="form-control"
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword((v) => !v)}
                aria-label="Toggle password"
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
            <ErrorMessage name="password" component="p" className="field-error" />
          </FormGroup>
          <div className="d-flex justify-content-between align-items-center mb-4">
            <FormGroup check className="mb-0">
              <Input type="checkbox" id="rememberme" />
              <Label check for="rememberme">
                Remember me
              </Label>
            </FormGroup>
            <Link to="/forgot-password" className="forgot-link">
              Forgot password?
            </Link>
          </div>
          <Button color="dark" type="submit" className="w-100 auth-btn">
            Login
          </Button>
        </Form>
      </Formik>
    </AuthLayout>
  );
};

export default Login;

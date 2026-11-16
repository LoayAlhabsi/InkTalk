import { useEffect, useState } from 'react';
import { Alert, Button, FormGroup, Label } from 'reactstrap';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { RegistrationValidation } from '../validations/RegistrationValidation';
import { register, resetStatus } from '../features/UserSlice';
import AuthLayout from './AuthLayout';

const Registration = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isError, isSuccess, message } = useSelector((state) => state.user);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (isSuccess) {
      dispatch(resetStatus());
      navigate('/', { replace: true });
    }
  }, [isSuccess, dispatch, navigate]);

  const handleRegister = (values) => {
    dispatch(resetStatus());
    dispatch(register(values));
  };

  return (
    <AuthLayout
      topLink={
        <Link to="/" className="forgot-back">
          ← Back to Login
        </Link>
      }
      eyebrow="Create your account"
      title="Sign in"
      subtitle="New to InkTalk? Create a reader account and make your voice part of the story."
      footer={
        <div className="auth-footer">
          <p className="mb-3">
            Already a member? <Link to="/">Login →</Link>
          </p>
          <p className="auth-tagline">One account. A world of stories.</p>
        </div>
      }
    >
      <Formik
        initialValues={{
          username: '',
          email: '',
          password: '',
          userType: 'Reader',
        }}
        validationSchema={RegistrationValidation}
        onSubmit={handleRegister}
      >
        <Form>
          {isError && <Alert color="danger">{message}</Alert>}

          <FormGroup>
            <Label for="username">Username</Label>
            <Field
              name="username"
              type="text"
              placeholder="Enter username"
              className="form-control"
            />
            <p className="field-hint">Choose a name other readers will see.</p>
            <ErrorMessage name="username" component="p" className="field-error" />
          </FormGroup>

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
            <p className="field-hint">
              Use at least 8 characters, including a number.
            </p>
            <ErrorMessage name="password" component="p" className="field-error" />
          </FormGroup>

          <FormGroup className="mt-3 mb-4">
            <Label className="d-block mb-2">Type of User</Label>
            <div className="user-type-row" role="group" aria-label="Type of User">
              {['Reader', 'Writer', 'Both'].map((type) => (
                <label key={type} className="user-type-option">
                  <Field type="radio" name="userType" value={type} />
                  <span>{type}</span>
                </label>
              ))}
            </div>
            <ErrorMessage name="userType" component="p" className="field-error" />
          </FormGroup>

          <Button color="dark" type="submit" className="w-100 auth-btn">
            Sign in - Create account
          </Button>
        </Form>
      </Formik>
    </AuthLayout>
  );
};

export default Registration;

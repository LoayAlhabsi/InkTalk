import {useState} from 'react';
import {Alert, Button, FormGroup, Input, Label, Spinner} from 'reactstrap';
import {Formik,Form,Field,ErrorMessage} from 'formik';
import {Link, useNavigate} from 'react-router-dom';
import {useDispatch, useSelector} from 'react-redux';
import {FaEye, FaEyeSlash} from 'react-icons/fa';
import {LoginValidation} from '../validations/LoginValidation';
import {login,resetStatus} from '../features/UserSlice';
import AuthLayout from './AuthLayout';

const Login=()=>{
    const dispatch=useDispatch();
    const navigate=useNavigate();
    const {isLoading,isError,message}=useSelector((state)=>state.user);
    const [showPassword,setShowPassword]=useState(false);

    const handleLogin=async(values,{resetForm})=>{
        dispatch(resetStatus());
        const result=await dispatch(login({
            email:values.email.trim(),
            password:values.password
        }));
        if(login.fulfilled.match(result)){
            resetForm();
            const user=result.payload.user;
            if(user?.role==="admin"){
                navigate("/admin/books",{replace:true});
            }else{
                navigate("/home",{replace:true});
            }
        }
    };

    return(
        <AuthLayout
            eyebrow="Welcome back"
            title="Login"
            subtitle="Your next great read is waiting. Log in to your InkTalk account."
            footer={
                <div className="auth-footer">
                    <p className="mb-0">
                        New User? <Link to="/register">Register now</Link>
                    </p>
                </div>
            }
        >
            <Formik
                initialValues={{email:'',password:''}}
                validationSchema={LoginValidation}
                onSubmit={handleLogin}
            >
                <Form>
                    {isError&&(<Alert color="danger">{message}</Alert>)}
                    <FormGroup>
                        <Label for="email">Email</Label>
                        <Field name="email" type="email" placeholder="Enter email" className="form-control"/>
                        <ErrorMessage name="email" component="p" className="field-error"/>
                    </FormGroup>
                    <FormGroup>
                        <Label for="password">Password</Label>
                        <div className="password-field">
                            <Field
                                name="password"
                                type={showPassword?"text":"password"}
                                placeholder="Enter a password"
                                className="form-control"
                            />
                            <button
                                type="button"
                                className="password-toggle"
                                onClick={()=>setShowPassword((v)=>!v)}
                                aria-label="Toggle password"
                            >
                                {showPassword?<FaEyeSlash/>:<FaEye/>}
                            </button>
                        </div>
                        <ErrorMessage name="password" component="p" className="field-error"/>
                    </FormGroup>
                    <div className="d-flex justify-content-between align-items-center mb-4">
                        <FormGroup check className="mb-0">
                            <Input type="checkbox" id="rememberme"/>
                            <Label check for="rememberme">Remember me</Label>
                        </FormGroup>
                        <Link to="/forgot-password" className="forgot-link">Forgot password?</Link>
                    </div>
                    <Button color="dark" type="submit" className="w-100 auth-btn" disabled={isLoading}>
                        {isLoading?(
                            <>
                                <Spinner size="sm" className="me-2"/>Authenticating...
                            </>
                        ):("Login")}
                    </Button>
                </Form>
            </Formik>
        </AuthLayout>
    );
};

export default Login;

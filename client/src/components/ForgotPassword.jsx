import {useState} from 'react';
import {Alert, Button, FormGroup, Label} from 'reactstrap';
import {Formik,Form,Field,ErrorMessage} from 'formik';
import {Link, useNavigate} from 'react-router-dom';
import {useDispatch, useSelector} from 'react-redux';
import {FaEye, FaEyeSlash} from 'react-icons/fa';
import {ForgotPasswordValidation} from '../validations/ForgotPasswordValidation';
import {resetPassword,resetStatus} from '../features/UserSlice';
import AuthLayout from './AuthLayout';

const ForgotPassword=()=>{
    const navigate=useNavigate();
    const dispatch=useDispatch();
    const {isError,message}=useSelector((state)=>state.user);
    const [showPassword,setShowPassword]=useState(false);
    const [showConfirm,setShowConfirm]=useState(false);
    const [success,setSuccess]=useState(false);

    const handleReset=async(values,{resetForm})=>{
        dispatch(resetStatus());
        const result=await dispatch(resetPassword({
            username:values.username,
            email:values.email,
            password:values.password
        }));
        if(resetPassword.fulfilled.match(result)){
            setSuccess(true);
            resetForm();
            setTimeout(()=>{
                navigate("/",{replace:true});
            },1200);
        }
    };

    return(
        <AuthLayout
            topLink={
                <Link to="/" className="forgot-back">← Back to login</Link>
            }
            eyebrow="Reset your password"
            title="Forgot password?"
            subtitle="Enter your username and email, then choose a new password."
        >
            <Formik
                initialValues={{
                    username:'',
                    email:'',
                    password:'',
                    cpassword:''
                }}
                validationSchema={ForgotPasswordValidation}
                onSubmit={handleReset}
            >
                <Form>
                    {success&&(
                        <Alert color="success">Password updated. Redirecting to login...</Alert>
                    )}
                    {isError&&(<Alert color="danger">{message}</Alert>)}

                    <FormGroup>
                        <Label for="username">Username</Label>
                        <Field name="username" type="text" placeholder="Enter username" className="form-control"/>
                        <ErrorMessage name="username" component="p" className="field-error"/>
                    </FormGroup>

                    <FormGroup>
                        <Label for="email">Email</Label>
                        <Field name="email" type="email" placeholder="Enter email" className="form-control"/>
                        <ErrorMessage name="email" component="p" className="field-error"/>
                    </FormGroup>

                    <FormGroup>
                        <Label for="password">New password</Label>
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
                        <p className="field-hint">Use at least 8 characters, including a number.</p>
                        <ErrorMessage name="password" component="p" className="field-error"/>
                    </FormGroup>

                    <FormGroup>
                        <Label for="cpassword">Confirm new password</Label>
                        <div className="password-field">
                            <Field
                                name="cpassword"
                                type={showConfirm?"text":"password"}
                                placeholder="Confirm password"
                                className="form-control"
                            />
                            <button
                                type="button"
                                className="password-toggle"
                                onClick={()=>setShowConfirm((v)=>!v)}
                                aria-label="Toggle confirm password"
                            >
                                {showConfirm?<FaEyeSlash/>:<FaEye/>}
                            </button>
                        </div>
                        <ErrorMessage name="cpassword" component="p" className="field-error"/>
                    </FormGroup>

                    <Button color="dark" type="submit" className="w-100 auth-btn mt-2">
                        Reset password
                    </Button>
                </Form>
            </Formik>
        </AuthLayout>
    );
};

export default ForgotPassword;

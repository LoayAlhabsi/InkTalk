import {useState} from 'react';
import {Alert, Button, FormGroup, Label} from 'reactstrap';
import {Formik, Form, Field, ErrorMessage} from 'formik';
import {useDispatch, useSelector} from 'react-redux';
import {useNavigate} from 'react-router-dom';
import {FaEye, FaEyeSlash, FaStar, FaUserCircle, FaPen} from 'react-icons/fa';
import Header from './Header';
import StarRating from './StarRating';
import {ReviewValidation} from '../validations/ReviewValidation';
import {updateReview} from '../features/ReviewsSlice';
import {EditProfileValidation} from '../validations/EditProfileValidation';
import {logout, updateProfile} from '../features/UserSlice';

const Profile=()=>{
    const dispatch=useDispatch();
    const navigate=useNavigate();
    const user=useSelector((state)=>state.user.user);
    const books=useSelector((state)=>state.books.books);
    const myReviews=useSelector((state)=>
        state.reviews.reviews.filter(
            (r)=>r.userId===user.id||r.username?.toLowerCase()===user.username?.toLowerCase()
        )
    );
    const [showPassword,setShowPassword]=useState(false);
    const [showConfirm,setShowConfirm]=useState(false);
    const [updated,setUpdated]=useState(false);
    const [editingId,setEditingId]=useState(null);

    const savedCount=user.savedBooks?.length||0;
    const joinedLabel=user.joined
        ?new Date(user.joined).toLocaleDateString('en-GB',{month:'long',year:'numeric'})
        :'this year';

    const handleUpdate=(values)=>{
        dispatch(updateProfile({
            username:values.username,
            email:values.email,
            bio:values.bio||'',
            password:values.password||''
        }));
        setUpdated(true);
        setTimeout(()=>setUpdated(false),2000);
    };

    const handlePhotoChange=()=>{
        const url=window.prompt('Paste a profile photo URL (demo):',user.avatar||'');
        if(url!==null){
            dispatch(updateProfile({avatar:url.trim()}));
        }
    };

    const handleEditReview=(review,values)=>{
        dispatch(updateReview({
            id:review.id,
            rating:values.rating,
            text:values.text,
            username:user.username||user.name
        }));
        setEditingId(null);
    };

    return(
        <div className="app-shell discover-shell">
            <Header showSearch/>
            <main className="page-body profile-page">
                <div className="profile-layout">
                    <aside className="profile-sidebar">
                        <section className="detail-card profile-summary">
                            <div className="profile-photo-wrap">
                                {user.avatar?(
                                    <img src={user.avatar} alt={user.username}/>
                                ):(
                                    <FaUserCircle/>
                                )}
                            </div>
                            <h2>{user.username||user.name}</h2>
                            <p className="profile-bio-text">
                                {user.bio
                                    ?user.bio
                                    :`Reader since ${joinedLabel}. A chapter a day, a story to share.`}
                            </p>
                            <div className="profile-stats-row">
                                <div>
                                    <strong>{myReviews.length}</strong>
                                    <span>Reviews</span>
                                </div>
                                <div>
                                    <strong>{savedCount}</strong>
                                    <span>Saved books</span>
                                </div>
                            </div>
                            <button
                                type="button"
                                className="btn-secondary-ink w-100"
                                onClick={handlePhotoChange}
                            >
                                Change profile photo
                            </button>
                        </section>

                        <button
                            type="button"
                            className="profile-logout-btn"
                            onClick={()=>{
                                dispatch(logout());
                                navigate('/',{replace:true});
                            }}
                        >
                            Logout
                        </button>
                    </aside>

                    <section className="profile-main">
                        <div className="detail-card">
                            <h2>Edit profile</h2>
                            <Formik
                                enableReinitialize
                                initialValues={{
                                    username:user.username||'',
                                    email:user.email||'',
                                    bio:user.bio||'',
                                    password:'',
                                    cpassword:''
                                }}
                                validationSchema={EditProfileValidation}
                                onSubmit={handleUpdate}
                            >
                                <Form>
                                    {updated&&<Alert color="success">Profile updated.</Alert>}
                                    <FormGroup>
                                        <Label>Username</Label>
                                        <Field name="username" className="form-control"/>
                                        <ErrorMessage name="username" component="p" className="field-error"/>
                                    </FormGroup>
                                    <FormGroup>
                                        <Label>Email</Label>
                                        <Field name="email" type="email" className="form-control"/>
                                        <ErrorMessage name="email" component="p" className="field-error"/>
                                    </FormGroup>
                                    <FormGroup>
                                        <Label>About me</Label>
                                        <Field
                                            as="textarea"
                                            name="bio"
                                            rows="3"
                                            className="form-control"
                                            placeholder="A chapter a day, a story to share."
                                        />
                                        <ErrorMessage name="bio" component="p" className="field-error"/>
                                    </FormGroup>

                                    <div className="profile-password-grid">
                                        <FormGroup>
                                            <Label>New password</Label>
                                            <div className="password-field">
                                                <Field
                                                    name="password"
                                                    type={showPassword?'text':'password'}
                                                    className="form-control"
                                                    placeholder="Enter a password"
                                                />
                                                <button
                                                    type="button"
                                                    className="password-toggle"
                                                    onClick={()=>setShowPassword((v)=>!v)}
                                                >
                                                    {showPassword?<FaEyeSlash/>:<FaEye/>}
                                                </button>
                                            </div>
                                            <ErrorMessage name="password" component="p" className="field-error"/>
                                        </FormGroup>
                                        <FormGroup>
                                            <Label>Confirm password</Label>
                                            <div className="password-field">
                                                <Field
                                                    name="cpassword"
                                                    type={showConfirm?'text':'password'}
                                                    className="form-control"
                                                    placeholder="Confirm password"
                                                />
                                                <button
                                                    type="button"
                                                    className="password-toggle"
                                                    onClick={()=>setShowConfirm((v)=>!v)}
                                                >
                                                    {showConfirm?<FaEyeSlash/>:<FaEye/>}
                                                </button>
                                            </div>
                                            <ErrorMessage name="cpassword" component="p" className="field-error"/>
                                        </FormGroup>
                                    </div>
                                    <p className="field-hint">Leave blank to keep your current password.</p>
                                    <p className="field-hint mb-3">
                                        Your email is private. Your username appears on reviews.
                                    </p>
                                    <div className="d-flex justify-content-end">
                                        <Button color="dark" type="submit" className="btn-primary-ink">
                                            Update profile
                                        </Button>
                                    </div>
                                </Form>
                            </Formik>
                        </div>

                        <div className="detail-card mt-3">
                            <div className="reviews-head">
                                <h2>My reviews</h2>
                                <span className="my-reviews-count">{myReviews.length} published</span>
                            </div>

                            {myReviews.length===0&&(
                                <p className="text-muted mb-0">You have not written any reviews yet.</p>
                            )}

                            {myReviews.map((r)=>{
                                const book=books.find((b)=>b.id===r.bookId);
                                return(
                                    <article key={r.id} className="my-review-item">
                                        <div
                                            className="my-review-cover"
                                            onClick={()=>navigate(`/book/${r.bookId}`)}
                                            role="button"
                                            tabIndex={0}
                                            onKeyDown={(e)=>{
                                                if(e.key==='Enter') navigate(`/book/${r.bookId}`);
                                            }}
                                        >
                                            {book?.cover?(
                                                <img src={book.cover} alt={book.title}/>
                                            ):(
                                                <div className="cover-placeholder">
                                                    {(book?.title||'?').slice(0,1)}
                                                </div>
                                            )}
                                        </div>
                                        <div className="my-review-body">
                                            <div className="my-review-title-row">
                                                <h3
                                                    className="clickable"
                                                    onClick={()=>navigate(`/book/${r.bookId}`)}
                                                >
                                                    {book?.title||'Book'}
                                                </h3>
                                                <button
                                                    type="button"
                                                    className="review-edit-pen"
                                                    onClick={()=>setEditingId(r.id)}
                                                    aria-label="Edit review"
                                                >
                                                    <FaPen/>
                                                </button>
                                            </div>

                                            {editingId===r.id?(
                                                <Formik
                                                    initialValues={{text:r.text,rating:r.rating}}
                                                    validationSchema={ReviewValidation}
                                                    onSubmit={(values)=>handleEditReview(r,values)}
                                                >
                                                    {({values,setFieldValue})=>(
                                                        <Form>
                                                            <div className="rating-row mb-2">
                                                                <StarRating
                                                                    editable
                                                                    size={18}
                                                                    value={values.rating}
                                                                    onChange={(n)=>setFieldValue('rating',n)}
                                                                />
                                                                <span className="rating-label">{values.rating}/5</span>
                                                            </div>
                                                            <Field
                                                                as="textarea"
                                                                name="text"
                                                                rows="3"
                                                                className="form-control write-review-input"
                                                            />
                                                            <ErrorMessage name="text" component="p" className="field-error"/>
                                                            <div className="write-review-footer">
                                                                <Button
                                                                    type="button"
                                                                    className="btn-secondary-ink"
                                                                    onClick={()=>setEditingId(null)}
                                                                >
                                                                    Cancel
                                                                </Button>
                                                                <Button color="dark" type="submit" className="btn-primary-ink">
                                                                    Save review
                                                                </Button>
                                                            </div>
                                                        </Form>
                                                    )}
                                                </Formik>
                                            ):(
                                                <>
                                                    <p className="my-review-meta">
                                                        <FaStar/> {r.rating}/5
                                                    </p>
                                                    <p className="my-review-text">{r.text}</p>
                                                </>
                                            )}
                                        </div>
                                    </article>
                                );
                            })}
                        </div>
                    </section>
                </div>
            </main>
        </div>
    );
};

export default Profile;

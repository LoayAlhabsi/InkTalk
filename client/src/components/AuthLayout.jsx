import BrandLogo from './BrandLogo';
import authHero from '../assets/auth-hero.png';

const AuthLayout = ({ title, subtitle, eyebrow, topLink, children, footer }) => {
  return (
    <div className="auth-page">
      <div className="auth-left">
        <div className="auth-left-top">
          <BrandLogo to="/" />
          <div className="auth-left-copy">
            <h2 className="auth-slogan">A good book starts a great conversation.</h2>
            <p className="auth-subcopy">
              Discover your next chapter, share what stayed with you, and find a
              community in every story.
            </p>
          </div>
          <div className="auth-hero-wrap">
            <img src={authHero} alt="Cozy reading setup with book and coffee" />
          </div>
          <p className="auth-left-foot">REVIEWS THAT WRITE THE STORY</p>
        </div>
      </div>
      <div className="auth-right">
        <div className="auth-card">
          <div className="auth-card-header">
            {topLink}
            {eyebrow && <p className="auth-eyebrow">{eyebrow}</p>}
            <h1 className="auth-title">{title}</h1>
            {subtitle && <p className="auth-subtitle">{subtitle}</p>}
          </div>
          <div className="auth-card-body">
            <div className="auth-card-body-inner">
              {children}
              {footer}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;

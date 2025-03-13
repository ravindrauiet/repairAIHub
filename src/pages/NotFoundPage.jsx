import { Link } from 'react-router-dom';

const NotFoundPage = () => {
  return (
    <div className="not-found-page">
      <div className="container">
        <div className="not-found-content">
          <h1>404</h1>
          <h2>Page Not Found</h2>
          <p>The page you are looking for doesn't exist or has been moved.</p>
          <div className="not-found-actions">
            <Link to="/" className="hero-cta">
              Back to Home
            </Link>
            <Link to="/services" className="btn-outline">
              View Our Services
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage; 
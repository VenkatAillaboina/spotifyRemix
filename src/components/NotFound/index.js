import {Link} from 'react-router-dom'
import './index.css'

const NotFound = () => (
  <div className="not-found-page-bg-container">
    <img
      src="https://res.cloudinary.com/dowtoiurd/image/upload/v1770381414/not-found_xhpnal.svg"
      alt="page not found"
      className="not-found-image"
    />
    <h1 className="not-found-description">Page Not Found</h1>
    <Link to="/">
      <button type="button" className="not-found-home-page-button">
        Home Page
      </button>
    </Link>
  </div>
)

export default NotFound

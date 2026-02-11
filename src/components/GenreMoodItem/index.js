import {Link} from 'react-router-dom'
import './index.css'

const GenreMoodItem = props => {
  const {details} = props
  const {id, name, image} = details
  return (
    <li className="home-genre-item">
      <Link to={`/category/${id}/playlists`} className="home-link">
        <img src={image} alt="category" className="home-genre-image" />
        <p className="home-genre-text">{name}</p>
      </Link>
    </li>
  )
}

export default GenreMoodItem

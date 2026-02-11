import {Link} from 'react-router-dom'
import './index.css'

const NewReleaseItem = props => {
  const {details} = props
  const {id, name, image} = details

  return (
    <li className="home-card-item">
      <Link to={`/album/${id}`} className="home-link">
        <img src={image} alt="new release album" className="home-card-image" />
        <p className="home-card-text">{name}</p>
      </Link>
    </li>
  )
}

export default NewReleaseItem

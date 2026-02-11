import {Link} from 'react-router-dom'
import './index.css'

const EditorsPickItem = props => {
  const {details} = props
  const {id, name, image} = details

  return (
    <li className="home-card-item">
      <Link to={`/playlist/${id}`} className="home-link">
        <img src={image} alt="featured playlist" className="home-card-image" />
        <p className="home-card-text">{name}</p>
      </Link>
    </li>
  )
}

export default EditorsPickItem

import {Component} from 'react'
import {Link} from 'react-router-dom'
import {BiArrowBack} from 'react-icons/bi'
import Cookies from 'js-cookie'

import Loading from '../Loading'
import ErrorMsg from '../ErrorMsg'
import SideBar from '../SideBar'

import './index.css'

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class CategoryPlaylists extends Component {
  state = {
    categoryPlayListDetails: [],
    apiStatus: apiStatusConstants.initial,
  }

  componentDidMount() {
    this.getCategoryPlaylistsDetails()
  }

  getCategoryPlaylistsDetails = async () => {
    this.setState({apiStatus: apiStatusConstants.inProgress})

    const {match} = this.props
    const {id} = match.params
    const jwtToken = Cookies.get('jwt_token')

    const url = `https://apis2.ccbp.in/spotify-clone/category-playlists/${id}`

    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    }

    const response = await fetch(url, options)

    if (response.ok) {
      const data = await response.json()
      const updatedDetails = data.playlists.items.map(eachItem => ({
        id: eachItem.id,
        name: eachItem.name,
        image: eachItem.images[0].url,
        totalTracks: eachItem.tracks.total,
      }))

      this.setState({
        categoryPlayListDetails: updatedDetails,
        apiStatus: apiStatusConstants.success,
      })
    } else {
      this.setState({apiStatus: apiStatusConstants.failure})
    }
  }

  onClickBack = () => {
    const {history} = this.props
    history.replace('/')
  }

  renderSuccessView = () => {
    const {categoryPlayListDetails} = this.state

    return (
      <ul className="category-playlists-list">
        {categoryPlayListDetails.map(eachItem => (
          <li key={eachItem.id} className="category-playlist-item">
            <Link
              to={`/playlist/${eachItem.id}`}
              className="category-playlist-link"
            >
              <img
                src={eachItem.image}
                alt={eachItem.name}
                className="category-playlist-image"
              />
              <div className="category-playlist-text">
                <p className="category-playlist-name">{eachItem.name}</p>
                <p className="category-playlist-tracks">
                  {eachItem.totalTracks} Tracks
                </p>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    )
  }

  renderCategoryPlaylists = () => {
    const {apiStatus} = this.state

    switch (apiStatus) {
      case apiStatusConstants.inProgress:
        return <Loading />
      case apiStatusConstants.success:
        return this.renderSuccessView()
      case apiStatusConstants.failure:
        return <ErrorMsg retryApi={this.getCategoryPlaylistsDetails} />
      default:
        return null
    }
  }

  render() {
    return (
      <div className="home-layout">
        <SideBar />
        <div className="home-main-section">
          <div className="category-playlists-container">
            <div className="back-nav">
              <button
                type="button"
                className="back-button"
                onClick={this.onClickBack}
              >
                <BiArrowBack className="back-icon" />
                <span className="back-text">Back</span>
              </button>
            </div>
            <h1 className="category-heading">Podcast</h1>
            {this.renderCategoryPlaylists()}
          </div>
        </div>
      </div>
    )
  }
}

export default CategoryPlaylists

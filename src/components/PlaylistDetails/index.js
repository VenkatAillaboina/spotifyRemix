import {Component} from 'react'
import {BiArrowBack} from 'react-icons/bi'

import Cookies from 'js-cookie'
import moment from 'moment'

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

class PlaylistDetails extends Component {
  state = {
    playlistInfo: {},
    tracksList: [],
    apiStatus: apiStatusConstants.initial,
    activeTrackId: '',
  }

  componentDidMount() {
    this.getPlaylistDetails()
  }

  getPlaylistDetails = async () => {
    this.setState({apiStatus: apiStatusConstants.inProgress})
    const {match} = this.props
    const {params} = match
    const {id} = params
    const jwtToken = Cookies.get('jwt_token')

    const url = `https://apis2.ccbp.in/spotify-clone/playlists-details/${id}`

    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    }

    const response = await fetch(url, options)

    if (response.ok) {
      const data = await response.json()

      const playlistInfo = {
        name: data.name,
        image: data.images[0].url,
        owner: data.owner.display_name,
        description: data.description,
      }

      const tracksList = data.tracks.items.map(eachItem => {
        const {track} = eachItem
        return {
          id: track.id,
          name: track.name,
          album: track.album.name,
          artists: track.artists.map(a => a.name),
          durationMs: track.duration_ms,
          previewUrl: track.preview_url,
          addedAt: eachItem.added_at,
        }
      })

      this.setState({
        playlistInfo,
        tracksList,
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

  handleTrackClick = id => {
    this.setState({activeTrackId: id})
  }

  getActivePreviewUrl = () => {
    const {tracksList, activeTrackId} = this.state
    const activeTrack = tracksList.find(track => track.id === activeTrackId)
    return activeTrack ? activeTrack.previewUrl : ''
  }

  formatDuration = durationMs => moment.utc(durationMs).format('mm:ss')

  formatAddedDate = addedAt => moment(addedAt).fromNow()

  renderTracksList = () => {
    const {tracksList, activeTrackId} = this.state

    return (
      <ul className="playlist-tracks-list">
        {tracksList.map((track, index) => (
          <li
            key={track.id}
            id={track.id}
            className={`playlist-track-item ${
              activeTrackId === track.id ? 'active-track' : ''
            }`}
            onClick={() => this.handleTrackClick(track.id)}
          >
            <span className="playlist-track-number">{index + 1}</span>
            <p className="playlist-track-name">{track.name}</p>
            <p className="playlist-track-album hide-mobile">{track.album}</p>
            <p className="playlist-track-duration">
              {this.formatDuration(track.durationMs)}
            </p>
            <p className="playlist-track-artists">{track.artists.join(', ')}</p>
            <p className="playlist-track-added hide-mobile">
              {this.formatAddedDate(track.addedAt)}
            </p>
          </li>
        ))}
      </ul>
    )
  }

  renderSuccessView = () => {
    const {playlistInfo} = this.state
    const previewUrl = this.getActivePreviewUrl()
    const {name, image, owner, description} = playlistInfo

    return (
      <div className="playlist-details-container">
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
        <div className="playlist-header">
          <img src={image} alt="playlist" className="playlist-image" />
          <div className="playlist-header-text">
            <p className="playlist-type">Editor&apos;s picks</p>
            <h1 className="playlist-title">{name}</h1>
            <p className="playlist-description">{description}</p>
            <p className="playlist-owner">{owner}</p>
          </div>
        </div>

        <div className="playlist-table-header">
          <span className="playlist-th-num" />
          <p className="playlist-th-track">Track</p>
          <p className="playlist-th-album">Album</p>
          <p className="playlist-th-time">Time</p>
          <p className="playlist-th-artist">Artist</p>
          <p className="playlist-th-added">Added</p>
        </div>

        {this.renderTracksList()}

        {previewUrl && (
          <div className="playlist-audio-player">
            <audio key={previewUrl} src={previewUrl} controls autoPlay>
              <track kind="captions" />
            </audio>
          </div>
        )}
      </div>
    )
  }

  renderPlaylistDetails = () => {
    const {apiStatus} = this.state
    switch (apiStatus) {
      case apiStatusConstants.inProgress:
        return <Loading />
      case apiStatusConstants.success:
        return this.renderSuccessView()
      case apiStatusConstants.failure:
        return <ErrorMsg retryApi={this.getPlaylistDetails} />
      default:
        return null
    }
  }

  render() {
    return (
      <div className="home-layout">
        <SideBar />
        <div className="home-main-section">{this.renderPlaylistDetails()}</div>
      </div>
    )
  }
}

export default PlaylistDetails

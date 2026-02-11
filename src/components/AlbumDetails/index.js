import {Component} from 'react'
import Cookies from 'js-cookie'
import moment from 'moment'
import {BiArrowBack} from 'react-icons/bi'

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

class AlbumDetails extends Component {
  state = {
    albumInfo: {},
    tracksList: [],
    apiStatus: apiStatusConstants.initial,
    activeTrackId: '',
  }

  componentDidMount() {
    this.getAlbumDetails()
  }

  getAlbumDetails = async () => {
    this.setState({apiStatus: apiStatusConstants.inProgress})

    const {match} = this.props
    const {id} = match.params
    const jwtToken = Cookies.get('jwt_token')

    const url = `https://apis2.ccbp.in/spotify-clone/album-details/${id}`

    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    }

    const response = await fetch(url, options)

    if (response.ok) {
      const data = await response.json()

      const albumInfo = {
        name: data.name,
        image: data.images[0].url,
        artists: data.artists.map(a => a.name).join(', '),
        releaseYear: moment(data.release_date).year(),
        popularity: data.popularity,
      }

      const tracksList = data.tracks.items.map(track => ({
        id: track.id,
        name: track.name,
        artists: track.artists.map(a => a.name),
        durationMs: track.duration_ms,
        previewUrl: track.preview_url,
        popularity: track.popularity ? track.popularity : data.popularity,
      }))

      this.setState({
        albumInfo,
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

  renderPopularityBars = popularity => {
    const filledCount = Math.round(popularity / 10)
    const range = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]

    return (
      <ul className="popularity-meter">
        {range.map(number => (
          <li
            key={`bar-${number}`}
            className={`meter-bar ${number < filledCount ? 'filled' : 'empty'}`}
          />
        ))}
      </ul>
    )
  }

  renderTracks = () => {
    const {tracksList, activeTrackId} = this.state

    return (
      <div className="tracks-container">
        <div className="tracks-header-row">
          <span className="track-header-cell cell-hash">#</span>
          <span className="track-header-cell cell-title">TRACK</span>
          <span className="track-header-cell cell-artist">ARTIST</span>
          <span className="track-header-cell cell-time">TIME</span>
          <span className="track-header-cell cell-popularity">POPULARITY</span>
        </div>

        <ul className="album-tracks-list">
          {tracksList.map((track, index) => (
            <li
              key={track.id}
              className={`album-track-item ${
                activeTrackId === track.id ? 'active-track' : ''
              }`}
              onClick={() => this.handleTrackClick(track.id)}
            >
              <div className="track-content-wrapper">
                <span className="album-track-number">{index + 1}</span>

                <div className="album-track-info">
                  <p className="album-track-name">{track.name}</p>
                </div>

                <p className="album-track-artist-col">
                  {track.artists.join(', ')}
                </p>

                <p className="album-track-duration">
                  {this.formatDuration(track.durationMs)}
                </p>

                <div className="album-track-popularity">
                  {this.renderPopularityBars(track.popularity)}
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    )
  }

  renderSuccessView = () => {
    const {albumInfo} = this.state
    const previewUrl = this.getActivePreviewUrl()

    return (
      <div className="album-details-container">
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

        <div className="album-header">
          <img src={albumInfo.image} alt="album" className="album-image" />

          <div className="album-header-text">
            <h1 className="album-title clamp-2">{albumInfo.name}</h1>

            <p className="album-subtitle">
              Album by {albumInfo.artists} · {albumInfo.releaseYear}
            </p>
          </div>
        </div>

        {this.renderTracks()}

        {previewUrl && (
          <div className="album-audio-player">
            <audio key={previewUrl} src={previewUrl} controls autoPlay>
              <track kind="captions" />
            </audio>
          </div>
        )}
      </div>
    )
  }

  renderAlbumDetails = () => {
    const {apiStatus} = this.state

    switch (apiStatus) {
      case apiStatusConstants.inProgress:
        return <Loading />
      case apiStatusConstants.success:
        return this.renderSuccessView()
      case apiStatusConstants.failure:
        return <ErrorMsg retryApi={this.getAlbumDetails} />
      default:
        return null
    }
  }

  render() {
    return (
      <div className="home-layout">
        <SideBar />
        <div className="home-main-section">{this.renderAlbumDetails()}</div>
      </div>
    )
  }
}

export default AlbumDetails

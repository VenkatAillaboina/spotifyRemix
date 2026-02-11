import {Component} from 'react'
import Cookies from 'js-cookie'

import Loading from '../Loading'
import ErrorMsg from '../ErrorMsg'

import Navbar from '../Navbar'
import SideBar from '../SideBar'
import EditorsPickItem from '../EditorsPickItem'
import GenreMoodItem from '../GenreMoodItem'
import NewReleaseItem from '../NewReleaseItem'

import './index.css'

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class Home extends Component {
  state = {
    editorsPick: [],
    genresAndMoods: [],
    newReleases: [],
    editorsPickStatus: apiStatusConstants.initial,
    genresAndMoodsStatus: apiStatusConstants.initial,
    newReleasesStatus: apiStatusConstants.initial,
  }

  componentDidMount() {
    this.getEditorsPicks()
    this.getGenresAndMoods()
    this.getNewReleases()
  }

  getEditorsPicks = async () => {
    this.setState({editorsPickStatus: apiStatusConstants.inProgress})
    const jwtToken = Cookies.get('jwt_token')

    const url = 'https://apis2.ccbp.in/spotify-clone/featured-playlists'

    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    }

    const response = await fetch(url, options)

    if (response.ok) {
      const data = await response.json()
      const updatedData = data.playlists.items.map(eachItem => ({
        id: eachItem.id,
        name: eachItem.name,
        image: eachItem.images[0].url,
      }))

      this.setState({
        editorsPick: updatedData,
        editorsPickStatus: apiStatusConstants.success,
      })
    } else {
      this.setState({editorsPickStatus: apiStatusConstants.failure})
    }
  }

  getGenresAndMoods = async () => {
    this.setState({genresAndMoodsStatus: apiStatusConstants.inProgress})
    const jwtToken = Cookies.get('jwt_token')

    const url = 'https://apis2.ccbp.in/spotify-clone/categories'

    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    }

    const response = await fetch(url, options)

    if (response.ok) {
      const data = await response.json()
      const updatedData = data.categories.items.map(eachItem => ({
        id: eachItem.id,
        name: eachItem.name,
        image: eachItem.icons[0].url,
      }))

      this.setState({
        genresAndMoods: updatedData,
        genresAndMoodsStatus: apiStatusConstants.success,
      })
    } else {
      this.setState({genresAndMoodsStatus: apiStatusConstants.failure})
    }
  }

  getNewReleases = async () => {
    this.setState({newReleasesStatus: apiStatusConstants.inProgress})
    const jwtToken = Cookies.get('jwt_token')

    const url = 'https://apis2.ccbp.in/spotify-clone/new-releases'

    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    }

    const response = await fetch(url, options)

    if (response.ok) {
      const data = await response.json()
      const updatedData = data.albums.items.map(eachItem => ({
        id: eachItem.id,
        name: eachItem.name,
        image: eachItem.images[0].url,
      }))

      this.setState({
        newReleases: updatedData,
        newReleasesStatus: apiStatusConstants.success,
      })
    } else {
      this.setState({newReleasesStatus: apiStatusConstants.failure})
    }
  }

  renderEditorsPicks = () => {
    const {editorsPick} = this.state
    return (
      <ul className="home-list-container">
        {editorsPick.map(eachItem => (
          <EditorsPickItem key={eachItem.id} details={eachItem} />
        ))}
      </ul>
    )
  }

  renderGenresAndMoods = () => {
    const {genresAndMoods} = this.state
    return (
      <ul className="home-genres-container">
        {genresAndMoods.map(eachItem => (
          <GenreMoodItem key={eachItem.id} details={eachItem} />
        ))}
      </ul>
    )
  }

  renderNewReleases = () => {
    const {newReleases} = this.state
    return (
      <ul className="home-list-container">
        {newReleases.map(eachItem => (
          <NewReleaseItem key={eachItem.id} details={eachItem} />
        ))}
      </ul>
    )
  }

  renderEditorsPicksSection = () => {
    const {editorsPickStatus} = this.state
    switch (editorsPickStatus) {
      case apiStatusConstants.inProgress:
        return (
          <div data-testid="loader" className="loader-wrapper">
            <Loading />
          </div>
        )
      case apiStatusConstants.success:
        return this.renderEditorsPicks()
      case apiStatusConstants.failure:
        return <ErrorMsg retryApi={this.getEditorsPicks} />
      default:
        return null
    }
  }

  renderGenresAndMoodsSection = () => {
    const {genresAndMoodsStatus} = this.state
    switch (genresAndMoodsStatus) {
      case apiStatusConstants.inProgress:
        return (
          <div data-testid="loader" className="loader-wrapper">
            <Loading />
          </div>
        )
      case apiStatusConstants.success:
        return this.renderGenresAndMoods()
      case apiStatusConstants.failure:
        return <ErrorMsg retryApi={this.getGenresAndMoods} />
      default:
        return null
    }
  }

  renderNewReleasesSection = () => {
    const {newReleasesStatus} = this.state
    switch (newReleasesStatus) {
      case apiStatusConstants.inProgress:
        return (
          <div data-testid="loader" className="loader-wrapper">
            <Loading />
          </div>
        )
      case apiStatusConstants.success:
        return this.renderNewReleases()
      case apiStatusConstants.failure:
        return <ErrorMsg retryApi={this.getNewReleases} />
      default:
        return null
    }
  }

  render() {
    return (
      <div className="home-layout">
        <SideBar />
        <div className="home-main-section">
          <Navbar />
          <div className="home-container">
            <h1 className="home-heading">Editor&apos;s picks</h1>
            {this.renderEditorsPicksSection()}

            <h1 className="home-heading">Genres & Moods</h1>
            {this.renderGenresAndMoodsSection()}

            <h1 className="home-heading">New releases</h1>
            {this.renderNewReleasesSection()}
          </div>
        </div>
      </div>
    )
  }
}

export default Home

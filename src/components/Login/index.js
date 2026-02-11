import {Component} from 'react'
import {Redirect} from 'react-router-dom'
import Cookies from 'js-cookie'
import './index.css'

class Login extends Component {
  state = {username: '', password: '', showSubmitError: false, errorMsg: ''}

  onChangeUsername = event => {
    this.setState({username: event.target.value})
  }

  onChangePassword = event => {
    this.setState({password: event.target.value})
  }

  onSubmitSuccess = jwtToken => {
    const {history} = this.props
    Cookies.set('jwt_token', jwtToken, {expires: 30, path: '/'})
    history.replace('/')
  }

  onSubmitFailure = errorMsg => {
    this.setState({showSubmitError: true, errorMsg})
  }

  onSubmitLogin = async event => {
    event.preventDefault()
    const {username, password} = this.state
    const userDetails = {username, password}
    const url = 'https://apis.ccbp.in/login'
    const options = {
      method: 'POST',
      body: JSON.stringify(userDetails),
    }
    const response = await fetch(url, options)
    const data = await response.json()
    if (response.ok) {
      this.onSubmitSuccess(data.jwt_token)
    } else {
      this.onSubmitFailure(data.error_msg)
    }
  }

  render() {
    const {username, password, showSubmitError, errorMsg} = this.state
    const jwtToken = Cookies.get('jwt_token')
    if (jwtToken) {
      return <Redirect to="/" />
    }
    return (
      <div className="login-page-bg-container">
        <div className="login-page-card">
          <img
            src="https://res.cloudinary.com/dowtoiurd/image/upload/v1770400313/logo_p4jmly.svg"
            alt="login website logo"
            className="login-page-logo"
          />

          <h1 className="login-page-title">Spotify Remix</h1>

          <form className="login-page-form" onSubmit={this.onSubmitLogin}>
            <div className="login-page-input-group">
              <label htmlFor="username" className="login-page-label">
                USERNAME
              </label>
              <input
                id="username"
                type="text"
                value={username}
                className="login-page-input"
                onChange={this.onChangeUsername}
              />
            </div>

            <div className="login-page-input-group">
              <label htmlFor="password" className="login-page-label">
                PASSWORD
              </label>
              <input
                id="password"
                type="password"
                value={password}
                className="login-page-input"
                onChange={this.onChangePassword}
              />
            </div>

            <button type="submit" className="login-page-login-button">
              LOGIN
            </button>

            {showSubmitError && (
              <p className="login-page-error-msg">*{errorMsg}</p>
            )}
          </form>
        </div>
      </div>
    )
  }
}

export default Login

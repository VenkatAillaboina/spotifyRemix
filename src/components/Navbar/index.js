import {Component} from 'react'
import {FiMenu, FiLogOut} from 'react-icons/fi'
import {GiCrossMark} from 'react-icons/gi'
import {withRouter} from 'react-router-dom'
import Cookies from 'js-cookie'

import './index.css'

class Navbar extends Component {
  state = {isMenuOpen: false}

  onClickLogout = () => {
    const {history} = this.props
    Cookies.remove('jwt_token')
    history.replace('/login')
  }

  OnClickIsMenuOpen = () => {
    this.setState(prev => ({isMenuOpen: !prev.isMenuOpen}))
  }

  render() {
    const {isMenuOpen} = this.state

    return (
      <nav className="navbar-container">
        <div className="navbar-top-row">
          <img
            src="https://res.cloudinary.com/dowtoiurd/image/upload/v1770400313/logo_p4jmly.svg"
            alt="website logo"
            className="navbar-logo"
          />

          <button
            type="button"
            className="navbar-hamburger-and-cross-btn"
            onClick={this.OnClickIsMenuOpen}
          >
            {isMenuOpen ? <GiCrossMark /> : <FiMenu />}
          </button>
        </div>

        {isMenuOpen && (
          <ul className="navbar-menu">
            <li>
              <button
                type="button"
                className="navbar-logout-btn"
                onClick={this.onClickLogout}
              >
                <FiLogOut className="navbar-logout-icon" />
                Logout
              </button>
            </li>
          </ul>
        )}
      </nav>
    )
  }
}

export default withRouter(Navbar)

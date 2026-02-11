import {Component} from 'react'
import {FiLogOut} from 'react-icons/fi'
import {withRouter} from 'react-router-dom'
import Cookies from 'js-cookie'

import './index.css'

class SideBar extends Component {
  onClickLogout = () => {
    const {history} = this.props
    Cookies.remove('jwt_token')
    history.replace('/login')
  }

  render() {
    return (
      <div className="sidebar-container">
        <div className="sidebar-top">
          <img
            src="https://res.cloudinary.com/dowtoiurd/image/upload/v1770400313/logo_p4jmly.svg"
            alt="website logo"
            className="sidebar-logo"
          />
        </div>

        <button
          type="button"
          className="sidebar-logout-btn"
          onClick={this.onClickLogout}
        >
          <FiLogOut className="sidebar-logout-icon" />
          Logout
        </button>
      </div>
    )
  }
}

export default withRouter(SideBar)

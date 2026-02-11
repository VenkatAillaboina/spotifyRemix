import {Route, Switch} from 'react-router-dom'

import Login from './components/Login'
import Home from './components/Home'
import PlaylistDetails from './components/PlaylistDetails'
import CategoryPlaylists from './components/CategoryPlaylists'
import AlbumDetails from './components/AlbumDetails'
import NotFound from './components/NotFound'

import ProtectedRoute from './components/ProtectedRoute'

import './App.css'

const App = () => (
  <Switch>
    <Route exact path="/login" component={Login} />
    <ProtectedRoute exact path="/" component={Home} />
    <ProtectedRoute exact path="/playlist/:id" component={PlaylistDetails} />
    <ProtectedRoute
      exact
      path="/category/:id/playlists"
      component={CategoryPlaylists}
    />
    <ProtectedRoute exact path="/album/:id" component={AlbumDetails} />
    <Route component={NotFound} />
  </Switch>
)
export default App

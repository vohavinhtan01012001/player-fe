import Game from "../pages/admin/game/Game"
import Player from "../pages/admin/player/Player"
import User from "../pages/admin/user/User"
import DefaultAuth from "../pages/auth/DefaultAuth"
import Collection from "../pages/client/collection/Collection"
import DetailPlayer from "../pages/client/detailPlayer/DetailPlayer"
import FormSignUpPlayer from "../pages/client/formSignUpPlayer/FormSignUpPlayer"
import Home from "../pages/client/home/Home"
import Profile from "../pages/client/profile/Profile"
import rentalRequestList from "../pages/client/rentalRequest/RentalRequest"
import Thanks from "../pages/client/thanks/Thanks"

const authRouters = [
  {
    path: '/login',
    component: DefaultAuth
  }
]

const publicRoutes = [
  {
    path: '/',
    component:Home
  },
  {
    path: '/collection/:id',
    component: Collection
  },
  {
    path: '/player/:id',
    component: DetailPlayer
  },
  {
    path: '/sign-up-player',
    component: FormSignUpPlayer
  },
  {
    path: '/thanks',
    component: Thanks
  },
  {
    path: '/profile',
    component: Profile
  },
  {
    path: '/rental-request-list',
    component:rentalRequestList 
  }
]

const privateRoutes = [
  {
    path: '/users',
    component: User
  },
  {
    path: '/players',
    component: Player
  },
  {
    path: '/games',
    component: Game
  },
]

export { privateRoutes, authRouters, publicRoutes }

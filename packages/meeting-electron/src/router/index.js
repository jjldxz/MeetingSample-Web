import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import Login from '../views/Login'
import Setting from '../views/Setting'
import Meeting from '../views/Meeting'
import ScreenMarker from '../views/ScreenMarker'
import ScreenMarkerBar from '../views/ScreenMarkerBar'
import WindowShareInd from '../views/WindowShareInd'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Main',
    component: Login
  },
  {
    path: '/home',
    name: 'Home',
    component: Home
  },
  {
    path: '/setting',
    name: 'Setting',
    component: Setting,
    children: [
      {
        path: 'video',
        name: 'video',
        component: () =>
          import(/* webpackChunkName: "about" */ '../components/setting/videoView')
      },
      {
        path: 'audio',
        name: 'audio',
        component: () =>
          import(/* webpackChunkName: "about" */ '../components/setting/audioView')
      },
      {
        path: 'network',
        name: 'network',
        component: () =>
          import(/* webpackChunkName: "about" */ '../components/setting/networkView')
      }
    ]
  },
  {
    path: '/meeting',
    name: 'Meeting',
    component: Meeting
  },
  {
    path: '/marker',
    name: 'ScreenMarker',
    component: ScreenMarker
  },
  {
    path: '/markerBar',
    name: 'ScreenMarkerBar',
    component: ScreenMarkerBar
  },
  {
    path: '/winShareInd/:type/:id/',
    name: 'WindowShareInd',
    component: WindowShareInd
  }
]

const router = new VueRouter({
  routes
})

export default router

import { createMemoryHistory, createRouter } from 'vue-router'

import LobbyView from '../lobby/Lobby.vue'
import VotingView from '../lobby/VotingStage.vue'

const routes = [
  { path: '/', component: LobbyView },
  { path: '/voting', component: VotingView }
]

export const router = createRouter({
  history: createMemoryHistory(),
  routes,
})
import { createMemoryHistory, createRouter } from 'vue-router'

import LobbyView from '../lobby/Lobby.vue'
import VotingView from '../lobby/VotingStage.vue'
import SendResultsView from '../lobby/SendResults.vue'
import ResultsView from '../lobby/Results.vue'
import AwaitingResultsView from '../lobby/AwaitingResults.vue'

const routes = [
  { path: '/', component: LobbyView },
  { path: '/voting', component: VotingView },
  { path: '/confirmResults', component: SendResultsView },
  { path: '/results', component: ResultsView},
  { path: '/awaitResults', component: AwaitingResultsView}
]

export const router = createRouter({
  history: createMemoryHistory(),
  routes,
})
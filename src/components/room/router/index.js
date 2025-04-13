import { createMemoryHistory, createRouter } from 'vue-router'

import LobbyView from '../lobby/views/LobbyView.vue'
import VotingView from '../lobby/views/VotingStageView.vue'
import SendResultsView from '../lobby/views/SendResultsView.vue'
import ResultsView from '../lobby/views/ResultsView.vue'
import AwaitingResultsView from '../lobby/views/AwaitingResultsView.vue'

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
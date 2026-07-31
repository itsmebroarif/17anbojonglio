import { createRouter, createWebHistory } from 'vue-router';
import Dashboard from '../pages/Dashboard.vue';
import Competitions from '../pages/Competitions.vue';
import Registration from '../pages/Registration.vue';
import WaitingLounge from '../pages/WaitingLounge.vue';
import CompetitionBoard from '../pages/CompetitionBoard.vue';
import Scoring from '../pages/Scoring.vue';
import Results from '../pages/Results.vue';
import ResultingPoint from '../pages/ResultingPoint.vue';
import HallOfFame from '../pages/HallOfFame.vue';
import Certificates from '../pages/Certificates.vue';
import CommitteeCards from '../pages/CommitteeCards.vue';
import LuckySpin from '../pages/LuckySpin.vue';
import ImportExport from '../pages/ImportExport.vue';
import Settings from '../pages/Settings.vue';

const routes = [
  { path: '/', name: 'Dashboard', component: Dashboard },
  { path: '/competitions', name: 'Competitions', component: Competitions },
  { path: '/registration', name: 'Registration', component: Registration },
  { path: '/waiting-lounge', name: 'WaitingLounge', component: WaitingLounge },
  { path: '/competition-board', name: 'CompetitionBoard', component: CompetitionBoard },
  { path: '/scoring', name: 'Scoring', component: Scoring },
  { path: '/results', name: 'Results', component: Results },
  { path: '/resulting-point', name: 'ResultingPoint', component: ResultingPoint },
  { path: '/hall-of-fame', name: 'HallOfFame', component: HallOfFame },
  { path: '/certificates', name: 'Certificates', component: Certificates },
  { path: '/committee', name: 'CommitteeCards', component: CommitteeCards },
  { path: '/lucky-spin', name: 'LuckySpin', component: LuckySpin },
  { path: '/import-export', name: 'ImportExport', component: ImportExport },
  { path: '/settings', name: 'Settings', component: Settings }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior() {
    return { top: 0 };
  }
});

export default router;

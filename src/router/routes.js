
const routes = [
  {
    path: '/',
    component: () => import('layouts/Home.vue'),
    children: [
      { path: '', component: () => import('pages/TudienNangluc.vue') },
      { path: 'framework', component: () => import('pages/KhungNangluc.vue') },
      { path: 'standard/:job_id/:org_id/:job_name/:org_name', component: () => import('pages/TieuchuanNangluc.vue') },
    ],
  },
  {
    path: '/framework',
    component: () => import('pages/KhungNangluc.vue'),
  },
];

// Always leave this as last one
if (process.env.MODE !== 'ssr') {
  routes.push({
    path: '*',
    component: () => import('pages/Error404.vue'),
  });
}

export default routes;

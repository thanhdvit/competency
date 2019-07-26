
const routes = [
  {
    path: '/',
    component: () => import('layouts/Home.vue'),
    children: [
      {
        path: '/login',
        component: () => import('pages/Login.vue'),
      },
      {
        path: '',
        component: () => import('pages/NhanvienCuaQuanly.vue'),
        meta: { requiresAuth: true },
      },
      {
        path: '/ability/dictionary',
        component: () => import('pages/TudienNangluc.vue'),
        meta: { requiresAuth: true },
      },
      {
        path: 'standard/:job_id/:org_id/:job_name/:org_name',
        component: () => import('pages/TieuchuanNangluc.vue'),
        meta: { requiresAuth: true },
      },
      {
        path: 'estimate/:estimate_id/:estimate_period',
        component: () => import('pages/DanhgiaNangluc.vue'),
        meta: { requiresAuth: true },
      },
      {
        path: '/framework',
        component: () => import('pages/KhungNangluc.vue'),
        meta: { requiresAuth: true },
      },
      {
        path: '/hoidong/role',
        component: () => import('pages/PhanquyenHoidong.vue'),
        meta: { requiresAuth: true },
      },
      {
        path: '/hoidong/estimate',
        component: () => import('pages/NhanvienCuaHoidong.vue'),
        meta: { requiresAuth: true },
      },
      {
        path: '/import/tudien-nangluc',
        component: () => import('pages/ImportDanhmucTudienNangluc.vue'),
        meta: { requiresAuth: true },
      },
    ],
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

import Todos from 'TodoRouterDir/containers/Todos';

const routes = [
  {
    name: 'allTodos',
    path: '/',
    component: Todos,
  },
  {
    name: 'completedTodos',
    path: '/completed',
    component: Todos,
  },
  {
    name: 'incompleteTodos',
    path: '/incomplete',
    component: Todos,
  },
];

// routesの設定を適用する為にexportする
export default routes;

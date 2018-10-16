import { Routes } from 'Shared/utils/routeManager';
const routes = new Routes({
  query: {
    url: '/',
    title: getString("routes.1bfee245", "查询")
  },
  import: {
    url: '/import',
    title: getString("routes.74f2b552", "导入")
  },
  update: {
    url: '/:id/update',
    title: getString("routes.6a60ec2a", "更新"),
    format: '/{0}/update'
  },
  detail: {
    url: '/:id/detail',
    title: getString("routes.0f0ad778", "详情"),
    format: '/{0}/detail'
  }
});
export default routes;
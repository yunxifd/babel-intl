import {Routes} from 'Shared/utils/routeManager';

const routes = new Routes({
    query: {
        url: '/',
        title: '查询'
    },
    import: {
        url: '/import',
        title: '导入',
    },
    update: {
        url: '/:id/update',
        title: '更新',
        format: '/{0}/update'
    },
    detail: {
        url: '/:id/detail',
        title: '详情',
        format: '/{0}/detail'
    }
});

export default routes;

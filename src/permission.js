import router from './router';
import store from './store';
import NProgress from 'nprogress'; // Progress 进度条
import 'nprogress/nprogress.css'; // Progress 进度条样式

router.beforeEach((to, from, next) => {
    NProgress.start();

    if (store.getters.roles.length === 0) {
        store
            .dispatch('GetInfo')
            .then((res) => {
                // 拉取用户信息
                let menus = res.data.menus;
                let username = res.data.username;

                store.dispatch('GenerateRoutes', { menus, username }).then(() => {
                    // 生成可访问的路由表

                    const routers = store.getters.addRouters;
                    routers.forEach((route) => {
                        router.addRoute(route);
                    });

                    next({ ...to, replace: true });
                });
            })
            .catch(() => {
                next({ path: '/' });
            });
    } else {
        next();
    }
});

router.afterEach(() => {
    NProgress.done(); // 结束Progress
});

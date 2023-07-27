import axios from 'axios';
import { ElMessage as Message, ElMessageBox as MessageBox } from 'element-plus';

// 创建axios实例
const service = axios.create({
    baseURL: process.env.BASE_API, // api的base_url
    timeout: 15000 // 请求超时时间
});

// request拦截器
service.interceptors.request.use(
    (config) => {
        return config;
    },
    (error) => {
        // Do something with request error
        console.log(error); // for debug
        Promise.reject(error);
    }
);

// respone拦截器
service.interceptors.response.use(
    (response) => {
        /**
         * code为非200是抛错 可结合自己业务进行修改
         */
        const res = response.data;
        if (res.code !== 200) {
            Message({
                message: res.message,
                type: 'error',
                duration: 3 * 1000
            });

            // 401:未登录;
            if (res.code === 401) {
                MessageBox.confirm('你已被登出，可以取消继续留在该页面，或者重新登录', '确定登出', {
                    confirmButtonText: '重新登录',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    if (typeof window.globalInfo?.gotoLogin === 'function') {
                        window.globalInfo.gotoLogin();
                    }
                });
            }
            return Promise.reject('error');
        } else {
            return response.data;
        }
    },
    (error) => {
        console.log('err' + error); // for debug
        Message({
            message: error.message,
            type: 'error',
            duration: 3 * 1000
        });
        return Promise.reject(error);
    }
);

export default service;

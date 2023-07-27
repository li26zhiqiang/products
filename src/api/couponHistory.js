import request from '@/api/request';
export function fetchList(params) {
    return request({
        url: '/tytech-admin/couponHistory/list',
        method: 'get',
        params: params
    });
}

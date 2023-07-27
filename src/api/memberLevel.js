import request from '@/api/request';

export function fetchList(params) {
    return request({
        url: '/tytech-admin/memberLevel/list',
        method: 'get',
        params: params
    });
}

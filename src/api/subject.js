import request from '@/api/request';

export function fetchListAll() {
    return request({
        url: '/tytech-admin/subject/listAll',
        method: 'get'
    });
}

export function fetchList(params) {
    return request({
        url: '/tytech-admin/subject/list',
        method: 'get',
        params: params
    });
}

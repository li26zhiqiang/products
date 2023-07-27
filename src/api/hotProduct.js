import request from '@/api/request';
export function fetchList(params) {
    return request({
        url: '/tytech-admin/home/recommendProduct/list',
        method: 'get',
        params: params
    });
}

export function updateRecommendStatus(data) {
    return request({
        url: '/tytech-admin/home/recommendProduct/update/recommendStatus',
        method: 'post',
        data: data
    });
}

export function deleteHotProduct(data) {
    return request({
        url: '/tytech-admin/home/recommendProduct/delete',
        method: 'post',
        data: data
    });
}

export function createHotProduct(data) {
    return request({
        url: '/tytech-admin/home/recommendProduct/create',
        method: 'post',
        data: data
    });
}

export function updateHotProductSort(params) {
    return request({
        url: '/tytech-admin/home/recommendProduct/update/sort/' + params.id,
        method: 'post',
        params: params
    });
}

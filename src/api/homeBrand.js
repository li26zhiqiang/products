import request from '@/api/request';
export function fetchList(params) {
    return request({
        url: '/tytech-admin/home/brand/list',
        method: 'get',
        params: params
    });
}

export function updateRecommendStatus(data) {
    return request({
        url: '/tytech-admin/home/brand/update/recommendStatus',
        method: 'post',
        data: data
    });
}

export function deleteHomeBrand(data) {
    return request({
        url: '/tytech-admin/home/brand/delete',
        method: 'post',
        data: data
    });
}

export function createHomeBrand(data) {
    return request({
        url: '/tytech-admin/home/brand/create',
        method: 'post',
        data: data
    });
}

export function updateHomeBrandSort(params) {
    return request({
        url: '/tytech-admin/home/brand/update/sort/' + params.id,
        method: 'post',
        params: params
    });
}

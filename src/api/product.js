import request from '@/api/request';
export function fetchList(params) {
    return request({
        url: '/tytech-admin/product/list',
        method: 'get',
        params: params
    });
}

export function fetchSimpleList(params) {
    return request({
        url: '/tytech-admin/product/simpleList',
        method: 'get',
        params: params
    });
}

export function updateDeleteStatus(params) {
    return request({
        url: '/tytech-admin/product/update/deleteStatus',
        method: 'post',
        params: params
    });
}

export function updateNewStatus(params) {
    return request({
        url: '/tytech-admin/product/update/newStatus',
        method: 'post',
        params: params
    });
}

export function updateRecommendStatus(params) {
    return request({
        url: '/tytech-admin/product/update/recommendStatus',
        method: 'post',
        params: params
    });
}

export function updatePublishStatus(params) {
    return request({
        url: '/tytech-admin/product/update/publishStatus',
        method: 'post',
        params: params
    });
}

export function createProduct(data) {
    return request({
        url: '/tytech-admin/product/create',
        method: 'post',
        data: data
    });
}

export function updateProduct(id, data) {
    return request({
        url: '/tytech-admin/product/update/' + id,
        method: 'post',
        data: data
    });
}

export function getProduct(id) {
    return request({
        url: '/tytech-admin/product/updateInfo/' + id,
        method: 'get'
    });
}

import request from '@/api/request';
export function fetchList(params) {
    return request({
        url: '/tytech-admin/brand/list',
        method: 'get',
        params: params
    });
}
export function createBrand(data) {
    return request({
        url: '/tytech-admin/brand/create',
        method: 'post',
        data: data
    });
}
export function updateShowStatus(data) {
    return request({
        url: '/tytech-admin/brand/update/showStatus',
        method: 'post',
        data: data
    });
}

export function updateFactoryStatus(data) {
    return request({
        url: '/tytech-admin/brand/update/factoryStatus',
        method: 'post',
        data: data
    });
}

export function deleteBrand(id) {
    return request({
        url: '/tytech-admin/brand/delete/' + id,
        method: 'get'
    });
}

export function getBrand(id) {
    return request({
        url: '/tytech-admin/brand/' + id,
        method: 'get'
    });
}

export function updateBrand(id, data) {
    return request({
        url: '/tytech-admin/brand/update/' + id,
        method: 'post',
        data: data
    });
}

import request from '@/api/request';
export function fetchList(params) {
    return request({
        url: '/tytech-admin/productAttribute/category/list',
        method: 'get',
        params: params
    });
}

export function createProductAttrCate(data) {
    return request({
        url: '/tytech-admin/productAttribute/category/create',
        method: 'post',
        data: data
    });
}

export function deleteProductAttrCate(id) {
    return request({
        url: '/tytech-admin/productAttribute/category/delete/' + id,
        method: 'get'
    });
}

export function updateProductAttrCate(id, data) {
    return request({
        url: '/tytech-admin/productAttribute/category/update/' + id,
        method: 'post',
        data: data
    });
}
export function fetchListWithAttr() {
    return request({
        url: '/tytech-admin/productAttribute/category/list/withAttr',
        method: 'get'
    });
}

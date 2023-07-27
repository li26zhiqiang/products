import request from '@/api/request';
export function fetchList(params) {
    return request({
        url: '/tytech-admin/coupon/list',
        method: 'get',
        params: params
    });
}

export function createCoupon(data) {
    return request({
        url: '/tytech-admin/coupon/create',
        method: 'post',
        data: data
    });
}

export function getCoupon(id) {
    return request({
        url: '/tytech-admin/coupon/' + id,
        method: 'get'
    });
}

export function updateCoupon(id, data) {
    return request({
        url: '/tytech-admin/coupon/update/' + id,
        method: 'post',
        data: data
    });
}

export function deleteCoupon(id) {
    return request({
        url: '/tytech-admin/coupon/delete/' + id,
        method: 'post'
    });
}

import request from '@/api/request';
export function getOrderSetting(id) {
    return request({
        url: '/tytech-admin/orderSetting/' + id,
        method: 'get'
    });
}

export function updateOrderSetting(id, data) {
    return request({
        url: '/tytech-admin/orderSetting/update/' + id,
        method: 'post',
        data: data
    });
}

import request from '@/api/request';
export function fetchList(params) {
    return request({
        url: '/tytech-admin/order/list',
        method: 'get',
        params: params
    });
}

export function closeOrder(params) {
    return request({
        url: '/tytech-admin/order/update/close',
        method: 'post',
        params: params
    });
}

export function deleteOrder(params) {
    return request({
        url: '/tytech-admin/order/delete',
        method: 'post',
        params: params
    });
}

export function deliveryOrder(data) {
    return request({
        url: '/tytech-admin/order/update/delivery',
        method: 'post',
        data: data
    });
}

export function getOrderDetail(id) {
    return request({
        url: '/tytech-admin/order/' + id,
        method: 'get'
    });
}

export function updateReceiverInfo(data) {
    return request({
        url: '/tytech-admin/order/update/receiverInfo',
        method: 'post',
        data: data
    });
}

export function updateMoneyInfo(data) {
    return request({
        url: '/tytech-admin/order/update/moneyInfo',
        method: 'post',
        data: data
    });
}

export function updateOrderNote(params) {
    return request({
        url: '/tytech-admin/order/update/note',
        method: 'post',
        params: params
    });
}

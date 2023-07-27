import request from '@/api/request';
export function fetchList(params) {
    return request({
        url: '/tytech-admin/returnReason/list',
        method: 'get',
        params: params
    });
}

export function deleteReason(params) {
    return request({
        url: '/tytech-admin/returnReason/delete',
        method: 'post',
        params: params
    });
}

export function updateStatus(params) {
    return request({
        url: '/tytech-admin/returnReason/update/status',
        method: 'post',
        params: params
    });
}

export function addReason(data) {
    return request({
        url: '/tytech-admin/returnReason/create',
        method: 'post',
        data: data
    });
}

export function getReasonDetail(id) {
    return request({
        url: '/tytech-admin/returnReason/' + id,
        method: 'get'
    });
}

export function updateReason(id, data) {
    return request({
        url: '/tytech-admin/returnReason/update/' + id,
        method: 'post',
        data: data
    });
}

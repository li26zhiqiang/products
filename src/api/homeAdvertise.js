import request from '@/api/request';
export function fetchList(params) {
    return request({
        url: '/tytech-admin/home/advertise/list',
        method: 'get',
        params: params
    });
}
export function updateStatus(id, params) {
    return request({
        url: '/tytech-admin/home/advertise/update/status/' + id,
        method: 'post',
        params: params
    });
}
export function deleteHomeAdvertise(data) {
    return request({
        url: '/tytech-admin/home/advertise/delete',
        method: 'post',
        data: data
    });
}
export function createHomeAdvertise(data) {
    return request({
        url: '/tytech-admin/home/advertise/create',
        method: 'post',
        data: data
    });
}
export function getHomeAdvertise(id) {
    return request({
        url: '/tytech-admin/home/advertise/' + id,
        method: 'get'
    });
}

export function updateHomeAdvertise(id, data) {
    return request({
        url: '/tytech-admin/home/advertise/update/' + id,
        method: 'post',
        data: data
    });
}

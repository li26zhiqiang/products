import request from '@/api/request';
export function fetchList(params) {
    return request({
        url: '/tytech-admin/flashProductRelation/list',
        method: 'get',
        params: params
    });
}
export function createFlashProductRelation(data) {
    return request({
        url: '/tytech-admin/flashProductRelation/create',
        method: 'post',
        data: data
    });
}
export function deleteFlashProductRelation(id) {
    return request({
        url: '/tytech-admin/flashProductRelation/delete/' + id,
        method: 'post'
    });
}
export function updateFlashProductRelation(id, data) {
    return request({
        url: '/tytech-admin/flashProductRelation/update/' + id,
        method: 'post',
        data: data
    });
}

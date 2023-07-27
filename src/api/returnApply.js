import request from '@/api/request';
export function fetchList(params) {
    return request({
        url: '/tytech-admin/returnApply/list',
        method: 'get',
        params: params
    });
}

export function deleteApply(params) {
    return request({
        url: '/tytech-admin/returnApply/delete',
        method: 'post',
        params: params
    });
}
export function updateApplyStatus(id, data) {
    return request({
        url: '/tytech-admin/returnApply/update/status/' + id,
        method: 'post',
        data: data
    });
}

export function getApplyDetail(id) {
    return request({
        url: '/tytech-admin/returnApply/' + id,
        method: 'get'
    });
}

import request from '@/api/request';
export function fetchList(pid, params) {
    return request({
        url: '/tytech-admin/sku/' + pid,
        method: 'get',
        params: params
    });
}

export function update(pid, data) {
    return request({
        url: '/tytech-admin/sku/update/' + pid,
        method: 'post',
        data: data
    });
}

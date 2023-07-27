import request from '@/api/request';
export function fetchList() {
    return request({
        url: '/tytech-admin/companyAddress/list',
        method: 'get'
    });
}

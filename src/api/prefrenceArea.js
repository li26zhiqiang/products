import request from '@/api/request';
export function fetchList() {
    return request({
        url: '/tytech-admin/prefrenceArea/listAll',
        method: 'get'
    });
}

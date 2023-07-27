import request from '@/api/request';
export function policy() {
    return request({
        url: '/tytech-admin/aliyun/oss/policy',
        method: 'get'
    });
}

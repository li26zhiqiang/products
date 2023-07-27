import request from '@/api/request';

export function uploadImg({ formData }) {
    return request({
        url: '/tytech-admin/product/images',
        method: 'POST',
        data: formData
    });
}

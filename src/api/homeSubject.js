import request from '@/api/request';
export function fetchList(params) {
    return request({
        url: '/tytech-admin/home/recommendSubject/list',
        method: 'get',
        params: params
    });
}

export function updateRecommendStatus(data) {
    return request({
        url: '/tytech-admin/home/recommendSubject/update/recommendStatus',
        method: 'post',
        data: data
    });
}

export function deleteHomeSubject(data) {
    return request({
        url: '/tytech-admin/home/recommendSubject/delete',
        method: 'post',
        data: data
    });
}

export function createHomeSubject(data) {
    return request({
        url: '/tytech-admin/home/recommendSubject/create',
        method: 'post',
        data: data
    });
}

export function updateHomeSubjectSort(params) {
    return request({
        url: '/tytech-admin/home/recommendSubject/update/sort/' + params.id,
        method: 'post',
        params: params
    });
}

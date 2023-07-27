import request from './request';
import path from './path';
import userInfo from './mockData/userInfo';

export function getInfo() {
    return request({
        url: path.userInfo,
        method: 'get'
    });

    // return new Promise((resolve, reject) => {
    //     resolve(userInfo);
    // });
}

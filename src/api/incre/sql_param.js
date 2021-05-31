import request from '@/utils/httpRequest';

export function getSqlList(data) {
    return request({
        url: request.adornUrl('/transformModel/querySqlList'),
        method: 'get',
        params: request.adornParams(data),
    });
}

export function getKeyOptions(data) {
    return request({
        url: request.adornUrl('/transformModel/getKeyValue'),
        method: 'get',
        params: request.adornParams(data),
    });
}

export function getMethodAndCode(data) {
    return request({
        url: request.adornUrl('/analysis/getMethodAndCode'),
        method: 'get',
        params: request.adornParams(data),
    });
}

export function deleteSummary(data) {
    return request({
        url: request.adornUrl('/transformModel/deleteSummary'),
        method: 'post',
        data: request.adornData(data,false),
    });
}
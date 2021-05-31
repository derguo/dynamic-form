import request from '@/utils/httpRequest';

export function getIncreEnList(data) {
    return request({
        url: request.adornUrl('/incre/endecrypt/config/list'),
        method: 'get',
        params: request.adornParams(data),
    });
}

export function getTypes(data) {
    return request({
        url: request.adornUrl('/sys/config/dict/list/v1'),
        method: 'POST',
        data: request.adornData(data),
    });
}

export function getIncreDbId(data, url) {
    return request({
        url: request.adornUrl('/dbInfo/suggest/v1?'+data),
        method: 'get',
    });
}

export function searchTable(data) {
    return request({
        url: request.adornUrl('/table/list'),
        method: 'POST',
        params: request.adornParams(data),
    });
}

export function searchColumn(data) {
    return request({
        url: request.adornUrl('/column/getcols'),
        method: 'POST',
        data: request.adornData(data,false),
    });
}

export function insertList(data) {
    return request({
        url: request.adornUrl('/incre/endecrypt/config/save'),
        method: 'POST',
        data: request.adornData(data),
    });
}

export function updateList(data) {
    return request({
        url: request.adornUrl('/incre/endecrypt/config/update'),
        method: 'POST',
        data: request.adornData(data),
    });
}

export function deleteList(data) {
    return request({
        url: request.adornUrl('/incre/endecrypt/config/delete'),
        method: 'POST',
        data: request.adornData(data,false),
    });
}
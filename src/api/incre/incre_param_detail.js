import request from '@/utils/httpRequest';

export function getIncreServiceList(data) {
    return request({
        // url: request.adornUrl('/incre/service/list'),
        url: request.adornUrl('/incre/service/valid/list'),
        method: 'get',
    });
}

export function getIncreTaskList(data, url) {
    return request({
        url: url + '/incre/task/list',
        method: 'get',
        params: request.adornParams(data),
    });
}

export function getDictListV1(url) {
    return request({
        url: url + '/dict/list/v1',
        method: 'post',
        data: request.adornData({
            types: [
                'TestType',
                'WhetherType',
                'ApplicationType',
                'TaskState',
                'TableBoundary',
                'TriggerType',
                'ArchivingType',
                'EnDeCryptType',
            ],
        }),
    });
}

export function increTaskDelete(ids, url) {
    return request({
        url: url + '/incre/task/delete',
        method: 'post',
        data: request.adornData(ids, false),
    });
}

export function increTaskStart(id, url) {
    return request({
        url: url + '/incre/task/start',
        method: 'post',
        data: request.adornData(id, false),
    });
}

export function increTaskStop(id, url) {
    return request({
        url: url + '/incre/task/stop',
        method: 'post',
        data: request.adornData(id, false),
    });
}

export function getIncreServiceDbInfo(params) {
    return request({
        url: request.adornUrl('/transformModel/get/increService/dbInfo'),
        method: 'get',
        params: request.adornParams(params),
    });
}

export function increTaskSave(data, url) {
    return request({
        url: url + '/incre/task/save',
        method: 'post',
        data: request.adornData(data),
    });
}

export function increTaskUpdate(data, url) {
    return request({
        url: url + '/incre/task/update',
        method: 'post',
        data: request.adornData(data),
    });
}

export function getCdmvAndDbName(params) {
    return request({
        url: request.adornUrl('/clean/getCdmvAndDbName'),
        method: 'get',
    });
}

export function getModeInfoV1(params) {
    return request({
        url: request.adornUrl('/dbInfo/getModeInfo/v1'),
        method: 'get',
        params: request.adornParams(params),
    });
}




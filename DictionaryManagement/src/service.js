import request from './utils/request';

export async function queryList(params) {
    return request('/dict/list', {
        params
    });
}

export async function add(params) {
    return request('/dict/add', {
        method: "post",
        data: {
            ...params
        }
    });
}

export async function update(params) {
    return request('/dict/update', {
        method: "post",
        data: params
    });
}

export async function deleteDictionary(data) {
    const { dictId = '' } = data;
    return request(`/dict/delete/${dictId}`);
}


export async function queryOptionList(params) {
    return request('/dictopt/allopt', {
        params
    });
}

export async function addOption(params) {
    return request('/dictopt/add', {
        method: "post",
        data: {
            ...params
        }
    });
}

export async function updateOption(params) {
    return request('/dictopt/update', {
        method: "post",
        data: params
    });
}

export async function deleteOption(data) {
    const { optionId = '' } = data;
    return request(`/dictopt/delete/${optionId}`);
}
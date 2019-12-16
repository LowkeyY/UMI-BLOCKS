/**
 * @author Lowkey
 * @date 2019/12/16 11:00:31
 * @Description:
 */
import { message } from 'antd';
import * as Service from './service';
import { queryList } from "./service";

const defaultPagination = {
    totalCount: 0,
    nowPage: 1,
    pageSize: 10
};
export default {
    namespace: 'BLOCK_NAME_CAMEL_CASE',
    state: {
        listData: [],
        optionData: {},
        pagination: defaultPagination
    },

    effects: {
        //字典管理
        * fetch({ payload }, { call, put }) {
            const { data, success, msg } = yield (call(Service.queryList, payload));
            if (success) {
                yield put({
                    type: 'save',
                    payload: {
                        listData: data.data,
                        pagination: {
                            totalCount: data.totalCount,
                            nowPage: data.nowPage,
                            pageSize: data.pageSize
                        }
                    }
                });
            } else {
                message.error(msg || '查询失败');
            }
        },
        * add({ payload }, { call, put }) {
            const { success, msg } = yield (call(Service.add, payload));
            if (success) {
                yield put({ type: 'fetch' });
                message.success(msg || '添加成功');
            } else {
                message.error(msg || '查询失败');
            }
        },
        * update({ payload, callback }, { call, put }) {
            const { success, msg } = yield call(Service.update, payload);
            if (success) {
                message.success('修改成功');
                if (callback) callback();
                yield put({ type: 'fetch' });
            } else {
                message.error(msg || '修改失败');
            }
        },
        * deleteDictionary({ payload }, { call, put }) {
            const { success, msg } = yield call(Service.deleteDictionary, payload);
            if (success) {
                message.success('删除成功');
                yield put({ type: 'fetch' });
            } else {
                message.error(msg || '删除失败');
            }
        },

        //字典选项
        * fetchOption({ payload }, { call, put, select }) {
            const { dictId } = payload;
            const { optionData } = yield select(_ => _.BLOCK_NAME_CAMEL_CASE);
            const { data, success, msg } = yield (call(Service.queryOptionList, payload));
            if (success) {
                yield put({
                    type: 'save',
                    payload: {
                        optionData: { ...optionData, [dictId]: data }
                    }
                });
            } else {
                message.error(msg || '查询失败');
            }
        },
        * addOption({ payload }, { call, put }) {
            const { dictionaryId = '' } = payload;
            const { success, msg } = yield (call(Service.addOption, payload));
            if (success) {
                yield put({ type: 'fetchOption', payload: { dictId: dictionaryId } });
                message.success(msg || '添加成功');
            } else {
                message.error(msg || '查询失败');
            }
        },
        * updateOption({ payload, callback }, { call, put }) {
            const { dictionaryId = '' } = payload;
            const { success, msg } = yield call(Service.updateOption, payload);
            if (success) {
                message.success('修改成功');
                if (callback) callback();
                yield put({ type: 'fetchOption', payload: { dictId: dictionaryId } });
            } else {
                message.error(msg || '修改失败');
            }
        },
        * deleteOption({ payload }, { call, put }) {
            const { dictionaryId = '', optionId } = payload;
            const { success, msg } = yield call(Service.deleteOption, { optionId });
            if (success) {
                message.success('删除成功');
                yield put({ type: 'fetchOption', payload: { dictId: dictionaryId } });
            } else {
                message.error(msg || '删除失败');
            }
        }
    },

    reducers: {
        save(state, { payload }) {
            return {
                ...state,
                ...payload
            };
        },
        addDictionary(state, { payload }) {
            const { listData } = state;
            if (typeof payload === 'object') listData.unshift(payload);
            return {
                ...state
            };
        },
        removeDictionary(state, { payload }) {
            const { listData } = state;
            const newData = listData.filter(item => item.key !== payload);
            return {
                ...state,
                listData: newData
            };
        },
        addDictionaryOption(state, { payload }) {
            const { optionData } = state;
            const { dictionaryId } = payload;
            if (typeof payload === 'object') optionData[dictionaryId].unshift(payload);
            return {
                ...state
            };
        },
        removeDictionaryOption(state, { payload }) {
            const { optionData } = state;
            const { dictionaryId,key } = payload;
            optionData[dictionaryId]=optionData[dictionaryId].filter(item => item.key !== key);
            return {
                ...state
            };
        },
        clear() {
            return {
                listData: [],
                optionData: {},
                pagination: defaultPagination
            };
        },
    }
};

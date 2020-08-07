/**
 * @author samy
 * @email samyzhg#qq.com
 * @create date 2020-08-06 21:00:56
 * @modify date 2020-08-06 21:00:56
 * @desc model 列表及树示范
 */
import { arrayToTree } from '@/bdpcloud/utils/utils';
import { handleResponse } from '@<%=proName%>/utils/utils';
import { getTree, getList } from '../services';

const defaultPagination = {
  current: 1,
  pageSize: 10,
  total: 0,
};

const defaultState = {
  treeData: [],
  listInfo: {
    list: [],
    pagination: defaultPagination,
  },
};

export default {
  namespace: '<%=moduleName%>',

  state: {
    ...defaultState,
  },

  effects: {
    *getList({ payload }, { call, put }) {
      const pageInfo = {
        pageIndex: payload.pageIndex || payload.current || defaultPagination.current,
        pageSize: payload.pageSize || defaultPagination.pageSize,
      };
      const res = yield call(getList, {
        ...payload,
        ...pageInfo,
      });
      const { isSuccess, data } = handleResponse(res);
      if (isSuccess) {
        const {
          apiList: list = [],
          pageInfo: { pageIndex, pageSize, total },
        } = data;
        const listTmp = list.map(item => {
          item.rowId = item.apiId;
          return item;
        });
        console.log('-----getList------listTmp---', JSON.stringify(listTmp));
        return yield put({
          type: 'save',
          payload: {
            listInfo: {
              list: listTmp,
              pagination: {
                current: pageIndex,
                pageSize,
                total,
              },
            },
          },
        });
      }
    },
    *getTree({ payload }, { call, put }) {
      const res = yield call(getTree, payload);
      const { isSuccess, data } = handleResponse(res);
      if (isSuccess && data) {
        const array = data.map(item => {
          return {
            ...item,
            title: item.catalogName,
            desc: item.comments, // 描述
            key: `${item.catalogId}`,
            value: item.catalogId,
            pId: item.parentId,
            isLeaf: item.parentId !== 0,
          };
        });
        const treeData = arrayToTree(array, 'catalogId', 'parentId');
        return yield put({
          type: 'save',
          payload: {
            treeData,
          },
        });
      }
    },
  },

  reducers: {
    clear(state) {
      return {
        ...state,
        ...defaultState,
      };
    },
    save(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
  },
};

/**
 * @author samy
 * @email samyzhg#qq.com
 * @create date 2020-07-17 10:04:49
 * @modify date 2020-07-17 10:04:49
 * @desc model示例
 */
import { <%=method%> } from "../services";
import { handleResponse } from '@<%=pro%>/utils/utils';

const defaultState = {
  treeData: [],
}

export default {
  namespace: "<%=name%>",

  state: {
    ...defaultState
  },

  effects: {
    *<%=method%>({ payload }, { call }) {
      const res = yield call(<%=method%>, payload);
      const { data, isSuccess } = handleResponse(res);
      return isSuccess ? data : '';
    },
  },

  reducers: {
    clearData() {
      return {
        ...defaultState
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

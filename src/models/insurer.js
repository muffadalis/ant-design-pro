import { queryInsurerList, saveInsurer } from '@/services/api';

export default {
  namespace: 'insurer',

  state: {
    insurers: [],
  },

  effects: {
    *fetch({ payload }, { call, put }) {
      const response = yield call(queryInsurerList, payload);
      const insurers = Array.isArray(response) ? response : [];

      yield put({
        type: 'queryList',
        payload: { insurers, showAll: payload.showAll },
      });
    },

    *reload(action, { put, select }) {
      const page = yield select(state => state.users.page);
      yield put({ type: 'fetch', payload: { page } });
    },

    *save({ payload }, { call, put }) {
      const response = yield call(saveInsurer, payload); // post

      yield put({
        type: 'fetch',
        payload: {
          isActive: true,
        },
      });
    },
  },

  reducers: {
    queryList(state, action) {
      return {
        ...state,
        insurers: action.payload.insurers,
        showAll: action.payload.showAll,
      };
    },
    appendList(state, action) {
      return {
        ...state,
        list: state.list.concat(action.payload),
      };
    },
  },
};

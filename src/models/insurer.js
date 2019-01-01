import { queryInsurerList, saveInsurer } from '@/services/api';

export default {
  namespace: 'insurer',

  state: {
    insurers: [],
  },

  effects: {
    *fetch({ payload }, { call, put }) {
      const response = yield call(queryInsurerList, payload);
      yield put({
        type: 'queryList',
        payload: Array.isArray(response) ? response : [],
      });
    },
    // *appendFetch({ payload }, { call, put }) {
    //   const response = yield call(queryInsurerList, payload);
    //   yield put({
    //     type: 'appendList',
    //     payload: Array.isArray(response) ? response : [],
    //   });
    // },

    *save({ payload }, { call, put }) {
      let callback;
      if (payload.id) {
        callback = saveInsurer;
      } else {
        callback = addFakeList;
      }
      const response = yield call(callback, payload); // post

      console.log('response', response)

      yield put({
        type: 'queryList',
        payload: response,
      });
    },
  },

  reducers: {
    queryList(state, action) {
      return {
        ...state,
        insurers: action.payload,
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

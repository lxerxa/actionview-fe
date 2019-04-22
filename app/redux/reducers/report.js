import * as t from '../constants/ActionTypes';
import _ from 'lodash';

const initialState = { 
  ecode: 0, 
  filters: {}, 
  loading: false, 
  saveLoading: false, 
  options: {}, 
  optionsLoading: false,
  worklog: [], 
  worklogLoading: false,
  worklogList: [], 
  worklogListLoading: false,
  worklogDetail: {},
  worklogDetailLoading: false,
  trend: [], 
  trendLoading: false };

export default function report(state = initialState, action) {
  switch (action.type) {
    case t.REPORT_LIST_GET:
      return { ...state, loading: true, data: {} };

    case t.REPORT_LIST_GET_SUCCESS:
      if (action.result.ecode === 0) {
        state.filters = action.result.data;
      }
      return { ...state, loading: false, ecode: action.result.ecode };

    case t.REPORT_LIST_GET_FAIL:
      return { ...state, loading: false, error: action.error };

    case t.REPORT_OPTIONS:
      return { ...state, optionsLoading: true };

    case t.REPORT_OPTIONS_SUCCESS:
      if (action.result.ecode === 0) {
        state.options = _.assign({}, state.options, action.result.data || {});
      }
      return { ...state, optionsLoading: false, ecode: action.result.ecode };

    case t.REPORT_OPTIONS_FAIL:
      return { ...state, optionsLoading: false, error: action.error };

    case t.REPORT_FILTER_RESET:
    case t.REPORT_FILTER_EDIT:
      return { ...state, saveLoading: true };

    case t.REPORT_FILTER_RESET_SUCCESS:
    case t.REPORT_FILTER_EDIT_SUCCESS:
      if (action.result.ecode === 0) {
        state.filters[action.mode] = action.result.data || [];
      }
      return { ...state, saveLoading: false, ecode: action.result.ecode };

    case t.REPORT_FILTER_RESET_FAIL:
    case t.REPORT_FILTER_EDIT_FAIL:
      return { ...state, saveLoading: false, error: action.error };

    case t.REPORT_FILTER_SAVE:
      return { ...state, saveLoading: true };

    case t.REPORT_FILTER_SAVE_SUCCESS:
      return { ...state, saveLoading: false, ecode: action.result.ecode };

    case t.REPORT_FILTER_SAVE_FAIL:
      return { ...state, saveLoading: false, error: action.error };

    case t.REPORT_WORKLOG_INDEX:
      return { ...state, worklogLoading: true, worklog: [], worklogList: [], worklogDetail: {} };

    case t.REPORT_WORKLOG_INDEX_SUCCESS:
      if (action.result.ecode === 0) {
        state.worklog = action.result.data;
      }
      return { ...state, worklogLoading: false, ecode: action.result.ecode };

    case t.REPORT_WORKLOG_INDEX_FAIL:
      return { ...state, worklogLoading: false, error: action.error };

    case t.REPORT_WORKLOG_LIST_GET:
      return { ...state, worklogListLoading: true, worklogList: [], worklogDetail: {} };

    case t.REPORT_WORKLOG_LIST_GET_SUCCESS:
      if (action.result.ecode === 0) {
        state.worklogList = action.result.data;
      }
      return { ...state, worklogListLoading: false, ecode: action.result.ecode };

    case t.REPORT_WORKLOG_LIST_GET_FAIL:
      return { ...state, worklogListLoading: false, error: action.error };

    case t.REPORT_WORKLOG_DETAIL_GET:
      return { ...state, worklogDetailLoading: true, worklogDetail: {} };

    case t.REPORT_WORKLOG_DETAIL_GET_SUCCESS:
      if (action.result.ecode === 0) {
        state.worklogDetail = action.result.data;
      }
      return { ...state, worklogDetailLoading: false, ecode: action.result.ecode };

    case t.REPORT_WORKLOG_DETAIL_GET_FAIL:
      return { ...state, worklogDetailLoading: false, error: action.error };

    case t.REPORT_TREND_INDEX:
      return { ...state, trendLoading: true, trend: [] };

    case t.REPORT_TREND_INDEX_SUCCESS:
      if (action.result.ecode === 0) {
        state.trend = action.result.data;
        state.options = _.assign({}, state.options, action.result.options);
      }
      return { ...state, trendLoading: false, ecode: action.result.ecode };

    case t.REPORT_TREND_INDEX_FAIL:
      return { ...state, trendLoading: false, error: action.error };

    default:
      return state;
  }
}

import { asyncFuncCreator } from '../utils';

export function index(key) {
  return asyncFuncCreator({
    constant: 'REPORT_LIST_GET',
    promise: (client) => client.request({ url: '/project/' + key + '/report/index' })
  });
}

export function resetFilter(key, mode) {
  return asyncFuncCreator({
    constant: 'REPORT_FILTER_RESET',
    mode: mode,
    promise: (client) => client.request({ url: '/project/' + key + '/report/' + mode  + '/filters/reset' })
  });
}

export function editFilter(key, mode, values) {
  return asyncFuncCreator({
    constant: 'REPORT_FILTER_EDIT',
    mode: mode,
    promise: (client) => client.request({ url: '/project/' + key + '/report/' + mode + '/filters', method: 'post', data: values })
  });
}

export function saveFilter(key, mode, values) {
  return asyncFuncCreator({
    constant: 'REPORT_FILTER_SAVE',
    mode: mode,
    promise: (client) => client.request({ url: '/project/' + key + '/report/' + mode + '/filter', method: 'post', data: values })
  });
}

export function worklog(key, qs) {
  return asyncFuncCreator({
    constant: 'REPORT_WORKLOG_INDEX',
    promise: (client) => client.request({ url: '/project/' + key + '/report/worklog' + (qs ? '?' + qs : '') })
  });
}

export function getWorklogList(key, qs) {
  return asyncFuncCreator({
    constant: 'REPORT_WORKLOG_LIST_GET',
    promise: (client) => client.request({ url: '/project/' + key + '/report/worklog/list' + (qs ? '?' + qs : '') })
  });
}

export function getWorklogDetail(key, issue_id, qs) {
  return asyncFuncCreator({
    constant: 'REPORT_WORKLOG_DETAIL_GET',
    promise: (client) => client.request({ url: '/project/' + key + '/report/worklog/issue/' + issue_id + (qs ? '?' + qs : '') })
  });
}

export function trend(key, qs) {
  return asyncFuncCreator({
    constant: 'REPORT_TREND_INDEX',
    promise: (client) => client.request({ url: '/project/' + key + '/report/trend' + (qs ? '?' + qs : '') })
  });
}

export function timetracks(key, qs) {
  return asyncFuncCreator({
    constant: 'REPORT_TIMETRACKS_INDEX',
    promise: (client) => client.request({ url: '/project/' + key + '/report/timetracks' + (qs ? '?' + qs : '') })
  });
}

export function getTimetrackDetail(key, issue_id) {
  return asyncFuncCreator({
    constant: 'REPORT_TIMETRACKS_DETAIL_GET',
    promise: (client) => client.request({ url: '/project/' + key + '/report/timetracks/issue/' + issue_id })
  });
}

export function regressions(key, qs) {
  return asyncFuncCreator({
    constant: 'REPORT_REGRESSIONS_INDEX',
    promise: (client) => client.request({ url: '/project/' + key + '/report/regressions' + (qs ? '?' + qs : '') })
  });
}

export function getOptions(key) {
  return asyncFuncCreator({
    constant: 'REPORT_OPTIONS',
    promise: (client) => client.request({ url: '/project/' + key + '/issue/options' })
  });
}

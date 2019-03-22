import { asyncFuncCreator } from '../utils';

export function index(key) {
  return asyncFuncCreator({
    constant: 'REPORT_LIST_GET',
    promise: (client) => client.request({ url: '/project/' + key + '/report/index' })
  });
}

export function saveFilter(key, values) {
  return asyncFuncCreator({
    constant: 'REPORT_FILTER_SAVE',
    promise: (client) => client.request({ url: '/project/' + key + '/report/filter', method: 'post', data: values })
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

export function getOptions(key) {
  return asyncFuncCreator({
    constant: 'REPORT_OPTIONS',
    promise: (client) => client.request({ url: '/project/' + key + '/issue/options' })
  });
}

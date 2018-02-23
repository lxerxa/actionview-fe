import { asyncFuncCreator } from '../utils';

export function index(key, qs) {
  return asyncFuncCreator({
    constant: 'ISSUE_INDEX',
    promise: (client) => client.request({ url: '/project/' + key + '/issue' + (qs ? '?' + qs : '') })
  });
}

export function create(key, values) {
  return asyncFuncCreator({
    constant: 'ISSUE_CREATE',
    promise: (client) => client.request({ url: '/project/' + key + '/issue', method: 'post', data: values })
  });
}

export function edit(key, id, values) {
  return asyncFuncCreator({
    constant: 'ISSUE_EDIT',
    promise: (client) => client.request({ url: '/project/' + key + '/issue/' + id, method: 'put', data: values })
  });
}

export function getOptions(key) {
  return asyncFuncCreator({
    constant: 'ISSUE_OPTIONS',
    promise: (client) => client.request({ url: '/project/' + key + '/issue/options' })
  });
}

export function addSearcher(key, values) {
  return asyncFuncCreator({
    constant: 'ISSUE_SEARCHER_ADD',
    promise: (client) => client.request({ url: '/project/' + key + '/issue/searcher', method: 'post', data: values })
  });
}

export function delSearcher(key, id) {
  return asyncFuncCreator({
    constant: 'ISSUE_SEARCHER_DELETE',
    promise: (client) => client.request({ url: '/project/' + key + '/issue/searcher/' + id, method: 'delete' })
  });
}

export function configSearcher(key, values) {
  return asyncFuncCreator({
    constant: 'ISSUE_SEARCHER_CONFIG',
    promise: (client) => client.request({ url: '/project/' + key + '/issue/searcher/batch', method: 'post', data: values })
  });
}

export function delFile(key, issue_id, field_key, file_id) {
  return asyncFuncCreator({
    constant: 'ISSUE_FILE_DELETE',
    id: file_id,
    field_key,
    promise: (client) => client.request({ url: '/project/' + key + '/file/' + file_id + '?issue_id=' + issue_id + '&field_key=' + field_key, method: 'delete' })
  });
}

export function show(key, id, floatStyle) {
  return asyncFuncCreator({
    constant: 'ISSUE_SHOW',
    id,
    floatStyle,
    promise: (client) => client.request({ url: '/project/' + key + '/issue/' + id })
  });
}

export function del(key, id) {
  return asyncFuncCreator({
    constant: 'ISSUE_DELETE',
    id,
    promise: (client) => client.request({ url: '/project/' + key + '/issue/' + id, method: 'delete' })
  });
}

export function addFile(field_key, file) {
  return { type: 'ISSUE_FILE_ADD', field_key, file };
}

export function setAssignee(key, id, values, modalFlag) {
  return asyncFuncCreator({
    constant: 'ISSUE_SET_ASSIGNEE',
    modalFlag: modalFlag && true,
    promise: (client) => client.request({ url: '/project/' + key + '/issue/' + id + '/assign', method: 'post', data: values })
  });
}

export function indexComments(key, id) {
  return asyncFuncCreator({
    constant: 'ISSUE_COMMENTS_INDEX',
    promise: (client) => client.request({ url: '/project/' + key + '/issue/' + id + '/comments' })
  });
}

export function addComments(key, id, values) {
  return asyncFuncCreator({
    constant: 'ISSUE_COMMENTS_ADD',
    promise: (client) => client.request({ url: '/project/' + key + '/issue/' + id + '/comments', method: 'post', data: values })
  });
}

export function editComments(key, id, comments_id, values) {
  return asyncFuncCreator({
    constant: 'ISSUE_COMMENTS_EDIT',
    promise: (client) => client.request({ url: '/project/' + key + '/issue/' + id + '/comments/' + comments_id, method: 'put', data: values })
  });
}

export function delComments(key, id, comments_id) {
  return asyncFuncCreator({
    constant: 'ISSUE_COMMENTS_DELETE',
    id: comments_id,
    promise: (client) => client.request({ url: '/project/' + key + '/issue/' + id + '/comments/' + comments_id, method: 'delete' })
  });
}

export function indexHistory(key, id) {
  return asyncFuncCreator({
    constant: 'ISSUE_HISTORY_INDEX',
    promise: (client) => client.request({ url: '/project/' + key + '/issue/' + id + '/history' })
  });
} 

export function indexWorklog(key, id) {
  return asyncFuncCreator({
    constant: 'ISSUE_WORKLOG_INDEX',
    promise: (client) => client.request({ url: '/project/' + key + '/issue/' + id + '/worklog' })
  });
}

export function addWorklog(key, id, values) {
  return asyncFuncCreator({
    constant: 'ISSUE_WORKLOG_ADD',
    promise: (client) => client.request({ url: '/project/' + key + '/issue/' + id + '/worklog', method: 'post', data: values })
  });
}

export function editWorklog(key, id, worklog_id, values) {
  return asyncFuncCreator({
    constant: 'ISSUE_WORKLOG_EDIT',
    promise: (client) => client.request({ url: '/project/' + key + '/issue/' + id + '/worklog/' + worklog_id, method: 'put', data: values })
  });
}

export function delWorklog(key, id, worklog_id) {
  return asyncFuncCreator({
    constant: 'ISSUE_WORKLOG_DELETE',
    id: worklog_id,
    promise: (client) => client.request({ url: '/project/' + key + '/issue/' + id + '/worklog/' + worklog_id, method: 'delete' })
  });
}

export function record() {
  return { type: 'ISSUE_RECORD' };
}

export function forward(offset) {
  return { type: 'ISSUE_FORWARD', offset };
}

export function cleanRecord() {
  return { type: 'ISSUE_CLEAN_RECORD' };
}

export function createLink(key, values) {
  return asyncFuncCreator({
    constant: 'ISSUE_LINK_CREATE',
    promise: (client) => client.request({ url: '/project/' + key + '/link', method: 'post', data: values })
  });
}

export function delLink(key, link_id) {
  return asyncFuncCreator({
    constant: 'ISSUE_LINK_DELETE',
    id: link_id,
    promise: (client) => client.request({ url: '/project/' + key + '/link/' + link_id, method: 'delete' })
  });
}

export function doAction(key, id, workflow_id, action_id, values) {
  return asyncFuncCreator({
    constant: 'ISSUE_WORKFLOW_ACTION',
    promise: (client) => client.request({ url: '/project/' + key + '/issue/' + id + '/workflow/' + workflow_id + '/action/' + action_id, method: 'post', data: values || {} })
  });
}

export function watch(key, id, flag) {
  return asyncFuncCreator({
    constant: 'ISSUE_WATCHING',
    promise: (client) => client.request({ url: '/project/' + key + '/issue/' + id + '/watching', method: 'post', data: { flag } })
  });
}

export function resetState(key, id) {
  return asyncFuncCreator({
    constant: 'ISSUE_STATE_RESET',
    promise: (client) => client.request({ url: '/project/' + key + '/issue/' + id + '/reset' })
  });
}

export function move(key, id, values) {
  return asyncFuncCreator({
    constant: 'ISSUE_MOVE',
    promise: (client) => client.request({ url: '/project/' + key + '/issue/' + id + '/move', method: 'post', data: values || {} })
  });
}

export function convert(key, id, values) {
  return asyncFuncCreator({
    constant: 'ISSUE_CONVERT',
    promise: (client) => client.request({ url: '/project/' + key + '/issue/' + id + '/convert', method: 'post', data: values || {} })
  });
}

export function copy(key, values) {
  return asyncFuncCreator({
    constant: 'ISSUE_COPY',
    promise: (client) => client.request({ url: '/project/' + key + '/issue/copy', method: 'post', data: values || {} })
  });
}

export function setRank(key, kid, values) {
  return asyncFuncCreator({
    constant: 'ISSUE_KANBAN_RANK_SET',
    promise: (client) => client.request({ url: '/project/' + key + '/kanban/' + kid  + '/rank', method: 'post', data: values || {} })
  });
}

export function release(key, values) {
  return asyncFuncCreator({
    constant: 'ISSUE_KANBAN_RELEASE',
    promise: (client) => client.request({ url: '/project/' + key + '/issue/release', method: 'post', data: values || {} })
  });
}

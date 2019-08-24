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

export function saveFilter(key, values) {
  return asyncFuncCreator({
    constant: 'ISSUE_FILTER_SAVE',
    promise: (client) => client.request({ url: '/project/' + key + '/issue/filter', method: 'post', data: values })
  });
}

export function resetFilters(key) {
  return asyncFuncCreator({
    constant: 'ISSUE_FILTERS_RESET',
    promise: (client) => client.request({ url: '/project/' + key + '/issue/filters/reset' })
  });
}

export function configFilters(key, values) {
  return asyncFuncCreator({
    constant: 'ISSUE_FILTERS_CONFIG',
    promise: (client) => client.request({ url: '/project/' + key + '/issue/filters', method: 'post', data: values })
  });
}

export function setColumns(key, values) {
  return asyncFuncCreator({
    constant: 'ISSUE_LIST_COLUMNS_SET',
    promise: (client) => client.request({ url: '/project/' + key + '/issue/columns', method: 'post', data: values })
  });
}

export function resetColumns(key, values) {
  return asyncFuncCreator({
    constant: 'ISSUE_LIST_COLUMNS_RESET',
    promise: (client) => client.request({ url: '/project/' + key + '/issue/columns/reset', method: 'post', data: values })
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

export function setLabels(key, id, values) {
  return asyncFuncCreator({
    constant: 'ISSUE_SET_LABELS',
    promise: (client) => client.request({ url: '/project/' + key + '/issue/' + id + '/labels', method: 'post', data: values })
  });
}

export function addLabels(values) {
  return { type: 'ISSUE_ADD_LABELS', newLabels: values || [] };
}

export function indexComments(key, id, sort) {
  return asyncFuncCreator({
    constant: 'ISSUE_COMMENTS_INDEX',
    promise: (client) => client.request({ url: '/project/' + key + '/issue/' + id + '/comments?sort=' + (sort || 'desc') })
  });
}

export function sortComments() {
  return { type: 'ISSUE_COMMENTS_SORT' };
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

export function indexHistory(key, id, sort) {
  return asyncFuncCreator({
    constant: 'ISSUE_HISTORY_INDEX',
    promise: (client) => client.request({ url: '/project/' + key + '/issue/' + id + '/history?sort=' + (sort || 'desc') })
  });
} 

export function sortHistory() {
  return { type: 'ISSUE_HISTORY_SORT' };
}

export function indexGitCommits(key, id, sort) {
  return asyncFuncCreator({
    constant: 'ISSUE_GITCOMMITS_INDEX',
    promise: (client) => client.request({ url: '/project/' + key + '/issue/' + id + '/gitcommits?sort=' + (sort || 'desc') })
  });
}

export function sortGitCommits() {
  return { type: 'ISSUE_GITCOMMITS_SORT' };
}

export function indexWorklog(key, id, sort) {
  return asyncFuncCreator({
    constant: 'ISSUE_WORKLOG_INDEX',
    promise: (client) => client.request({ url: '/project/' + key + '/issue/' + id + '/worklog?sort=' + (sort || 'asc') })
  });
}

export function sortWorklog() {
  return { type: 'ISSUE_WORKLOG_SORT' };
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

export function doAction(key, id, workflow_id, action_id, values, screen) {
  return asyncFuncCreator({
    constant: 'ISSUE_WORKFLOW_ACTION',
    screen: screen && true,
    promise: (client) => client.request({ url: '/project/' + key + '/issue/' + id + '/workflow/' + workflow_id + '/action/' + action_id, method: 'post', data: values || {} })
  });
}

export function watch(key, id, flag) {
  return asyncFuncCreator({
    constant: 'ISSUE_WATCHING',
    promise: (client) => client.request({ url: '/project/' + key + '/issue/' + id + '/watching', method: 'post', data: { flag } })
  });
}

export function resetState(key, id, values) {
  return asyncFuncCreator({
    constant: 'ISSUE_STATE_RESET',
    promise: (client) => client.request({ url: '/project/' + key + '/issue/' + id + '/reset', method: 'post', data: values })
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

export function removeFromSprint(issue) {
  return { type: 'ISSUE_SPRINT_REMOVE_ISSUE', issue };
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

export function imports(key, values) {
  return asyncFuncCreator({
    constant: 'ISSUE_IMPORTS',
    promise: (client) => client.request({ url: '/project/' + key + '/issue/imports', method: 'post', data: values || {} })
  });
}

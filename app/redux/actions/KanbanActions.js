import { asyncFuncCreator } from '../utils';

export function getOptions(key) {
  return asyncFuncCreator({
    constant: 'KANBAN_LIST_GET',
    promise: (client) => client.request({ url: '/project/' + key + '/kanban/list' })
  });
}

export function setAccess(key, id) {
  return asyncFuncCreator({
    constant: 'KANBAN_ACCESS_SET',
    promise: (client) => client.request({ url: '/project/' + key + '/kanban/access', method: 'post', data: { id } })
  });
}

export function getDraggableActions(key, id) {
  return asyncFuncCreator({
    constant: 'KANBAN_ISSUE_ACTIONS_GET',
    id,
    promise: (client) => client.request({ url: '/project/' + key + '/issue/' + id + '/wfactions' })
  });
}

export function cleanDraggableActions() {
  return { type: 'KANBAN_ISSUE_ACTIONS_CLEAN' };
}

export function setRank(key, kid, id, values) {
  return asyncFuncCreator({
    constant: 'KANBAN_ISSUE_RANK_SET',
    promise: (client) => client.request({ url: '/project/' + key + '/kanban/' + kid + '/issue/' + id + '/rank', method: 'post', data: values || {} })
  });
}

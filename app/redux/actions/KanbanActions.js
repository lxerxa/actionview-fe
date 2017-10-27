import { asyncFuncCreator } from '../utils';

export function create(key, values) {
  return asyncFuncCreator({
    constant: 'KANBAN_CREATE',
    promise: (client) => client.request({ url: '/project/' + key + '/kanban', method: 'post', data: values })
  });
}

export function update(key, values) {
  return asyncFuncCreator({
    constant: 'KANBAN_UPDATE',
    promise: (client) => client.request({ url: '/project/' + key + '/kanban/' + values.id, method: 'put', data: values })
  });
}

export function del(key, id) {
  return asyncFuncCreator({
    constant: 'KANBAN_DELETE',
    id,
    promise: (client) => client.request({ url: '/project/' + key + '/kanban/' + id, method: 'delete' })
  });
}

export function getOptions(key) {
  return asyncFuncCreator({
    constant: 'KANBAN_LIST_GET',
    promise: (client) => client.request({ url: '/project/' + key + '/kanban/list' })
  });
}

//export function setAccess(key, id) {
//  return asyncFuncCreator({
//    constant: 'KANBAN_ACCESS_SET',
//    promise: (client) => client.request({ url: '/project/' + key + '/kanban/access', method: 'post', data: { id } })
//  });
//}

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

export function switchRank(flag) {
  return { type: 'KANBAN_SWITCH_RANK', flag };
}

export function getRank(key, kid) {
  return asyncFuncCreator({
    constant: 'KANBAN_ISSUE_RANK_GET',
    kid,
    promise: (client) => client.request({ url: '/project/' + key + '/kanban/' + kid + '/rank' })
  });
}

export function setRank(key, kid, values) {
  return asyncFuncCreator({
    constant: 'KANBAN_ISSUE_RANK_SET',
    kid,
    promise: (client) => client.request({ url: '/project/' + key + '/kanban/' + kid + '/rank', method: 'post', data: values || {} })
  });
}

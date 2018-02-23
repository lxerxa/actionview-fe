import { asyncFuncCreator } from '../utils';

export function create(key, values) {
  return asyncFuncCreator({
    constant: 'KANBAN_CREATE',
    promise: (client) => client.request({ url: '/project/' + key + '/kanban', method: 'post', data: values })
  });
}

export function edit(key, id, values) {
  return asyncFuncCreator({
    constant: 'KANBAN_UPDATE',
    promise: (client) => client.request({ url: '/project/' + key + '/kanban/' + id, method: 'put', data: values })
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
    promise: (client) => client.request({ url: '/project/' + key + '/kanban' })
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

export function selectFilter(key) {
  return { type: 'KANBAN_SELECT_FILTER', key };
}

export function recordAccess(key, kid) {
  return asyncFuncCreator({
    constant: 'KANBAN_ACCESS_RECORD',
    promise: (client) => client.request({ url: '/project/' + key + '/kanban/' + kid + '/access' })
  });
}

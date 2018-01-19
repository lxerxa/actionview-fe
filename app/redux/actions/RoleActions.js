import { asyncFuncCreator } from '../utils';

export function index(key) {
  return asyncFuncCreator({
    constant: 'ROLE_INDEX',
    promise: (client) => client.request({ url: '/project/' + key + '/role' })
  });
}

export function teamIndex(key) {
  return asyncFuncCreator({
    constant: 'ROLE_TEAM_INDEX',
    promise: (client) => client.request({ url: '/project/' + key + '/team' })
  });
}

export function create(key, values) {
  return asyncFuncCreator({
    constant: 'ROLE_CREATE',
    promise: (client) => client.request({ url: '/project/' + key + '/role', method: 'post', data: values })
  });
}

export function update(key, values) {
  return asyncFuncCreator({
    constant: 'ROLE_UPDATE',
    promise: (client) => client.request({ url: '/project/' + key + '/role/' + values.id, method: 'put', data: values })
  });
}

export function setPermission(key, values) {
  return asyncFuncCreator({
    constant: 'ROLE_SET_PERMISSIONS',
    promise: (client) => client.request({ url: '/project/' + key + '/role/' + values.id + '/permissions', method: 'post', data: values })
  });
}

export function setActor(key, values) {
  return asyncFuncCreator({
    constant: 'ROLE_SET_ACTOR',
    promise: (client) => client.request({ url: '/project/' + key + '/role/' + values.id + '/actor', method: 'post', data: values })
  });
}

export function setGroupActor(key, values) {
  return asyncFuncCreator({
    constant: 'ROLE_SET_GROUP_ACTOR',
    promise: (client) => client.request({ url: '/project/' + key + '/role/' + values.id + '/groupactor', method: 'post', data: values })
  });
}

export function select(id) {
  return { type: 'ROLE_SELECT', id: id };
}

export function del(key, id) {
  return asyncFuncCreator({
    constant: 'ROLE_DELETE',
    id,
    promise: (client) => client.request({ url: '/project/' + key + '/role/' + id, method: 'delete' })
  });
}

export function reset(key, id) {
  return asyncFuncCreator({
    constant: 'ROLE_RESET',
    id,
    promise: (client) => client.request({ url: '/project/' + key + '/role/' + id + '/reset' })
  });
}

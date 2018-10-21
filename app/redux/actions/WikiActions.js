import { asyncFuncCreator } from '../utils';

export function index(key, directory, qs) {
  return asyncFuncCreator({
    constant: 'WIKI_INDEX',
    promise: (client) => client.request({ url: '/project/' + key + '/wiki' + '/' + directory + (qs ? '?' + qs : '') })
  });
}

export function show(key, fid, v) {
  return asyncFuncCreator({
    constant: 'WIKI_SHOW',
    fid,
    v,
    promise: (client) => client.request({ url: '/project/' + key + '/wiki' + '/file/' + fid + ( v ? ('?v=' + v) : '' ) })
  });
}

export function create(key, directory, values) {
  return asyncFuncCreator({
    constant: 'WIKI_CREATE',
    promise: (client) => client.request({ url: '/project/' + key + '/wiki' + '/' + directory, method: 'post', data: values })
  });
}

export function update(key, id, values) {
  return asyncFuncCreator({
    constant: 'WIKI_UPDATE',
    promise: (client) => client.request({ url: '/project/' + key + '/wiki' + '/' + id, method: 'put', data: values })
  });
}

export function del(key, id) {
  return asyncFuncCreator({
    constant: 'WIKI_DELETE',
    id,
    promise: (client) => client.request({ url: '/project/' + key + '/wiki/' + id, method: 'delete' })
  });
}

export function checkin(key, fid) {
  return asyncFuncCreator({
    constant: 'WIKI_CHECK_IN',
    promise: (client) => client.request({ url: '/project/' + key + '/wiki' + '/file/' + fid + '/checkin' })
  });
}

export function checkout(key, fid) {
  return asyncFuncCreator({
    constant: 'WIKI_CHECK_OUT',
    promise: (client) => client.request({ url: '/project/' + key + '/wiki' + '/file/' + fid + '/checkout' })
  });
}

export function select(id) {
  return { type: 'WIKI_SELECT', id: id };
}

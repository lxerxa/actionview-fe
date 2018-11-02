import { asyncFuncCreator } from '../utils';

export function index(key, directory, qs) {
  return asyncFuncCreator({
    constant: 'WIKI_INDEX',
    promise: (client) => client.request({ url: '/project/' + key + '/wiki/directory/' + directory + (qs ? '?' + qs : '') })
  });
}

export function show(key, wid, v) {
  return asyncFuncCreator({
    constant: 'WIKI_SHOW',
    wid,
    v,
    promise: (client) => client.request({ url: '/project/' + key + '/wiki/' + wid + ( v ? ('?v=' + v) : '' ) })
  });
}

export function create(key, values) {
  return asyncFuncCreator({
    constant: 'WIKI_CREATE',
    promise: (client) => client.request({ url: '/project/' + key + '/wiki', method: 'post', data: values })
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

export function checkin(key, wid) {
  return asyncFuncCreator({
    constant: 'WIKI_CHECK_IN',
    promise: (client) => client.request({ url: '/project/' + key + '/wiki/' + wid + '/checkin' })
  });
}

export function checkout(key, wid) {
  return asyncFuncCreator({
    constant: 'WIKI_CHECK_OUT',
    promise: (client) => client.request({ url: '/project/' + key + '/wiki/' + wid + '/checkout' })
  });
}

export function copy(key, values) {
  return asyncFuncCreator({
    constant: 'WIKI_COPY',
    isSamePath: values.src_path === values.dest_path,
    promise: (client) => client.request({ url: '/project/' + key + '/wiki/copy', method: 'post', data: values })
  });
}

export function move(key, values) {
  return asyncFuncCreator({
    constant: 'WIKI_MOVE',
    promise: (client) => client.request({ url: '/project/' + key + '/wiki/move', method: 'post', data: values })
  });
}

export function select(id) {
  return { type: 'WIKI_SELECT', id: id };
}

export function addAttachment(file) {
  return { type: 'WIKI_ATTACHMENT_ADD', file };
}

export function delFile(key, wid, fid) {
  return asyncFuncCreator({
    constant: 'WIKI_ATTACHMENT_DELETE',
    id: fid,
    promise: (client) => client.request({ url: '/project/' + key + '/wiki/' + wid + '/file/' + fid, method: 'delete' })
  });
}

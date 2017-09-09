import { asyncFuncCreator } from '../utils';

export function index(qs) {
  return asyncFuncCreator({
    constant: 'GROUP_INDEX',
    promise: (client) => client.request({ url: '/group' + (qs ? '?' + qs : '') })
  });
}

export function create(values) {
  return asyncFuncCreator({
    constant: 'GROUP_CREATE',
    promise: (client) => client.request({ url: '/group', method: 'post', data: values })
  });
}

export function update(id, values) {
  return asyncFuncCreator({
    constant: 'GROUP_UPDATE',
    promise: (client) => client.request({ url: '/group/' + id, method: 'put', data: values })
  });
}

export function del(id) {
  return asyncFuncCreator({
    constant: 'GROUP_DELETE',
    id,
    promise: (client) => client.request({ url: '/group/' + id, method: 'delete' })
  });
}

export function select(id) {
  return { type: 'GROUP_SELECT', id: id };
}

export function multiDel(ids) {
  return asyncFuncCreator({
    constant: 'GROUP_MULTI_DELETE',
    ids,
    promise: (client) => client.request({ url: '/group/batch/delete', method: 'post', data: { ids } })
  });
}

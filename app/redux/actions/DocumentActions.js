import { asyncFuncCreator } from '../utils';

export function getOptions(key) {
  return asyncFuncCreator({
    constant: 'DOCUMENT_OPTIONS',
    promise: (client) => client.request({ url: '/project/' + key + '/document/options' })
  });
}

export function index(key, directory, qs) {
  return asyncFuncCreator({
    constant: 'DOCUMENT_INDEX',
    promise: (client) => client.request({ url: '/project/' + key + '/document' + '/' + directory + (qs ? '?' + qs : '') })
  });
}

export function createFolder(key, directory, values) {
  return asyncFuncCreator({
    constant: 'DOCUMENT_CREATE_FOLDER',
    promise: (client) => client.request({ url: '/project/' + key + '/document' + '/' + directory + '/directory', method: 'post', data: values })
  });
}

export function update(key, id, values) {
  return asyncFuncCreator({
    constant: 'DOCUMENT_UPDATE',
    promise: (client) => client.request({ url: '/project/' + key + '/document' + '/' + id, method: 'put', data: values })
  });
}

export function del(key, id) {
  return asyncFuncCreator({
    constant: 'DOCUMENT_DELETE',
    id,
    promise: (client) => client.request({ url: '/project/' + key + '/document/' + id, method: 'delete' })
  });
}

export function select(id) {
  return { type: 'DOCUMENT_SELECT', id: id };
}

export function addFile(file) {
  return { type: 'DOCUMENT_ADD', file };
}

import { push } from 'react-router-redux';
import { asyncFuncCreator } from '../utils';
import { SESSION_DESTROY } from '../constants/ActionTypes';

export function create(values) {
  return asyncFuncCreator({
    constant: 'SESSION_CREATE',
    promise: (client) => client.request({ url: '/session', method: 'post' }, values)
  });
}

export function destroy() {
  return (dispatch) => {
    dispatch({ type: SESSION_DESTROY });
    dispatch(push('/login'));
  };
}

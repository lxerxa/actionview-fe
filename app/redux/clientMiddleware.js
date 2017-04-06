
import { SESSION_INVALIDATE } from './constants/ActionTypes';

export default function clientMiddleware(client) {
  return () => {
    return (next) => (action) => {
      const { promise, types, ... rest } = action;
      if (!promise) return next(action);

      const [ REQUEST, SUCCESS, FAILURE ] = types;
      next({ ...rest, type: REQUEST });
      return promise(client).then(
        (result) => { if (result.ecode === -10001) { next({ type: SESSION_INVALIDATE }); } else { return next({ ...rest, result, type: SUCCESS }); } },
        (error) => next({ ...rest, error, type: FAILURE })
      );
    };
  };
}

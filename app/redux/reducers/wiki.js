import * as t from '../constants/ActionTypes';
import _ from 'lodash';

const initialState = { 
  ecode: 0, 
  childrenLoading: false,
  treeLoading: false,
  tree: {},
  collection: [], 
  indexLoading: false, 
  itemDetailLoading: false, 
  itemLoading: false, 
  item: {}, 
  loading: false, 
  options: {}, 
  selectedItem: {} 
};

function sort(collection, sortkey='') {
  if (!sortkey) {
    sortkey = window.localStorage && window.localStorage.getItem('wiki-sortkey') || 'create_time_desc';
  }

  collection.sort(function(a, b) {
    if (a.d == b.d || (!a.d && !b.d)) {
      if (sortkey == 'create_time_desc') {
        return b.created_at - a.created_at;
      } else if (sortkey == 'create_time_asc') {
        return a.created_at - b.created_at;
      } else if (sortkey == 'update_time_desc') {
        return (b.updated_at || b.created_at) - (a.updated_at || a.created_at);
      } else if (sortkey == 'update_time_asc') {
        return (a.updated_at || a.created_at) - (b.updated_at || b.created_at);
      } else if (sortkey == 'name_asc') {
        return a.name.localeCompare(b.name);
      } else if (sortkey == 'name_desc') {
        return -a.name.localeCompare(b.name);
      }
    } else {
      return (b.d || 0) - (a.d || 0);
    }
  });
}

function arrangeTree(data) {
  if (data.children && data.children.length > 0) {
    data.toggled = true;
    _.forEach(data.children, (v) => {
      arrangeTree(v);
    });
    data.children.sort((a, b) => { if (a.d == b.d || (!a.d && !b.d)) { return a.name.localeCompare(b.name); } else { return (b.d || 0) - (a.d || 0); } });
  } else if (data.d == 1) {
    data.children = [];
  }
}

function findNode(tree, id) {
  if (tree.id == id) {
    return tree;
  }

  const childNum = tree.children ? tree.children.length : 0;
  for (let i = 0; i < childNum; i++) {
    const node = findNode(tree.children[i], id);
    if (node !== false) {
      return node;
    }
  }
  return false;
}

function addChildren(tree, parentid, children) {
  const parentNode = findNode(tree, parentid);
  if (parentNode === false) {
    return;
  }

  if (!children || children.length === 0) {
    parentNode.children = undefined;
  } else {
    parentNode.children = _.map(children, (v) => { return { ...v, children: v.d == 1 ? [] : undefined } });
    parentNode.children.sort((a, b) => { if (a.d == b.d || (!a.d && !b.d)) { return a.name.localeCompare(b.name); } else { return (b.d || 0) - (a.d || 0); } });
  }
}

function addNode(tree, parentId, node) {
  const parentNode = findNode(tree, parentId);
  // 目录树还没展开改节点
  if (parentNode === false || (parentNode.childern && parentNode.childern.length === 0)) {
    return;
  }

  if (parentNode.children && parentNode.children.length == 0) {
    return;
  }

  if (!parentNode.children) {
    parentNode.children = [];
  }
  parentNode.children.push({ ...node, children: node.d == 1 ? [] : undefined });
  parentNode.children.sort((a, b) => { if (a.d == b.d || (!a.d && !b.d)) { return a.name.localeCompare(b.name); } else { return (b.d || 0) - (a.d || 0); } });
}

function updNode(tree, parentId, node) {
  const parentNode = findNode(tree, parentId);
  if (parentNode === false || !parentNode.children || parentNode.children.length <= 0) {
    return;
  }

  const ind = _.findIndex(parentNode.children, { id: node.id });
  if (ind !== -1) {
    parentNode.children[ind].name = node.name;
    parentNode.children.sort((a, b) => { if (a.d == b.d || (!a.d && !b.d)) { return a.name.localeCompare(b.name); } else { return (b.d || 0) - (a.d || 0); } });
  }
}

function delNode(tree, parentId, nodeId) {
  const parentNode = findNode(tree, parentId);
  if (parentNode === false || !parentNode.children || parentNode.children.length <= 0) {
    return;
  }

  const ind = _.findIndex(parentNode.children, { id: nodeId });
  if (ind !== -1) {
    parentNode.children.splice(ind, 1);
    if (parentNode.children.length === 0) {
      if (parentNode.toggled) {
        parentNode.children = undefined;
      } else {
        parentNode.children = [];
      }
    }
  }
}

function moveNode(tree, node, srcId, destId) {
  const node2 = findNode(tree, node.id);
  if (node2 !== false) {
    delNode(tree, srcId, node.id);
    addNode(tree, destId, node);
  } else {
    addNode(tree, destId, node);
  }
}

export default function wiki(state = initialState, action) {
  switch (action.type) {
    case t.WIKI_INDEX:
      return { ...state, indexLoading: true, collection: [], item: {} };

    case t.WIKI_INDEX_SUCCESS:
      if (action.result.ecode === 0) {
        state.collection = action.result.data;
        sort(state.collection);
        _.extend(state.options, action.result.options);
      }
      return { ...state, indexLoading: false, ecode: action.result.ecode };

    case t.WIKI_INDEX_FAIL:
      return { ...state, indexLoading: false, error: action.error };

    case t.WIKI_SHOW:
      return { ...state, itemDetailLoading: true, item: {} };

    case t.WIKI_SHOW_SUCCESS:
      if (action.result.ecode === 0) {
        state.item = action.result.data;
        _.extend(state.options, action.result.options);
      }
      return { ...state, itemDetailLoading: false, ecode: action.result.ecode };

    case t.WIKI_SHOW_FAIL:
      return { ...state, itemDetailLoading: false, error: action.error };

    case t.WIKI_CREATE:
      return { ...state, loading: true };

    case t.WIKI_CREATE_SUCCESS:
      if ( action.result.ecode === 0 ) { 
        state.collection.unshift(action.result.data);
        if (action.result.data.d !== 1 && action.result.data.name.toLowerCase() === 'home' && (!state.options.home || !state.options.home.id)) {
          state.options.home = action.result.data;
        }
        addNode(state.tree, action.result.data.parent, _.pick(action.result.data, [ 'id', 'name', 'd', 'parent' ]));
      }
      return { ...state, loading: false, ecode: action.result.ecode };

    case t.WIKI_CREATE_FAIL:
      return { ...state, loading: false, error: action.error };

    case t.WIKI_UPDATE:
      return { ...state, loading: true };

    case t.WIKI_UPDATE_SUCCESS:
      if ( action.result.ecode === 0 ) {
        const ind = _.findIndex(state.collection, { id: action.result.data.id });
        if (ind !== -1) {
          state.collection[ind] = action.result.data;
        }
        updNode(state.tree, action.result.data.parent, _.pick(action.result.data, [ 'id', 'name', 'd', 'parent' ]));

        state.item = action.result.data;

        if (action.result.data.d === 1) {
          return { ...state, loading: false, ecode: action.result.ecode };
        }

        if (state.options.home && state.options.home.id) {
          if (state.options.home.id === action.result.data.id) {
            if (action.result.data.name.toLowerCase() === 'home') {
              state.options.home = action.result.data;
            } else {
              state.options.home = {};
            }
          }
        } else if (action.result.data.name.toLowerCase() === 'home') {
          state.options.home = action.result.data;
        }
      }
      return { ...state, loading: false, ecode: action.result.ecode };

    case t.WIKI_UPDATE_FAIL:
      return { ...state, loading: false, error: action.error };

    case t.WIKI_DELETE:
      return { ...state, itemLoading: true };

    case t.WIKI_DELETE_SUCCESS:
      if (action.result.ecode === 0) {

        const delObj = _.find(state.collection, { id: action.id });
        if (delObj) {
          delNode(state.tree, delObj.parent, action.id);
        } else if (state.item.id == action.id) {
          delNode(state.tree, state.item.parent , action.id);
        }

        state.collection = _.reject(state.collection, { id: action.id });
        if (state.options.home && state.options.home.id === action.id) {
          state.options.home = {};
        }
      }
      return { ...state, itemLoading: false, ecode: action.result.ecode };

    case t.WIKI_DELETE_FAIL:
      return { ...state, itemLoading: false, error: action.error };

    case t.WIKI_CHECK_IN:
    case t.WIKI_CHECK_OUT:
      return { ...state, itemLoading: true };

    case t.WIKI_CHECK_IN_SUCCESS:
    case t.WIKI_CHECK_OUT_SUCCESS:
      if ( action.result.ecode === 0 ) {
        const ind = _.findIndex(state.collection, { id: action.result.data.id });
        if (ind !== -1) {
          state.collection[ind] = action.result.data;
        }
        state.item = action.result.data;
        if (state.options.home && state.options.home.id === action.result.data.id) {
          state.options.home = action.result.data;
        }
      }
      return { ...state, itemLoading: false, ecode: action.result.ecode };

    case t.WIKI_CHECK_IN_FAIL:
    case t.WIKI_CHECK_OUT_FAIL:
      return { ...state, itemLoading: false, error: action.error };

    case t.WIKI_COPY:
    case t.WIKI_MOVE:
      return { ...state, loading: true };

    case t.WIKI_COPY_SUCCESS:
      if (action.result.ecode === 0) {
        if (action.toCurPath) {
          state.collection.push(action.result.data);
        }
        addNode(state.tree, action.result.data.parent, _.pick(action.result.data, [ 'id', 'name', 'd', 'parent' ]));
        if (action.result.data.name.toLowerCase() === 'home' && (!state.options.home || !state.options.home.id)) {
          state.options.home = action.result.data;
        }
      }
      return { ...state, loading: false, ecode: action.result.ecode };

    case t.WIKI_MOVE_SUCCESS:
      if (action.result.ecode === 0) {
        const moveObj = _.find(state.collection, { id: action.result.data.id });
        if (moveObj) {
          moveNode(state.tree, _.pick(moveObj, [ 'id', 'name', 'd', 'parent' ]), moveObj.parent, action.result.data.parent);
        }
        state.collection = _.reject(state.collection, { id: action.result.data.id });
      }
      return { ...state, loading: false, ecode: action.result.ecode };

    case t.WIKI_COPY_FAIL:
    case t.WIKI_MOVE_FAIL:
      return { ...state, loading: false, error: action.error };

    case t.WIKI_DIRTREE_GET:
      return { ...state, treeLoading: true };

    case t.WIKI_DIRTREE_GET_SUCCESS:
      if (action.result.ecode === 0) {
        state.tree = action.result.data;
        arrangeTree(state.tree)
      }
      return { ...state, treeLoading: false, ecode: action.result.ecode };

    case t.WIKI_DIRTREE_GET_FAIL:
      return { ...state, treeLoading: false, error: action.error };

    case t.WIKI_DIRCHILDREN_GET:
      return { ...state, childrenLoading: true };

    case t.WIKI_DIRCHILDREN_GET_SUCCESS:
      if (action.result.ecode === 0) {
        addChildren(state.tree, action.parentid, action.result.data);
      }
      return { ...state, childrenLoading: false, ecode: action.result.ecode };

    case t.WIKI_DIRCHILDREN_GET_FAIL:
      return { ...state, childrenLoading: false, error: action.error };

    case t.WIKI_SELECT:
      const el = _.find(state.collection, { id: action.id });
      return { ...state, selectedItem: el };

    case t.WIKI_ATTACHMENT_ADD:
      if (!state.item.attachments) {
        state.item.attachments = [];
      }
      state.item.attachments.push(action.file);
      return { ...state, item: state.item };

    case t.WIKI_ATTACHMENT_DELETE:
      return { ...state, loading: true };

    case t.WIKI_ATTACHMENT_DELETE_SUCCESS:
      if ( action.result.ecode === 0 ) {
        state.item.attachments = _.reject(state.item.attachments || [], { id: action.id });
      }
      return { ...state, loading: false, ecode: action.result.ecode };

    case t.WIKI_ATTACHMENT_DELETE_FAIL:
      return { ...state, loading: false, error: action.error };

    case t.WIKI_SORT:
      sort(state.collection, action.key);
      return { ...state };

    case t.WIKI_FAVORITE_SUCCESS:
      const ind = _.findIndex(state.collection, { id: action.result.data.id });
      if (ind !== -1) {
        state.collection[ind].favorited = action.result.data.favorited;
      }
      if (state.item.id == action.result.data.id) {
        state.item.favorited = action.result.data.favorited;
      }
      return { ...state, ecode: action.result.ecode };

    default:
      return state;
  }
}

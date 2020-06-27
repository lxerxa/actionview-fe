import * as t from '../constants/ActionTypes';
import _ from 'lodash';

const initialState = { 
  ecode: 0, 
  childrenLoading: false,
  treeLoading: false,
  tree: {},
  collection: [], 
  optionsLoading: false, 
  indexLoading: false, 
  itemLoading: false, 
  item: {}, 
  loading: false, 
  options: {}, 
  selectedItem: {} 
};

function sort(collection, sortkey='') {
  if (!sortkey) {
    sortkey = window.localStorage && window.localStorage.getItem('document-sortkey') || 'create_time_desc';
  }

  collection.sort(function(a, b) { 
    if (a.d == b.d || (!a.d && !b.d)) {
      if (sortkey == 'create_time_desc') {
        return (b.created_at || b.uploaded_at) - (a.created_at || a.uploaded_at);
      } else if (sortkey == 'create_time_asc') {
        return (a.created_at || a.uploaded_at) - (b.created_at || b.uploaded_at);
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
    data.children.sort((a, b) => a.name.localeCompare(b.name));
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
    parentNode.children = _.map(children, (v) => { return { ...v, children: [] } });
    parentNode.children.sort((a, b) => a.name.localeCompare(b.name));
  }
}

function addNode(tree, parentId, node) {
  const parentNode = findNode(tree, parentId);
  // 目录树还没展开改节点
  if (parentNode === false || (parentNode.childern && parentNode.childern.length === 0)) {
    return;
  }

  if (!parentNode.children) {
    parentNode.children = [];
  }
  parentNode.children.push({ ...node, children: [] });
  parentNode.children.sort((a, b) => a.name.localeCompare(b.name));
}

function updNode(tree, parentId, node) {
  const parentNode = findNode(tree, parentId);
  if (parentNode === false || !parentNode.children || parentNode.children.length <= 0) {
    return;
  }

  const ind = _.findIndex(parentNode.children, { id: node.id });
  if (ind !== -1) {
    parentNode.children[ind].name = node.name;
    parentNode.children.sort((a, b) => a.name.localeCompare(b.name));
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

function copyNode() {
}

function moveNode(tree, nodeId, srcId, destId) {
  const node = findNode(tree, nodeId);
  if (node !== false) {
    delNode(tree, srcId, nodeId);
    addNode(tree, destId, node)
  }
}

export default function document(state = initialState, action) {
  switch (action.type) {
    case t.DOCUMENT_INDEX:
      return { ...state, indexLoading: true, collection: [], increaseCollection: [] };

    case t.DOCUMENT_INDEX_SUCCESS:
      if (action.result.ecode === 0) {
        state.collection = action.result.data;
        sort(state.collection);
        _.extend(state.options, action.result.options);
      }
      return { ...state, indexLoading: false, ecode: action.result.ecode };

    case t.DOCUMENT_INDEX_FAIL:
      return { ...state, indexLoading: false, error: action.error };

    case t.DOCUMENT_OPTIONS:
      return { ...state, optionsLoading: true, options: {} };

    case t.DOCUMENT_OPTIONS_SUCCESS:
      if (action.result.ecode === 0) {
        _.extend(state.options, action.result.data);
      }
      return { ...state, optionsLoading: false, ecode: action.result.ecode };

    case t.DOCUMENT_OPTIONS_FAIL:
      return { ...state, optionsLoading: false, error: action.error };

    case t.DOCUMENT_CREATE_FOLDER:
      return { ...state, itemLoading: true };

    case t.DOCUMENT_CREATE_FOLDER_SUCCESS:
      if ( action.result.ecode === 0 ) { 
        state.collection.unshift(action.result.data);
        addNode(state.tree, action.result.data.parent, _.pick(action.result.data, [ 'id', 'name' ]));
      }
      return { ...state, itemLoading: false, ecode: action.result.ecode };

    case t.DOCUMENT_CREATE_FOLDER_FAIL:
      return { ...state, itemLoading: false, error: action.error };

    case t.DOCUMENT_UPDATE:
    case t.DOCUMENT_DELETE:
      return { ...state, itemLoading: true };

    case t.DOCUMENT_UPDATE_SUCCESS:
      if ( action.result.ecode === 0 ) {
        const ind = _.findIndex(state.collection, { id: action.result.data.id });
        state.collection[ind] = action.result.data;
        if (action.result.data.d === 1) {
          updNode(state.tree, action.result.data.parent, _.pick(action.result.data, [ 'id', 'name' ]));
        }
      }
      return { ...state, itemLoading: false, ecode: action.result.ecode };

    case t.DOCUMENT_DELETE_SUCCESS:
      if (action.result.ecode === 0) {
        const delObj = _.find(state.collection, { id: action.id });
        if (delObj && delObj.d === 1) {
          delNode(state.tree, delObj.parent, delObj.id);
        }
        state.collection = _.reject(state.collection, { id: action.id });
      }
      return { ...state, itemLoading: false, ecode: action.result.ecode };

    case t.DOCUMENT_DELETE_FAIL:
    case t.DOCUMENT_UPDATE_FAIL:
      return { ...state, itemLoading: false, error: action.error };

    case t.DOCUMENT_COPY:
    case t.DOCUMENT_MOVE:
      return { ...state, loading: true };

    case t.DOCUMENT_COPY_SUCCESS:
      if ( action.result.ecode === 0 && action.isSamePath ) {
        state.collection.push(action.result.data);
        const copyObj = _.find(state.collection, { id: action.result.data.id });
        if (copyObj && copyObj.d === 1) {
          copyNode(state.tree, copyObj.id, action.result.data.parent);
        }
      }
      return { ...state, loading: false, ecode: action.result.ecode };

    case t.DOCUMENT_MOVE_SUCCESS:
      if (action.result.ecode === 0) {
        const moveObj = _.find(state.collection, { id: action.result.data.id });
        if (moveObj && moveObj.d === 1) {
          moveNode(state.tree, moveObj.id, moveObj.parent, action.result.data.parent);
        }
        state.collection = _.reject(state.collection, { id: action.result.data.id });
      }
      return { ...state, loading: false, ecode: action.result.ecode };

    case t.DOCUMENT_COPY_FAIL:
    case t.DOCUMENT_MOVE_FAIL:
      return { ...state, loading: false, error: action.error };

    case t.DOCUMENT_DIRTREE_GET:
      return { ...state, treeLoading: true };

    case t.DOCUMENT_DIRTREE_GET_SUCCESS:
      if (action.result.ecode === 0) {
        state.tree = action.result.data;
        arrangeTree(state.tree)
      }
      return { ...state, treeLoading: false, ecode: action.result.ecode };

    case t.DOCUMENT_DIRTREE_GET_FAIL:
      return { ...state, treeLoading: false, error: action.error };

    case t.DOCUMENT_DIRCHILDREN_GET:
      return { ...state, childrenLoading: true };

    case t.DOCUMENT_DIRCHILDREN_GET_SUCCESS:
      if (action.result.ecode === 0) {
        addChildren(state.tree, action.parentid, action.result.data);
      }
      return { ...state, childrenLoading: false, ecode: action.result.ecode };

    case t.DOCUMENT_DIRCHILDREN_GET_FAIL:
      return { ...state, childrenLoading: false, error: action.error };

    case t.DOCUMENT_SELECT:
      const el = _.find(state.collection, { id: action.id });
      return { ...state, selectedItem: el };

    case t.DOCUMENT_ADD:
      state.collection.push(action.file);
      return { ...state };

    case t.DOCUMENT_SORT:
      sort(state.collection, action.key);
      return { ...state };

    default:
      return state;
  }

}

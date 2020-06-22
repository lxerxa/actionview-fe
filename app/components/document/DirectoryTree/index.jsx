import React, { PropTypes, Component } from 'react';
import { Treebeard, decorators } from 'react-treebeard';
import _ from 'lodash';

const img = require('../../../assets/images/loading.gif');

const theme = require('./Style'); 

const Toggle = (props) => {
  const { style, node } = props;
  const { height, width } = style;

  return (
    <span style={ style.base }>
      { node.toggled ?
      <i className='fa fa-caret-down'></i>
      :
      <i className='fa fa-caret-right'></i> }
    </span>
  );
};

Toggle.propTypes = {
  node: PropTypes.object,
  style: PropTypes.object
};

export default class Tree extends Component {
  constructor(props) {
    super(props);
    this.state = { ecode: 0 };
  }

  static propTypes = {
    directory: PropTypes.string.isRequired,
    data: PropTypes.object.isRequired,
    goto: PropTypes.func.isRequired,
    childrenLoading: PropTypes.bool.isRequired,
    getDirChildren: PropTypes.func.isRequired,
    treeLoading: PropTypes.bool.isRequired,
    getDirTree: PropTypes.func.isRequired
  }

  async componentWillMount() {
    const { directory, getDirTree } = this.props;
    await getDirTree();

    const { data } = this.props;
    const node = this.findNode(data, directory);
    node.active = true;
    this.setState({ cursor: node });
  }

  findNode(data, nodeId) {
    if (data.id === nodeId) {
      return data;
    }

    if (data.children && data.children.length > 0) {
      const childNum = data.children.length;
      for (let i = 0; i< childNum; i++) {
        const node = this.findNode(data.children[i], nodeId);
        if (node !== false) {
          return node;
        }
      }
    }
    return false;
  }

  onToggle(node, toggled, e){
    const { cursor } = this.state;
    const { goto, getDirChildren } = this.props;

    if (e.target.nodeName == 'DIV') {
      if(cursor) {
        cursor.active = false;
      }
      node.active = true;
      goto(node.id);
      this.setState({ cursor: node });
    } else {
      if(node.children && node.children.length > 0) { 
        node.toggled = toggled; 
      } else {
        getDirChildren(node.id);
        node.toggled = toggled; 
      }

      this.setState({ cursor });
    }
  }

  componentWillReceiveProps(nextProps) {
    const { data } = this.props;

    if (nextProps.directory != this.props.directory) {
      const node = this.findNode(data, nextProps.directory);
      node.active = true;
    }
  }

  render() {
    const { data, treeLoading } = this.props;

    if (treeLoading) {
      return (
        <div style={ { marginTop: '20px', textAlign: 'center' } }>
          <img src={ img } className='loading'/>
        </div>
      );
    }

    return (
      <Treebeard 
        data={ data } 
        decorators={ { ...decorators, Toggle } } 
        animations={ false }
        onToggle={ this.onToggle.bind(this) }
        style={ theme.default }/>
    );
  }
}

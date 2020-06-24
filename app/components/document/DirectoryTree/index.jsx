import React, { PropTypes, Component } from 'react';
import { Treebeard, decorators } from 'react-treebeard';
import _ from 'lodash';

const img = require('../../../assets/images/loading.gif');

const theme = require('./Style');

//const Toggle = (props) => {
//  const { style, node } = props;
//  const { height, width } = style;

//  return (
//    <span style={ style.base }>
//      { node.toggled ?
//      <i className='fa fa-caret-down'></i>
//      :
//      <i className='fa fa-caret-right'></i> }
//    </span>
//  );
//};

//Toggle.propTypes = {
//  node: PropTypes.object,
//  style: PropTypes.object
//};


//const Header = ({ style, node }) => {
//  return (
//    <div style={ style.base }>
//      <div style={ style.title }>
//        <div style={ style.folder }><i className={ node.toggled ? 'fa fa-folder-open' : 'fa fa-folder' }></i></div>
//        { node.name }
//      </div>
//    </div>
//  );
//}

//Header.propTypes = {
//  node: PropTypes.object,
//  style: PropTypes.object
//};

export default class Tree extends Component {
  constructor(props) {
    super(props);
    this.state = { ecode: 0 };
    this.headerClick = this.headerClick.bind(this);
    this.toggleClick = this.toggleClick.bind(this);
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

  headerClick(props) {
    const { cursor } = this.state;
    const { data, goto } = this.props;

    if (cursor) {
      cursor.active = false;
    }

    const node = this.findNode(data, props.node.id);
    if (node) {
      node.active = true;
      this.setState({ cursor: node });
    }

    goto(node.id);
  }

  async toggleClick(props) {
    const { cursor } = this.state;
    const { data, getDirChildren } = this.props;

    const node = this.findNode(data, props.node.id);
    node.toggled = !node.toggled;

    if (!node.children || node.children.length == 0) {
      node.loading = true;
      this.setState({ cursor });

      await getDirChildren(node.id);

      node.loading = false;
      this.setState({ cursor });
    } else {
      this.setState({ cursor });
    }
  }

  async componentWillMount() {
    const { directory, getDirTree } = this.props;
    await getDirTree();

    const { data } = this.props;
    const node = this.findNode(data, directory);
    if (node) {
      node.active = true;
      this.setState({ cursor: node });
    }
  }

  findNode(data, nodeId) {
    if (data.id === nodeId) {
      return data;
    }

    if (data.children && data.children.length > 0) {
      const childNum = data.children.length;
      for (let i = 0; i < childNum; i++) {
        const node = this.findNode(data.children[i], nodeId);
        if (node !== false) {
          return node;
        }
      }
    }
    return false;
  }

  componentWillReceiveProps(nextProps) {
    const { data } = this.props;
    const { cursor } = this.state;

    if (nextProps.directory != this.props.directory) {
      if (cursor) {
        cursor.active = false;
      }
      const node = this.findNode(data, nextProps.directory);
      if (node) {
        node.active = true;
      }
      this.setState({ cursor: node });
    }
  }

  render() {
    const { data, treeLoading } = this.props;

    const d = {
      Toggle: (props) => {
        return (
          <span style={ props.style.base } onClick={ () => { this.toggleClick(props) } }>
            { props.node.toggled ?
            <i className='fa fa-caret-down'></i>
            :
            <i className='fa fa-caret-right'></i> }
          </span>
        );
      },
      Header: (props) => {
        const ml = { marginLeft: props.node.children ? '0px' : '19px' };
        return (
          <div style={ { ...props.style.base, ...ml } } onClick={ () => { this.headerClick(props) } }>
            <div style={ props.style.title }>
              <div style={ props.style.folder }><i className={ props.node.toggled ? 'fa fa-folder-open' : 'fa fa-folder' }></i></div>
              { props.node.name }
            </div>
          </div>
        );
      }
    };

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
        decorators={ { ...decorators, ...d } }
        animations={ false }
        style={ theme.default }/>
    );
  }
}

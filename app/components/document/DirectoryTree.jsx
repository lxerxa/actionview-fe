import React, { PropTypes, Component } from 'react';
import { Treebeard, decorators } from 'react-treebeard';
import _ from 'lodash';

const img = require('../../assets/images/loading.gif');

const theme = require('./directory.style'); 

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
    this.state = { ecode: 0, initilizedFlag: false };
  }

  static propTypes = {
    data: PropTypes.object.isRequired
  }

  componentDidMount() {
    const { data={} } = this.props;
    this.state.cursor = _.find(data.children, { active: true });
    console.log(this.state.cursor);
  }

  onToggle(node, toggled, e){
    const { cursor } = this.state;

    if (e.target.nodeName == 'DIV') {
      if(cursor) {
        cursor.active = false;
      }
      node.active = true;
      this.setState({ cursor: node });
    } else {
      if(node.children) { 
        node.toggled = toggled; 
      }
      this.setState({ cursor });
    }
  }

  render() {

    const { data } = this.props;

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

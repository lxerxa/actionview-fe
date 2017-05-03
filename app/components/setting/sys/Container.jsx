import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as SyssettingActions from 'redux/actions/SyssettingActions';

const List = require('./List');

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(SyssettingActions, dispatch)
  };
}

@connect(({ syssetting }) => ({ syssetting }), mapDispatchToProps)
export default class Container extends Component {
  constructor(props) {
    super(props);
    this.pid = '';
  }

  static propTypes = {
    actions: PropTypes.object.isRequired,
    syssetting: PropTypes.object.isRequired
  }

  async show() {
    await this.props.actions.show();
    return this.props.syssetting.ecode;
  }

  async update(values) {
    await this.props.actions.update(values);
    return this.props.syssetting.ecode;
  }

  render() {
    return (
      <div className='doc-container'>
        <div>
          <List 
            show={ this.show.bind(this) }
            update={ this.update.bind(this) }
            { ...this.props.syssetting }/>
        </div>
      </div>
    );
  }
}

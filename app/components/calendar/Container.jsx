import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import * as CalendarActions from 'redux/actions/CalendarActions';
const List = require('./List');

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(CalendarActions, dispatch)
  };
}

@connect(({ i18n, calendar }) => ({ i18n, calendar }), mapDispatchToProps)
export default class Container extends Component {
  constructor(props) {
    super(props);
  }

  static propTypes = {
    i18n: PropTypes.object.isRequired,
    actions: PropTypes.object.isRequired,
    calendar: PropTypes.object.isRequired
  }

  async index(year) {
    await this.props.actions.index(year);
    return this.props.calendar.ecode;
  }

  async sync(year) {
    await this.props.actions.sync(year);
    return this.props.calendar.ecode;
  }

  async update(values) {
    await this.props.actions.update(values);
    return this.props.calendar.ecode;
  }

  render() {
    return (
      <div className='doc-container'>
        <List 
          index={ this.index.bind(this) } 
          sync={ this.sync.bind(this) } 
          update={ this.update.bind(this) } 
          i18n={ this.props.i18n }
          { ...this.props.calendar }/>
      </div>
    );
  }
}

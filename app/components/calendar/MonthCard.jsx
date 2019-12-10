import React, { PropTypes, Component } from 'react';
import { FormGroup, Col, Button, Label, Table, Panel } from 'react-bootstrap';
import { notify } from 'react-notify-toast';
import _ from 'lodash';

const loadimg = require('../../assets/images/loading.gif');

export default class MonthCard extends Component {
  constructor(props) {
    super(props);
    this.state = { ecode: 0 };
    this.arrange = this.arrange.bind(this);
    this.tdStyle = this.tdStyle.bind(this);
  }

  static propTypes = {
    loading: PropTypes.bool.isRequired,
    month: PropTypes.number.isRequired,
    today: PropTypes.string.isRequired,
    dates: PropTypes.array.isRequired
  }

  tdStyle(type, date) {
    const { today } = this.props;

    if (date === today) {
      return 'today-bg';
    } else if (type == 'workday') {
      return 'workday-bg';
    } else if (type == 'holiday') {
      return 'holiday-bg';
    } else {
      return '';
    }
  }

  dayStyle(val) {
    if (val.type == 'holiday') {
      return 'textdanger';
    } else if (val.type == 'workday') {
      return '';
    } else if (val.week == 6 || val.week == 7) {
      return 'textdanger';
    } else {
      return '';
    }
  }

  typeStyle(type) {
    if (type == 'workday') {
      return 'workday-mark';
    } else if (type == 'holiday') {
      return 'holiday-mark';
    } else {
      return '';
    }
  }

  typeText(type) {
    if (type == 'workday') {
      return '班';
    } else if (type == 'holiday') {
      return '休';
    } else {
      return '';
    }
  }

  arrange() {
    const { dates } = this.props;
    const newDates = _.clone(dates);

    const pre_add_cnt = _.first(dates).week - 1;
    for (let i = 0; i < pre_add_cnt; i++) {
      newDates.unshift({});
    }

    const post_add_cnt = 42 - newDates.length;
    for (let i = 0; i < post_add_cnt; i++) {
      newDates.push({});
    }

    const data = [];
    for (let i = 0; i < newDates.length; i = i + 7) {
      data.push(newDates.slice(i, i + 7));
    }
    return data;
  }

  render() {
    const { dates, month, loading } = this.props;

    const data = this.arrange();

    return (
      <div className='canlendaritem'>
        <div className='month'>{ month }</div>
        <table className='table'>
          <thead>
            <tr>
              <th>一</th>
              <th>二</th>
              <th>三</th>
              <th>四</th>
              <th>五</th>
              <th className='textdanger'>六</th>
              <th className='textdanger'>日</th>
            </tr>
          </thead>
          <tbody>
          { _.map(data, (val, key) => {
            return (
              <tr key={ key }>
                { _.map(val, (val2, key2) => {
                  return (
                    <td className={ this.tdStyle(val2.type, val2.date) } key={ key2 }>
                      <font className={ this.typeStyle(val2.type) }>{ this.typeText(val2.type) }</font>
                      <span className={ this.dayStyle(val2) }>{ val2.day || '' }</span>
                      <br/>
                      <font>{ val2.text ? val2.text : val2.lunar && val2.lunar.day || '' }</font> 
                    </td>
                  );
                }) }
              </tr>
            );
          }) }
          </tbody>
        </table>
      </div>
    );
  }
}

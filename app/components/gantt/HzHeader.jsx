import React, { PropTypes, Component } from 'react';
import _ from 'lodash';

export default class HzHeader extends Component {
  constructor(props) {
    super(props);
  }

  static propTypes = {
    cellWidth: PropTypes.number.isRequired,
    dates: PropTypes.array.isRequired,
    today: PropTypes.string.isRequired
  }

  render() {
    const { 
      cellWidth,
      dates, 
      today=''
    } = this.props;

    const w = _.flatten(_.values(dates)).length * cellWidth + 'px';
    return (
      <div className='ganttview-hzheader'>
        <div className='ganttview-hzheader-months' style={ { width: w } }>
        { _.map(dates, (v, key) =>
          <div className='ganttview-hzheader-month' key={ v.date } style={ { width: v.length * cellWidth + 'px' } }>
            { key }
          </div> ) }
        </div>
        <div className='ganttview-hzheader-days' style={ { width: w } }>
          { _.map(_.flatten(_.values(dates)), (v) =>
            <div className={ 'ganttview-hzheader-day ' + (v.date == today ? 'ganttview-today' : (v.notWorking === 1 ? 'ganttview-weekend' : '')) } style={ { width: cellWidth + 'px' } } key={ v.date }>
              { v.day }
            </div> ) }
        </div>
      </div>);
  }
}

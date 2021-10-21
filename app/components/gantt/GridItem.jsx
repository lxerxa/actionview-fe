import React, { PropTypes, Component } from 'react';
import _ from 'lodash';

export default class GridItem extends Component {
  constructor(props) {
    super(props);
  }

  static propTypes = {
    cellWidth: PropTypes.number.isRequired,
    offset: PropTypes.number.isRequired,
    clientWidth: PropTypes.number.isRequired,
    dates: PropTypes.array.isRequired,
    markedIssue: PropTypes.object.isRequired,
    issue: PropTypes.object.isRequired,
    today: PropTypes.string.isRequired
  }
 
  render() {
    const { 
      cellWidth,
      offset,
      clientWidth,
      dates, 
      markedIssue, 
      issue,
      today=''
    } = this.props;

    const lsn = _.max([ _.floor(offset / cellWidth) - 30, 0 ]);
    const ren = _.min([ _.floor((offset + clientWidth) / cellWidth) + 30, dates.length ]);

    return (
      <div
        className='ganttview-grid-row'
        style={ { width: dates.length * cellWidth + 'px' } }>
        { lsn > 0 &&
          <div
            className='ganttview-grid-row-cell'
            style={ { width: cellWidth * lsn + 'px' } }/> }
        { _.map(dates.slice(lsn, ren), (v, key) =>
          <div
            className={ 'ganttview-grid-row-cell ' + (v.date == today ? 'ganttview-today' : (v.notWorking === 1 ? 'ganttview-weekend' : '')) }
            style={ { backgroundColor: markedIssue.id == issue.id ? '#FFFACD' : '', width: cellWidth + 'px' } }
            key={ v.date }/> ) }
        { dates.length - ren > 0 &&
          <div
            className='ganttview-grid-row-cell'
            style={ { width: cellWidth * (dates.length - ren) + 'px' } }/> }
      </div>);
  }
}

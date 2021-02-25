import React, { PropTypes, Component } from 'react';
import _ from 'lodash';

export default class GridItem extends Component {
  constructor(props) {
    super(props);
  }

  static propTypes = {
    cellWidth: PropTypes.number.isRequired,
    dates: PropTypes.array.isRequired,
    markedIssue: PropTypes.object.isRequired,
    issue: PropTypes.object.isRequired,
    today: PropTypes.string.isRequired
  }
 
  shouldComponentUpdate(newProps, newState) {
    if (newProps.cellWidth != this.props.cellWidth 
      || newProps.dates.length != this.props.dates.length 
      || newProps.dates[0] != this.props.dates[0]
      || newProps.markedIssue.id == this.props.issue.id
      || this.props.markedIssue.id == this.props.issue.id) {
      return true;
    }
    return false;
  }

  render() {
    const { 
      cellWidth,
      dates, 
      markedIssue, 
      issue,
      today=''
    } = this.props;

    return (
      <div
        className='ganttview-grid-row'
        style={ { width: dates.length * cellWidth + 'px' } }>
        { _.map(dates, (v, key) =>
          <div
            className={ 'ganttview-grid-row-cell ' + (v.date == today ? 'ganttview-today' : (v.notWorking === 1 ? 'ganttview-weekend' : '')) }
            style={ { backgroundColor: markedIssue.id == issue.id ? '#FFFACD' : '', width: cellWidth + 'px' } }
            key={ v.date }/> ) }
      </div>);
  }
}

import React, { PropTypes, Component } from 'react';

export default class GridEmptyItem extends Component {
  constructor(props) {
    super(props);
  }

  static propTypes = {
    cellWidth: PropTypes.number.isRequired,
    dates: PropTypes.array.isRequired
  }
 
  render() {
    const { 
      cellWidth,
      dates 
    } = this.props;

    return (
      <div
        className='ganttview-grid-row'
        style={ { width: dates.length * cellWidth + 'px' } }>
        <div
          className='ganttview-grid-row-cell'
          style={ { width: cellWidth * dates.length + 'px' } }/>
      </div>
    );
  }
}

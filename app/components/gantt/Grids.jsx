import React, { PropTypes, Component } from 'react';
import _ from 'lodash';

const $ = require('$');
const GridItem = require('./GridItem');
const GridEmptyItem = require('./GridEmptyItem');

export default class Grids extends Component {
  constructor(props) {
    super(props);
  }

  static propTypes = {
    cellWidth: PropTypes.number.isRequired,
    collection: PropTypes.array.isRequired,
    dates: PropTypes.object.isRequired,
    foldIssues: PropTypes.array.isRequired,
    markedIssue: PropTypes.object.isRequired,
    today: PropTypes.string.isRequired
  }

  render() {
    const { 
      cellWidth,
      collection, 
      dates, 
      foldIssues, 
      markedIssue, 
      today=''
    } = this.props;

    let offset = 0;
    let clientWidth = document.body.clientWidth;
    let scrollTop = 0;
    let clientHeight = document.body.clientHeight;
    if ($('div.ganttview-slide-container').length > 0) {
      offset = $('div.ganttview-slide-container').scrollLeft();
      clientWidth = $('div.ganttview-slide-container').get(0).clientWidth;
      scrollTop = $('div.ganttview-slide-container').scrollTop();
      clientHeight = $('div.ganttview-slide-container').get(0).clientHeight;
    }

    const dates2 = _.flatten(_.values(dates));
    const newCollection = _.reject(collection, (v) => v.parent && foldIssues.indexOf(v.parent.id) != -1);

    const topInd = _.max([ _.floor(scrollTop / 31) - 10, 0 ]);
    const bottomInd = _.min([ _.floor((scrollTop + clientHeight) / 31) + 10, newCollection.length - 1 ]);

    return (
      <div
        className='ganttview-grid'
        style={ { width: dates2.length * cellWidth + 'px' } }>
      { _.map(newCollection, (v, key) => {
        if (key < topInd || key > bottomInd) {
          return (
            <GridEmptyItem
              key={ v.id }
              cellWidth={ cellWidth }
              dates={ dates2 } />
            );
        } else {
          return (
            <GridItem
              key={ v.id }
              offset={ offset }
              clientWidth={ clientWidth }
              cellWidth={ cellWidth }
              dates={ dates2 }
              issue={ v }
              markedIssue={ markedIssue }
              today={ today } />
            );
        }
      } ) }
      </div>);
  }
}
